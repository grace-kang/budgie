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
