# frozen_string_literal: true

class Budget < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy
  has_many :custom_budget_limits, dependent: :destroy
  has_many :months, through: :custom_budget_limits

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :total, presence: true

  def limit_for_month(month)
    custom_limit = custom_budget_limits.find_by(month: month)
    custom_limit&.limit || total
  end
end
