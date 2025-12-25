# frozen_string_literal: true

class AddUniqueIndexToBudgetsName < ActiveRecord::Migration[8.0]
  def change
    add_index :budgets, [:user_id, :name], unique: true
  end
end

