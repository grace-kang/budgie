# frozen_string_literal: true

class Month < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy
  has_many :custom_budget_limits, dependent: :destroy
  has_many :budgets, through: :custom_budget_limits

  validates :month, presence: true
  validates :year, presence: true
end
