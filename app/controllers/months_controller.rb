# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    months = current_user.months.includes(:transactions).all.reverse_order

    render json: months.as_json(include: :transactions), status: :ok
  end

  def create
    @month = current_user.months.new(month_params)

    if @month.save
      render json: @month, status: :created
    else
      render json: @month.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @month = current_user.months.find(params[:id])
    if @month.destroy
      render json: { message: 'Month deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete month' }, status: :unprocessable_entity
    end
  end

  private

  def month_params
    params.expect(month: %i[month year])
  end
end
