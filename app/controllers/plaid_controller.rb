# frozen_string_literal: true

class PlaidController < ApplicationController
  skip_before_action :authorize_request, only: :webhook

  def create_link_token
    plaid_service = PlaidService.new
    link_token = plaid_service.create_link_token(current_user.id)

    render json: { link_token: link_token }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Failed to create link token: #{e.message}"
    render json: { error: 'Failed to create link token' }, status: :internal_server_error
  end

  def exchange_token
    public_token = params[:public_token]
    return render json: { error: 'public_token is required' }, status: :bad_request if public_token.blank?

    plaid_service = PlaidService.new
    result = plaid_service.exchange_public_token(public_token)

    # Get institution info from item
    item = plaid_service.get_item(result[:access_token])
    institution_id = item.institution_id
    institution_name = if institution_id
                         plaid_service.get_institution_name(institution_id)
                       else
                         'Unknown Institution'
                       end

    # Create or update PlaidAccount
    plaid_account = current_user.plaid_accounts.find_or_initialize_by(item_id: result[:item_id])
    plaid_account.assign_attributes(
      access_token: result[:access_token],
      institution_id: institution_id,
      institution_name: institution_name
    )

    if plaid_account.save
      # Trigger initial sync
      PlaidSyncTransactionsJob.perform_later(plaid_account.id)

      render json: {
        plaid_account: {
          id: plaid_account.id,
          institution_name: plaid_account.institution_name,
          item_id: plaid_account.item_id
        }
      }, status: :ok
    else
      render json: { errors: plaid_account.errors.full_messages }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error "Failed to exchange public token: #{e.message}"
    render json: { error: 'Failed to connect account' }, status: :internal_server_error
  end

  def accounts
    plaid_accounts = current_user.plaid_accounts
    render json: plaid_accounts.map { |account|
      {
        id: account.id,
        institution_name: account.institution_name,
        item_id: account.item_id,
        last_successful_update: account.last_successful_update
      }
    }, status: :ok
  end

  def sync
    plaid_account = current_user.plaid_accounts.find(params[:id])

    # If force_resync parameter is true, reset cursor to get all historical transactions
    plaid_account.update(cursor: nil) if ['true', true].include?(params[:force_resync])

    PlaidSyncTransactionsJob.perform_later(plaid_account.id)

    render json: { message: 'Sync started' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Plaid account not found' }, status: :not_found
  end

  def destroy
    plaid_account = current_user.plaid_accounts.find(params[:id])

    begin
      plaid_service = PlaidService.new
      plaid_service.remove_item(plaid_account.access_token)
    rescue StandardError => e
      Rails.logger.error "Failed to remove Plaid item: #{e.message}"
    end

    plaid_account.destroy
    render json: { message: 'Account disconnected' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Plaid account not found' }, status: :not_found
  end

  def webhook
    # Handle Plaid webhooks
    webhook_type = params[:webhook_type]
    webhook_code = params[:webhook_code]
    item_id = params[:item_id]

    Rails.logger.info "Received Plaid webhook: #{webhook_type} - #{webhook_code} for item #{item_id}"

    plaid_account = PlaidAccount.find_by(item_id: item_id)
    return render json: { error: 'Account not found' }, status: :not_found unless plaid_account

    case webhook_type
    when 'TRANSACTIONS'
      handle_transactions_webhook(plaid_account, webhook_code)
    when 'ITEM'
      handle_item_webhook(plaid_account, webhook_code)
    end

    render json: { received: true }, status: :ok
  end

  private

  def handle_transactions_webhook(plaid_account, webhook_code)
    case webhook_code
    when 'SYNC_UPDATES_AVAILABLE'
      # New transactions available, trigger sync
      PlaidSyncTransactionsJob.perform_later(plaid_account.id)
    when 'INITIAL_UPDATE', 'HISTORICAL_UPDATE', 'DEFAULT_UPDATE'
      # Trigger sync for these update types
      PlaidSyncTransactionsJob.perform_later(plaid_account.id)
    end
  end

  def handle_item_webhook(plaid_account, webhook_code)
    case webhook_code
    when 'ERROR'
      Rails.logger.error "Plaid item error for account #{plaid_account.id}"
    when 'PENDING_EXPIRATION'
      Rails.logger.warn "Plaid access token expiring soon for account #{plaid_account.id}"
    end
  end
end
