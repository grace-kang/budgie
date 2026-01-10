# frozen_string_literal: true

class CreateCustomBudgetLimits < ActiveRecord::Migration[8.0]
  def change
    create_table :custom_budget_limits do |t|
      t.references :budget, null: false, foreign_key: true
      t.references :month, null: false, foreign_key: true
      t.decimal :limit, precision: 8, scale: 2, null: false

      t.timestamps
    end

    add_index :custom_budget_limits, [:budget_id, :month_id], unique: true
  end
end

