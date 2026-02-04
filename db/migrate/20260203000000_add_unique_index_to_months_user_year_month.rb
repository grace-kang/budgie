# frozen_string_literal: true

class AddUniqueIndexToMonthsUserYearMonth < ActiveRecord::Migration[8.0]
  def change
    add_index :months, %i[user_id year month], unique: true
  end
end
