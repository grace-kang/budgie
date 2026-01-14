# frozen_string_literal: true

Rails
  .application
  .routes
  .draw do
    root 'spa#index'

    resources :months, only: [:index]

    resources :budgets, only: %i[index show edit create update destroy] do
      resources :transactions, only: %i[index create destroy]
    end

    resources :transactions, only: %i[index update]

    # Plaid integration routes (feature flagged)
    if FeatureFlags.plaid_enabled?
      post '/plaid/link_token', to: 'plaid#create_link_token'
      post '/plaid/exchange_token', to: 'plaid#exchange_token'
      get '/plaid/accounts', to: 'plaid#accounts'
      post '/plaid/accounts/:id/sync', to: 'plaid#sync'
      delete '/plaid/accounts/:id', to: 'plaid#destroy'
      post '/plaid/webhook', to: 'plaid#webhook'
    end

    get '/auth/:provider/callback', to: 'sessions#create'

    get '/user/preferences', to: 'users#preferences'
    patch '/user/preferences', to: 'users#update_preferences'

    get '/feature_flags', to: 'application#feature_flags'

    get '*path', to: 'spa#index', constraints: ->(req) { !req.xhr? && req.format.html? }
  end
