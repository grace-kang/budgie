# frozen_string_literal: true

class Budget < ApplicationRecord
  belongs_to :user
  belongs_to :month
  has_many :transactions, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: %i[user_id month_id] }
  validates :total, presence: true
end
