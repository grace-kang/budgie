# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

module ViteHelpersStub
  def vite_javascript_tag(*_args)
    '' # return empty string instead of raising
  end

  def vite_client_tag(*_args)
    ''
  end
end

# Include in all views during tests
ActiveSupport.on_load(:action_view) { include ViteHelpersStub }

def auth_user
  @auth_user ||= User.find_or_create_by!(email: 'test@example.com') do |user|
    user.name = 'Test User'
    user.provider = 'google_oauth2'
    user.uid = '1234567890'
  end
end

def auth_headers(user = auth_user)
  token = JsonWebToken.encode(user_id: user.id)
  { 'Authorization' => "Bearer #{token}" }
end

# Helper for stubbing PlaidService in tests
# Usage:
#   stub_plaid_service do |mock|
#     def mock.create_link_token(_user_id)
#       'link-token-123'
#     end
#
#     # test code here
#     post '/plaid/link_token', headers: @headers
#   end
def stub_plaid_service(mock_service = nil, &)
  mock = mock_service || Object.new
  original_new = PlaidService.method(:new)

  # If no mock_service was provided, yield the mock for configuration
  # Then execute the rest of the block as test code
  PlaidService.define_singleton_method(:new) { mock }
  begin
    yield(mock)
  ensure
    PlaidService.define_singleton_method(:new) { |*args| original_new.call(*args) }
  end
end
