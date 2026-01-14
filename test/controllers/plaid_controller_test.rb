# frozen_string_literal: true

require 'test_helper'

# Test doubles for Plaid objects
Account = Struct.new(:institution_id, keyword_init: true)
Item = Struct.new(:institution_id, keyword_init: true)

# rubocop:disable Metrics/ClassLength
class PlaidControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = auth_user
    @headers = auth_headers(@user)
  end

  test 'creates link token' do
    stub_plaid_service do |mock|
      mock.define_singleton_method(:create_link_token) do |_user_id|
        'link-token-123'
      end

      post '/plaid/link_token', headers: @headers

      assert_response :success
      json = response.parsed_body
      assert_equal 'link-token-123', json['link_token']
    end
  end

  test 'exchanges public token' do
    stub_plaid_service do |mock|
      mock.define_singleton_method(:exchange_public_token) do |_public_token|
        { access_token: 'access-token-123', item_id: 'item-123' }
      end

      mock.define_singleton_method(:get_item) do |_access_token|
        Item.new(institution_id: 'ins_123')
      end

      mock.define_singleton_method(:get_institution_name) do |_institution_id|
        'Test Bank'
      end

      assert_difference('PlaidAccount.count', 1) do
        post '/plaid/exchange_token', headers: @headers, params: {
          public_token: 'public-token-123'
        }
      end

      assert_response :success
      json = response.parsed_body
      assert json['plaid_account']
      assert_equal 'Test Bank', json['plaid_account']['institution_name']
    end
  end

  test 'fails to exchange token without public_token' do
    post '/plaid/exchange_token', headers: @headers, params: {}

    assert_response :bad_request
    json = response.parsed_body
    assert_equal 'public_token is required', json['error']
  end

  test 'lists plaid accounts' do
    plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank'
    )

    get '/plaid/accounts', headers: @headers

    assert_response :success
    json = response.parsed_body
    assert_equal 1, json.length
    assert_equal plaid_account.id, json.first['id']
    assert_equal 'Test Bank', json.first['institution_name']
  end

  test 'syncs plaid account' do
    plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank'
    )

    post "/plaid/accounts/#{plaid_account.id}/sync", headers: @headers

    assert_response :success
    json = response.parsed_body
    assert_equal 'Sync started', json['message']
  end

  test 'syncs with force_resync' do
    plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank',
      cursor: 'some-cursor'
    )

    post "/plaid/accounts/#{plaid_account.id}/sync?force_resync=true", headers: @headers

    assert_response :success
    plaid_account.reload
    assert_nil plaid_account.cursor
  end

  test 'fails to sync non-existent account' do
    post '/plaid/accounts/999/sync', headers: @headers

    assert_response :not_found
  end

  test 'deletes plaid account' do
    plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank'
    )

    stub_plaid_service do |mock|
      mock.define_singleton_method(:remove_item) do |_access_token|
        true
      end

      assert_difference('PlaidAccount.count', -1) do
        delete "/plaid/accounts/#{plaid_account.id}", headers: @headers
      end

      assert_response :success
    end
  end

  test 'handles webhook' do
    plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank'
    )

    post '/plaid/webhook', params: {
      webhook_type: 'TRANSACTIONS',
      webhook_code: 'SYNC_UPDATES_AVAILABLE',
      item_id: plaid_account.item_id
    }

    assert_response :success
  end

  test 'requires authentication for protected endpoints' do
    post '/plaid/link_token'
    assert_response :unauthorized

    get '/plaid/accounts'
    assert_response :unauthorized
  end

  test 'returns forbidden when feature flag is disabled' do
    # Temporarily disable feature flag
    original_value = ENV.fetch('ENABLE_PLAID', nil)
    ENV['ENABLE_PLAID'] = 'false'

    post '/plaid/link_token', headers: @headers
    assert_response :forbidden
    json = response.parsed_body
    assert_equal 'Plaid integration is not enabled', json['error']
  ensure
    ENV['ENABLE_PLAID'] = original_value
  end
end
# rubocop:enable Metrics/ClassLength
