# frozen_string_literal: true

class BudgetsController < ApplicationController
  before_action :authorize_request
  before_action :set_budget, only: %i[update destroy update_custom_limit]

  def index
    budgets = current_user.budgets.includes(:transactions, :custom_budget_limits).all

    render json: budgets.as_json(include: %i[transactions custom_budget_limits]), status: :ok
  end

  def show
    budget = current_user.budgets.includes(:transactions, :custom_budget_limits).find(params[:id])

    render json: budget.as_json(include: %i[transactions custom_budget_limits]), status: :ok
  end

  def edit; end

  def create
    budget = current_user.budgets.build(budget_params)
    if budget.save
      render json: budget.as_json(include: :custom_budget_limits), status: :created
    else
      render json: budget.errors, status: :unprocessable_entity
    end
  end

  def update
    if @budget.update(budget_params)
      render json: @budget.as_json(include: :custom_budget_limits), status: :ok
    else
      render json: @budget.errors, status: :unprocessable_entity
    end
  end

  def update_custom_limit
    month = current_user.months.find(params[:month_id])
    custom_limit = @budget.custom_budget_limits.find_or_initialize_by(month: month)
    custom_limit.limit = custom_limit_params

    if custom_limit.save
      render json: @budget.reload.as_json(include: :custom_budget_limits), status: :ok
    else
      render json: custom_limit.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @budget.destroy
      render json: { message: 'Budget deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete budget' }, status: :unprocessable_entity
    end
  end

  private

  def set_budget
    @budget = current_user.budgets.find(params[:id])
  end

  def budget_params
    params.expect(budget: %i[name total])
  end

  def custom_limit_params
    params.require(:limit)
  end
end
