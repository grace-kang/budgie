# frozen_string_literal: true

require_relative 'boot'

# So development/test use database.yml (local). Rails otherwise uses ENV['DATABASE_URL'],
# which may be empty or point at production (e.g. Railway).
ENV.delete('DATABASE_URL') unless ENV['RAILS_ENV'] == 'production'

require 'rails/all'

Bundler.require(*Rails.groups)

module Budgie
  class Application < Rails::Application
    config.load_defaults 8.0
    config.autoload_lib(ignore: %w[assets tasks])
  end
end
