# frozen_string_literal: true

class MonthsController < ApplicationController
  def index
    @months = Month.all
    @budget = Budget.new
  end
end
