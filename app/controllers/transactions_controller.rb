# frozen_string_literal: true

class TransactionsController < ApplicationController
  def index
    return render json: { error: 'Budget not found' }, status: :not_found if invalid_budget?

    transactions = if params[:budget_id].present?
                     current_user.transactions.where(budget_id: params[:budget_id])
                   else
                     current_user.transactions
                   end
    render json: transactions, status: :ok
  end

  def create
    transaction = build_transaction
    if transaction.save
      render json: transaction, status: :created
    else
      render json: transaction.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @transaction = current_user.transactions.find(params[:id])
    @budget = current_user.budgets.find(@transaction.budget_id)
    if @transaction.destroy
      render json: { message: 'Transaction deleted' }, status: :ok
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  private

  def build_transaction
    budget = find_budget
    month = find_month
    budget.transactions.new(transaction_params.merge(month: month))
  end

  def find_budget
    current_user.budgets.find(params[:budget_id])
  end

  def find_month
    current_user.months.find(params[:transaction][:month_id])
  end

  def invalid_budget?
    params[:budget_id].present? && current_user.budgets.find_by(id: params[:budget_id]).nil?
  end

  def transaction_params
    # rubocop:disable Rails/StrongParametersExpect
    # Using permit explicitly to ensure nested transaction params are permitted for mass assignment
    params.require(:transaction).permit(:description, :amount, :date, :budget_id, :month_id)
    # rubocop:enable Rails/StrongParametersExpect
  end
end
