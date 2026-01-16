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
    selected_budget = find_budget(params[:budget_id])
    month = find_or_create_month_from_date(params[:date])
    budget = find_or_create_budget_for_month(selected_budget, month)

    budget.transactions.new(
      description: params[:description],
      amount: params[:amount],
      date: params[:date],
      month: month
    )
  end

  def prepare_update_params(transaction, params)
    date_to_use = params[:date].presence || transaction.date.to_s
    target_month = find_or_create_month_from_date(date_to_use)
    params[:month_id] = target_month.id

    current_budget = determine_budget_to_use(transaction, params)
    if budget_needs_migration?(current_budget, target_month)
      params[:budget_id] = find_or_create_budget_for_month(current_budget, target_month).id
    end

    params
  end

  private

  def find_budget(budget_id)
    @user.budgets.find(budget_id)
  end

  def find_or_create_budget_for_month(source_budget, target_month)
    return source_budget if source_budget.month_id == target_month.id

    target_month.budgets.find_or_create_by(name: source_budget.name, user: @user) do |budget|
      budget.total = source_budget.total
    end
  end

  def find_or_create_month_from_date(date_string)
    date = Date.parse(date_string)
    @user.months.find_or_create_by(month: date.month, year: date.year)
  end

  def determine_budget_to_use(transaction, params)
    params[:budget_id].present? ? @user.budgets.find_by(id: params[:budget_id]) : transaction.budget
  end

  def budget_needs_migration?(budget, target_month)
    budget.present? && budget.month_id != target_month.id
  end
end
