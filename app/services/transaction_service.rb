# frozen_string_literal: true

# Service object responsible for building and preparing transactions.
# Handles the creation of months and budgets when they don't exist yet,
# allowing transactions to be created for any date even if the corresponding
# month or budget hasn't been set up. When a budget from a different month
# is selected, it automatically finds or creates a matching budget in the
# correct month.
class TransactionService
  def initialize(user)
    @user = user
  end

  def build_transaction(params)
    month = find_or_create_month_from_date(params[:date])
    budget = find_or_create_budget_for_month(params[:budget_id], month) if params[:budget_id].present?

    @user.transactions.new(
      description: params[:description],
      amount: params[:amount],
      date: params[:date],
      month: month,
      budget: budget
    )
  end

  def prepare_update_params(transaction, params)
    date_to_use = params[:date].presence || transaction.date.to_s
    target_month = find_or_create_month_from_date(date_to_use)

    params.to_h.merge(
      month_id: target_month.id,
      budget_id: determine_budget_id_for_update(transaction, params, target_month)
    )
  end

  private

  def determine_budget_id_for_update(transaction, params, target_month)
    if params.key?(:budget_id)
      params[:budget_id].blank? ? nil : find_or_create_budget_for_month(params[:budget_id], target_month)&.id
    elsif needs_budget_migration?(transaction, target_month)
      find_or_create_budget_for_month(transaction.budget.id, target_month)&.id
    else
      transaction.budget_id
    end
  end

  def needs_budget_migration?(transaction, target_month)
    transaction.budget && transaction.budget.month_id != target_month.id
  end

  def find_or_create_budget_for_month(budget_id, target_month)
    return nil if budget_id.blank?

    source_budget = @user.budgets.find_by(id: budget_id)
    return nil unless source_budget
    return source_budget if source_budget.month_id == target_month.id

    target_month.budgets.find_or_create_by(name: source_budget.name, user: @user) do |budget|
      budget.total = source_budget.total
    end
  end

  def find_or_create_month_from_date(date_string)
    date = Date.parse(date_string)
    @user.months.find_or_create_by(month: date.month, year: date.year)
  end
end
