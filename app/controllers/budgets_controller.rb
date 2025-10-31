# frozen_string_literal: true

class BudgetsController < ApplicationController
  before_action :set_budget, only: %i[show edit update destroy]

  def show
    @transaction = Transaction.new
    @transactions = Transaction.where(budget_id: @budget.id) || []
  end

  def edit; end

  def create
    @month = Month.find(params[:month_id])
    @budget = @month.budgets.build(budget_params)
    if @budget.save
      render json: @budget, status: :created
    else
      render json: @budget.errors, status: :unprocessable_entity
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
    @budget = Budget.find(params[:id])
  end

  def budget_params
    params.expect(budget: %i[name total])
  end
end
