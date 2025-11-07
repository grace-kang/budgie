# frozen_string_literal: true

class User < ApplicationRecord
  has_many :months, dependent: :destroy
  has_many :budgets, through: :months
  has_many :transactions, through: :budgets

  validates :email, presence: true, uniqueness: true
  validates :provider, :uid, presence: true
end
