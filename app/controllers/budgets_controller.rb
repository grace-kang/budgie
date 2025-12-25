# frozen_string_literal: true

class BudgetsController < ApplicationController
  before_action :authorize_request
  before_action :set_budget, only: %i[update destroy]

  def index
    budgets = current_user.budgets.includes(:transactions).all

    render json: budgets.as_json(include: :transactions), status: :ok
  end

  def show
    budget = current_user.budgets.includes(:transactions).find(params[:id])

    render json: budget.as_json(include: :transactions), status: :ok
  end

  def edit; end

  def create
    budget = current_user.budgets.build(budget_params)
    if budget.save
      render json: budget, status: :created
    else
      render json: budget.errors, status: :unprocessable_entity
    end
  end

  def update
    if @budget.update(budget_params)
      render json: @budget, status: :ok
    else
      render json: @budget.errors, status: :unprocessable_entity
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
end
