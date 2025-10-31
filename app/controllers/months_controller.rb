# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    months = Month.includes(budgets: :transactions).all.reverse_order

    render json: months.as_json(
      include: {
        budgets: {
          include: :transactions
        }
      }
    )
  end

  def create
    @month = Month.new(month_params)
    prev_month = Month.order(year: :desc, month: :desc).first

    if @month.save
      @month.create_budgets_from_previous(prev_month) if prev_month.present?
      render json: @month, status: :created
    else
      render json: @month.errors, status: :unprocessable_entity
    end
  end

  private

  def month_params
    params.expect(month: %i[month year])
  end
end
