# frozen_string_literal: true

class Month < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy
  has_many :budgets, dependent: :destroy

  validates :month, presence: true
  validates :year, presence: true

  after_create :copy_budgets_from_previous_month

  private

  def copy_budgets_from_previous_month
    previous_month = find_previous_month
    return unless previous_month

    previous_month.budgets.each do |prev_budget|
      # Use find_or_create_by to avoid errors if budget already exists
      # (e.g., from concurrent operations or manual creation)
      budgets.find_or_create_by(name: prev_budget.name, user: user) do |budget|
        budget.total = prev_budget.total
      end
    end
  end

  def find_previous_month
    user.months
        .where('year < ? OR (year = ? AND month < ?)', year, year, month)
        .order(year: :desc, month: :desc)
        .first
  end
end
