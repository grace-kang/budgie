class AddPlaidTransactionIdToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_column :transactions, :plaid_transaction_id, :string
    add_index :transactions, :plaid_transaction_id, unique: true
  end
end

