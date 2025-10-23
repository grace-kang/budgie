class Month < ApplicationRecord
  has_many :budgets, dependent: :destroy

  validates :month, presence: true
  validates :year, presence: true
end
