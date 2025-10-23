# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :budget

  validates :description, presence: true
  validates :amount, presence: true

  validate :date_within_budget_month

  def month
    date.strftime('%B %Y')
  end

  private

  def date_within_budget_month
    if date.nil?
      errors.add(:date, "can't be blank")
    else
      start_date = Date.new(budget.month.year, budget.month.month, 1)
      return if date.between?(start_date, start_date.end_of_month)

      errors.add(:date, "must be within the budget's month")
    end
  end
end
