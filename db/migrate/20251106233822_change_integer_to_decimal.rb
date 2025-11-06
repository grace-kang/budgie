class ChangeIntegerToDecimal < ActiveRecord::Migration[8.0]
  def change
    change_column :budgets, :total, :decimal, precision: 8, scale: 2
    change_column :transactions, :amount, :decimal, precision: 8, scale: 2
  end
end
