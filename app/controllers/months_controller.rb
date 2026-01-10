# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    months = current_user.months.includes(:transactions).all.reverse_order

    render json: months.as_json(include: :transactions), status: :ok
  end
end
