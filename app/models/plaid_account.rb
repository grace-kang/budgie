# frozen_string_literal: true

class PlaidAccount < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :nullify

  validates :access_token, presence: true
  validates :item_id, presence: true, uniqueness: true

  def update_cursor(new_cursor)
    update(cursor: new_cursor, last_successful_update: Time.current)
  end
end

