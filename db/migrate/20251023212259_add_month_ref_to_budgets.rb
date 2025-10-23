class AddMonthRefToBudgets < ActiveRecord::Migration[8.0]
  def change
    add_reference :budgets, :month, null: false, foreign_key: true
  end
end
