# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :budget
  belongs_to :month
  belongs_to :plaid_account, optional: true

  validates :description, presence: true
  validates :amount, presence: true
  validates :date, presence: true
  validates :plaid_transaction_id, uniqueness: true, allow_nil: true

  def month_name
    date.strftime('%B %Y')
  end
end
