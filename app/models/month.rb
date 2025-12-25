# frozen_string_literal: true

class Month < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy

  validates :month, presence: true
  validates :year, presence: true
end
