# frozen_string_literal: true

class Budget < ApplicationRecord
  has_many :transactions, dependent: :destroy

  validates :name, presence: true
  validates :total, presence: true
end
