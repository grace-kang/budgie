# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :budget
  belongs_to :month
  belongs_to :plaid_account, optional: true

  validates :description, presence: true
  validates :amount, presence: true
  validates :date, presence: true
  validates :plaid_transaction_id, uniqueness: true, allow_nil: true
  validate :date_matches_budget_month

  def month_name
    date.strftime('%B %Y')
  end

  private

  # rubocop:disable Metrics/AbcSize
  def date_matches_budget_month
    return if date.blank? || budget.blank? || budget.month.blank?

    budget_month = budget.month
    transaction_month = date.month
    transaction_year = date.year

    return if transaction_month == budget_month.month && transaction_year == budget_month.year

    errors.add(:date, "must be in #{Date.new(budget_month.year, budget_month.month).strftime('%B %Y')}")
  end
  # rubocop:enable Metrics/AbcSize
end
