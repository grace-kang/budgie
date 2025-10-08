# frozen_string_literal: true

class Budget < ApplicationRecord
  validates :name, presence: true
  validates :total, presence: true
end
