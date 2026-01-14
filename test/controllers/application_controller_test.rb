# frozen_string_literal: true

require 'test_helper'

class ApplicationControllerTest < ActionDispatch::IntegrationTest
  test 'returns feature flags' do
    get '/feature_flags'

    assert_response :success
    json = response.parsed_body
    assert_includes json, 'plaid_enabled'
    assert_equal true, json['plaid_enabled'] # Should be true in test environment
  end

  test 'feature flags endpoint does not require authentication' do
    # Don't provide auth headers
    get '/feature_flags'

    assert_response :success # Should not return 401
  end

  test 'returns correct flag when disabled' do
    original_value = ENV.fetch('ENABLE_PLAID', nil)
    ENV['ENABLE_PLAID'] = 'false'

    get '/feature_flags'

    assert_response :success
    json = response.parsed_body
    assert_equal false, json['plaid_enabled']
  ensure
    ENV['ENABLE_PLAID'] = original_value
  end
end
