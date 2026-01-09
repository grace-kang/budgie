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
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Budget not found' }, status: :not_found
  rescue ArgumentError
    render json: { error: 'Invalid date format' }, status: :bad_request
  end

  def update
    @transaction = current_user.transactions.find(params[:id])
    params_to_update = transaction_params

    return render json: { error: 'Budget not found' }, status: :not_found unless valid_budget_update?(params_to_update)

    prepare_month_for_update(params_to_update)
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

  def build_transaction
    budget = find_budget
    month = find_or_create_month_from_date
    budget.transactions.new(transaction_params.merge(month: month))
  end

  def find_budget
    current_user.budgets.find(params[:budget_id])
  end

  def find_or_create_month_from_date
    find_or_create_month_from_date_string(transaction_params[:date])
  end

  def invalid_budget?
    params[:budget_id].present? && current_user.budgets.find_by(id: params[:budget_id]).nil?
  end

  def transaction_params
    # rubocop:disable Rails/StrongParametersExpect
    # Using permit explicitly to ensure nested transaction params are permitted for mass assignment
    params.require(:transaction).permit(:description, :amount, :date, :budget_id)
    # rubocop:enable Rails/StrongParametersExpect
  end

  def valid_budget_update?(params_to_update)
    return true if params_to_update[:budget_id].blank?
    return true if params_to_update[:budget_id].to_i == @transaction.budget_id

    current_user.budgets.exists?(id: params_to_update[:budget_id])
  end

  def prepare_month_for_update(params_to_update)
    date_to_use = params_to_update[:date].presence || @transaction.date.to_s
    month = find_or_create_month_from_date_string(date_to_use)
    params_to_update[:month_id] = month.id
  end

  def update_transaction_with_response(params_to_update)
    if @transaction.update(params_to_update)
      render json: @transaction, status: :ok
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  def find_or_create_month_from_date_string(date_str)
    date = Date.parse(date_str)
    month_number = date.month
    year = date.year

    current_user.months.find_or_create_by(month: month_number, year: year)
  end
end
