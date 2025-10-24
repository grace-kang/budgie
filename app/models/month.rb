# frozen_string_literal: true

class Month < ApplicationRecord
  has_many :budgets, dependent: :destroy

  validates :month, presence: true
  validates :year, presence: true

  def create_budgets_from_previous(previous_month)
    previous_month.budgets.each do |prev_budget|
      budgets.create(name: prev_budget.name, total: prev_budget.total)
    end
  end
end
