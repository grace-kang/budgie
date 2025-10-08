class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.string :description
      t.integer :amount
      t.date :date
      t.references :budget, null: false, foreign_key: true

      t.timestamps
    end
  end
end
