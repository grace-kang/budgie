# frozen_string_literal: true

Rails
  .application
  .routes
  .draw do
    root 'months#index'

    resources :months, shallow: true do
      resources :budgets, shallow: true do
        resources :transactions, only: %i[create destroy]
      end
    end
  end
