class Transaction < ApplicationRecord
  belongs_to :budget

  validates :name, presence: true
  validates :amount, presence: true
  validates :date, presence: true
end
