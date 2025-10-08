# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :budget

  validates :description, presence: true
  validates :amount, presence: true
  validates :date, presence: true
end
