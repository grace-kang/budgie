# frozen_string_literal: true

require 'plaid'

class PlaidService
  def initialize
    configuration = Plaid::Configuration.new
    configuration.server_index = Plaid::Configuration::Environment[ENV.fetch('PLAID_ENV', 'sandbox')]
    configuration.api_key['PLAID-CLIENT-ID'] = ENV.fetch('PLAID_CLIENT_ID')
    configuration.api_key['PLAID-SECRET'] = ENV.fetch('PLAID_SECRET')

    api_client = Plaid::ApiClient.new(configuration)
    @client = Plaid::PlaidApi.new(api_client)
  end

  def create_link_token(user_id)
    request = Plaid::LinkTokenCreateRequest.new(
      {
        user: {
          client_user_id: user_id.to_s
        },
        client_name: 'Budgie Budgeting App',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en'
      }
    )

    response = @client.link_token_create(request)
    response.link_token
  end

  def exchange_public_token(public_token)
    request = Plaid::ItemPublicTokenExchangeRequest.new(
      {
        public_token: public_token
      }
    )

    response = @client.item_public_token_exchange(request)
    {
      access_token: response.access_token,
      item_id: response.item_id
    }
  end

  def get_institution_name(institution_id)
    request = Plaid::InstitutionsGetByIdRequest.new(
      {
        institution_id: institution_id,
        country_codes: ['US']
      }
    )

    response = @client.institutions_get_by_id(request)
    response.institution.name
  rescue Plaid::ApiError => e
    Rails.logger.error "Failed to get institution name: #{e.message}"
    'Unknown Institution'
  end

  def get_accounts(access_token)
    request = Plaid::AccountsGetRequest.new(
      {
        access_token: access_token
      }
    )

    response = @client.accounts_get(request)
    response.accounts
  end

  def get_item(access_token)
    request = Plaid::ItemGetRequest.new(
      {
        access_token: access_token
      }
    )

    response = @client.item_get(request)
    response.item
  end

  def get_transactions(access_token, cursor: nil, start_date: nil, end_date: nil)
    request = Plaid::TransactionsSyncRequest.new(
      {
        access_token: access_token,
        cursor: cursor,
        count: 500
      }
    )

    response = @client.transactions_sync(request)

    added_count = response.added&.length || 0
    modified_count = response.modified&.length || 0
    removed_count = response.removed&.length || 0

    Rails.logger.info "Plaid API response: #{added_count} added, #{modified_count} modified, #{removed_count} removed, has_more: #{response.has_more}"

    {
      transactions: response.added + response.modified,
      removed: response.removed,
      has_more: response.has_more,
      next_cursor: response.next_cursor
    }
  rescue Plaid::ApiError => e
    Rails.logger.error "Plaid API error: #{e.message}"
    Rails.logger.error "Error response: #{e.response_body}"
    raise
  end

  def remove_item(access_token)
    request = Plaid::ItemRemoveRequest.new(
      {
        access_token: access_token
      }
    )

    @client.item_remove(request)
  end
end
