# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.2.2'

gem 'bootsnap', require: false
gem 'propshaft'
gem 'puma', '>= 5.0'
gem 'rails', '~> 8.0.3'

group :development, :test do
  gem 'brakeman', require: false
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'
  gem 'rubocop-rails-omakase', require: false
end

group :development do
  gem 'web-console'
end

gem 'dotenv-rails', groups: %i[development test]
gem 'erb-formatter', '~> 0.7.3'
gem 'erb_lint'
gem 'jwt'
gem 'omniauth', '~> 2.1'
gem 'omniauth-google-oauth2', '~> 1.2'
gem 'omniauth-rails_csrf_protection', '~> 1.0'
gem 'pg'
gem 'plaid', '~> 22.0'
gem 'ruby-lsp', '~> 0.26.1', group: :development
gem 'vite_rails', '~> 3.0'

group :production do
	gem "thruster"
end
