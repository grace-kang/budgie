# frozen_string_literal: true

class BudgetsController < ApplicationController
  before_action :set_budget, only: %i[show edit update destroy]

  def index
    @budgets = Budget.all
  end

  def show
    @transaction = Transaction.new
    @transactions = Transaction.where(budget_id: @budget.id)
  end

  def new
    @budget = Budget.new
  end

  def edit; end

  def create
    @budget = Budget.new(budget_params)
    if @budget.save
      redirect_to budgets_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @budget.update(budget_params)
      redirect_to budgets_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @budget.destroy
    redirect_to budgets_path
  end

  private

  def set_budget
    @budget = Budget.find(params[:id])
  end

  def budget_params
    params.expect(budget: %i[name total])
  end
end
