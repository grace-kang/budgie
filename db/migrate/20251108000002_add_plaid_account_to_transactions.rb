class AddPlaidAccountToTransactions < ActiveRecord::Migration[8.0]
  def change
    add_reference :transactions, :plaid_account, null: true, foreign_key: true
  end
end

