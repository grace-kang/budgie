# frozen_string_literal: true

Rails
  .application
  .routes
  .draw do
    root 'budgets#index'

    resources :budgets do
      resources :transactions, only: %i[create destroy]
    end
  end
