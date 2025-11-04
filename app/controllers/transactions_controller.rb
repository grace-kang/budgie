# frozen_string_literal: true

class TransactionsController < ApplicationController
  def create
    budget = Budget.find(params[:budget_id])
    transaction = budget.transactions.new(transaction_params)
    if transaction.save
      render json: transaction, status: :created
    else
      render json: transaction.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @transaction = Transaction.find(params[:id])
    @budget = Budget.find(@transaction.budget_id)
    if @transaction.destroy
      render json: { message: 'Transaction deleted' }, status: :ok
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  private

  def transaction_params
    params.expect(transaction: %i[description amount date budget_id])
  end
end
