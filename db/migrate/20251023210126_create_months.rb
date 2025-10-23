class CreateMonths < ActiveRecord::Migration[8.0]
  def change
    create_table :months do |t|
      t.integer :month
      t.integer :year

      t.timestamps
    end
  end
end
