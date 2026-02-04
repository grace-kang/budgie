# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    months = current_user.months.includes(:transactions).order(year: :desc, month: :desc)

    render json: months.as_json(include: :transactions), status: :ok
  end

  def create
    month = current_user.months.find_or_create_by!(month_params)
    render json: month.as_json(include: :transactions), status: month.previously_new_record? ? :created : :ok
  end

  private

  def month_params
    params.expect(month: %i[month year])
  end
end
