# frozen_string_literal: true

require 'plaid' if FeatureFlags.plaid_enabled?

class PlaidService
  def initialize
    raise 'Plaid integration is not enabled' unless FeatureFlags.plaid_enabled?

    configuration = Plaid::Configuration.new
    configuration.server_index = Plaid::Configuration::Environment[ENV.fetch('PLAID_ENV', 'sandbox')]
    configuration.api_key['PLAID-CLIENT-ID'] = ENV.fetch('PLAID_CLIENT_ID')
    configuration.api_key['PLAID-SECRET'] = ENV.fetch('PLAID_SECRET')

    api_client = Plaid::ApiClient.new(configuration)
    @client = Plaid::PlaidApi.new(api_client)
  end

  def create_link_token(user_id)
    request = build_link_token_request(user_id)
    response = @client.link_token_create(request)
    response.link_token
  end

  def exchange_public_token(public_token)
    request = Plaid::ItemPublicTokenExchangeRequest.new(public_token: public_token)
    response = @client.item_public_token_exchange(request)
    { access_token: response.access_token, item_id: response.item_id }
  end

  def get_institution_name(institution_id)
    request = build_institution_request(institution_id)
    response = @client.institutions_get_by_id(request)
    response.institution.name
  rescue Plaid::ApiError => e
    Rails.logger.error "Failed to get institution name: #{e.message}"
    'Unknown Institution'
  end

  def get_accounts(access_token)
    @client.accounts_get(Plaid::AccountsGetRequest.new(access_token: access_token)).accounts
  end

  def get_item(access_token)
    @client.item_get(Plaid::ItemGetRequest.new(access_token: access_token)).item
  end

  def get_transactions(access_token, cursor: nil, _start_date: nil, _end_date: nil)
    request = build_transactions_sync_request(access_token, cursor)
    response = @client.transactions_sync(request)
    process_transactions_response(response)
  rescue Plaid::ApiError => e
    log_plaid_api_error(e)
    raise
  end

  def process_transactions_response(response)
    {
      transactions: response.added + response.modified,
      removed: response.removed,
      has_more: response.has_more,
      next_cursor: response.next_cursor
    }
  end

  def log_plaid_api_error(error)
    Rails.logger.error "Plaid API error: #{error.message}"
    Rails.logger.error "Error response: #{error.response_body}"
  end

  def remove_item(access_token)
    @client.item_remove(Plaid::ItemRemoveRequest.new(access_token: access_token))
  end

  private

  def build_link_token_request(user_id)
    Plaid::LinkTokenCreateRequest.new(
      user: { client_user_id: user_id.to_s },
      client_name: 'Budgie Budgeting App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en'
    )
  end

  def build_institution_request(institution_id)
    Plaid::InstitutionsGetByIdRequest.new(institution_id: institution_id, country_codes: ['US'])
  end

  def build_transactions_sync_request(access_token, cursor)
    Plaid::TransactionsSyncRequest.new(access_token: access_token, cursor: cursor, count: 500)
  end
end
