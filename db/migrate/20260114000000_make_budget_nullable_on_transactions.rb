class MakeBudgetNullableOnTransactions < ActiveRecord::Migration[8.0]
  def change
    # Remove the foreign key constraint first
    remove_foreign_key :transactions, :budgets
    
    # Change the column to allow null
    change_column_null :transactions, :budget_id, true
    
    # Re-add the foreign key constraint (it will allow null by default)
    add_foreign_key :transactions, :budgets
  end
end
