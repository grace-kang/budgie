# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.2.2'

gem 'rails', '~> 8.0.3'
gem 'propshaft'
gem 'puma', '>= 5.0'
gem 'bootsnap', require: false

group :development, :test do
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'
  gem 'brakeman', require: false
  gem 'rubocop-rails-omakase', require: false
end

group :development do
  gem 'web-console'
end

gem 'erb_lint'
gem 'ruby-lsp', '~> 0.26.1', group: :development
gem 'erb-formatter', '~> 0.7.3'
gem 'vite_rails', '~> 3.0'
gem 'pg'
gem 'jwt'
gem 'omniauth', '~> 2.1'
gem 'omniauth-google-oauth2', '~> 1.2'
gem 'omniauth-rails_csrf_protection', '~> 1.0'
gem 'dotenv-rails', groups: %i[development test]
