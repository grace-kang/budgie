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
      redirect_to months_path
    else
      @months = Month.all
      @budget = Budget.new
      redirect_to months_path, status: :unprocessable_entity
    end
  end

  def update
    if @budget.update(budget_params)
      redirect_to months_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @budget.destroy
      redirect_to months_path
    else
      redirect_to months_path, status: :not_found
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
