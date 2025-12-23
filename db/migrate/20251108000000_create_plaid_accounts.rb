class CreatePlaidAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :plaid_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :access_token, null: false
      t.string :item_id, null: false
      t.string :institution_id
      t.string :institution_name
      t.string :cursor
      t.datetime :last_successful_update

      t.timestamps
    end

    add_index :plaid_accounts, :item_id, unique: true
  end
end

