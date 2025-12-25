# frozen_string_literal: true

class ChangeBudgetsToUserAndAddMonthToTransactions < ActiveRecord::Migration[8.0]
  def up
    # Add user_id to budgets (nullable first)
    add_reference :budgets, :user, null: true, foreign_key: false
    
    # Migrate data: assign budgets to the user of their month
    execute <<-SQL
      UPDATE budgets
      SET user_id = (
        SELECT user_id
        FROM months
        WHERE months.id = budgets.month_id
      )
    SQL
    
    # Make user_id not null and add foreign key
    change_column_null :budgets, :user_id, false
    add_foreign_key :budgets, :users
    
    # Add month_id to transactions (nullable first)
    add_reference :transactions, :month, null: true, foreign_key: false
    
    # Migrate data: assign transactions to the month of their budget
    execute <<-SQL
      UPDATE transactions
      SET month_id = (
        SELECT month_id
        FROM budgets
        WHERE budgets.id = transactions.budget_id
      )
    SQL
    
    # Make month_id not null and add foreign key
    change_column_null :transactions, :month_id, false
    add_foreign_key :transactions, :months
    
    # Remove month_id from budgets and its foreign key
    remove_foreign_key :budgets, :months
    remove_reference :budgets, :month
  end

  def down
    # Add month_id back to budgets
    add_reference :budgets, :month, null: false, foreign_key: true
    
    # Note: We can't restore the original month_id values in the down migration
    # as we don't have that information. This would need manual intervention.
    # For now, we'll set a default month_id (first month of first user)
    execute <<-SQL
      UPDATE budgets
      SET month_id = (
        SELECT MIN(id)
        FROM months
        WHERE months.user_id = budgets.user_id
      )
    SQL
    
    # Remove month_id from transactions
    remove_foreign_key :transactions, :months
    remove_reference :transactions, :month
    
    # Remove user_id from budgets
    remove_foreign_key :budgets, :users
    remove_reference :budgets, :user
  end
end

