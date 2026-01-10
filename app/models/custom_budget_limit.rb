# frozen_string_literal: true

class CustomBudgetLimit < ApplicationRecord
  belongs_to :budget
  belongs_to :month

  validates :limit, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :budget_id, uniqueness: { scope: :month_id }
end
