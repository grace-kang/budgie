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
    transaction = transaction_service.build_transaction(transaction_params)
    if transaction.save
      render json: transaction, status: :created
    else
      render json: transaction.errors, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Budget not found' }, status: :not_found
  rescue ArgumentError
    render json: { error: 'Invalid date format' }, status: :bad_request
  end

  def update
    @transaction = current_user.transactions.find(params[:id])
    params_to_update = transaction_params

    return render json: { error: 'Budget not found' }, status: :not_found unless valid_budget_update?(params_to_update)

    params_to_update = transaction_service.prepare_update_params(@transaction, params_to_update)
    update_transaction_with_response(params_to_update)
  rescue ArgumentError
    render json: { error: 'Invalid date format' }, status: :bad_request
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

  def transaction_service
    @transaction_service ||= TransactionService.new(current_user)
  end

  def invalid_budget?
    params[:budget_id].present? && current_user.budgets.find_by(id: params[:budget_id]).nil?
  end

  def transaction_params
    # rubocop:disable Rails/StrongParametersExpect
    params.require(:transaction).permit(:description, :amount, :date, :budget_id)
    # rubocop:enable Rails/StrongParametersExpect
  end

  def valid_budget_update?(params_to_update)
    return true if params_to_update[:budget_id].blank?
    return true if params_to_update[:budget_id].to_i == @transaction.budget_id

    current_user.budgets.exists?(id: params_to_update[:budget_id])
  end

  def update_transaction_with_response(params_to_update)
    if @transaction.update(params_to_update)
      render json: @transaction, status: :ok
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end
end
