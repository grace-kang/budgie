class AddTotalToBudget < ActiveRecord::Migration[8.0]
  def change
    add_column :budgets, :total, :integer
  end
end
