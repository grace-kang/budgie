# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    @months = Month.all.reverse_order
    @month = Month.new
    @budget = Budget.new
  end

  def create
    @month = Month.new(month_params)
    prev_month = Month.order(year: :desc, month: :desc).first

    if @month.save
      @month.create_budgets_from_previous(prev_month) if prev_month.present?
      redirect_to months_path
    else
      redirect_to months_path, status: :unprocessable_entity
    end
  end

  private

  def month_params
    params.expect(month: %i[month year])
  end
end
