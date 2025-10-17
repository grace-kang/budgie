# frozen_string_literal: true

class TransactionsController < ApplicationController
  def create
    @budget = Budget.find(params[:budget_id])
    @transaction = Transaction.new(transaction_params)
    if @transaction.save
      redirect_to @budget
    else
      @transactions = Transaction.where(budget_id: @budget.id)
      render 'budgets/show', status: :unprocessable_entity
    end
  end

  def destroy
    @transaction = Transaction.find(params[:id])
    @budget = Budget.find(@transaction.budget_id)
    if @transaction.destroy
      redirect_to @budget
    else
      redirect_to @budget, status: :not_found
    end
  end

  private

  def transaction_params
    params.expect(transaction: %i[description amount date budget_id])
  end
end
