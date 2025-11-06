# frozen_string_literal: true

Rails
  .application
  .routes
  .draw do
    root 'spa#index'

    resources :months, shallow: true, only: %i[index create destroy] do
      resources :budgets, shallow: true, only: %i[show edit create update destroy] do
        resources :transactions, only: %i[create destroy]
      end
    end

    get '/auth/:provider/callback', to: 'sessions#create'
  end
