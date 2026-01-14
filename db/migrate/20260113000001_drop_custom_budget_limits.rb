# frozen_string_literal: true

class DropCustomBudgetLimits < ActiveRecord::Migration[8.0]
  def change
    drop_table :custom_budget_limits do |t|
      t.bigint :budget_id, null: false
      t.bigint :month_id, null: false
      t.decimal :limit, precision: 8, scale: 2, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index [:budget_id, :month_id], unique: true
      t.index :budget_id
      t.index :month_id
    end
  end
end
