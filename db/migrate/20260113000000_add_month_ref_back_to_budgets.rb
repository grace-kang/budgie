# frozen_string_literal: true

class AddMonthRefBackToBudgets < ActiveRecord::Migration[8.0]
  def change
    add_reference :budgets, :month, null: false, foreign_key: true

    # Update unique index to include month_id
    remove_index :budgets, name: "index_budgets_on_user_id_and_name"
    add_index :budgets, [:user_id, :month_id, :name], unique: true
  end
end
