# frozen_string_literal: true

class TransactionsController < ApplicationController
  def create
    @budget = Budget.find(params[:budget_id])
    @transaction = Transaction.new(transaction_params)
    if @transaction.save
      redirect_to @budget
    else
      render 'budgets/show', status: :unprocessable_entity
    end
  end

  private

  def transaction_params
    params.expect(transaction: %i[description amount date budget_id])
  end
end
