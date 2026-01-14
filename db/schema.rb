# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_13_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "budgets", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "total", precision: 8, scale: 2
    t.bigint "user_id", null: false
    t.bigint "month_id", null: false
    t.index ["month_id"], name: "index_budgets_on_month_id"
    t.index ["user_id", "month_id", "name"], name: "index_budgets_on_user_id_and_month_id_and_name", unique: true
    t.index ["user_id"], name: "index_budgets_on_user_id"
  end

  create_table "months", force: :cascade do |t|
    t.integer "month"
    t.integer "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_months_on_user_id"
  end

  create_table "plaid_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "access_token", null: false
    t.string "item_id", null: false
    t.string "institution_id"
    t.string "institution_name"
    t.string "cursor"
    t.datetime "last_successful_update"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_plaid_accounts_on_item_id", unique: true
    t.index ["user_id"], name: "index_plaid_accounts_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.string "description"
    t.decimal "amount", precision: 8, scale: 2
    t.date "date"
    t.integer "budget_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "plaid_transaction_id"
    t.bigint "plaid_account_id"
    t.bigint "month_id", null: false
    t.index ["budget_id"], name: "index_transactions_on_budget_id"
    t.index ["month_id"], name: "index_transactions_on_month_id"
    t.index ["plaid_account_id"], name: "index_transactions_on_plaid_account_id"
    t.index ["plaid_transaction_id"], name: "index_transactions_on_plaid_transaction_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "provider"
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "preferences", default: {}, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "budgets", "months"
  add_foreign_key "budgets", "users"
  add_foreign_key "months", "users"
  add_foreign_key "plaid_accounts", "users"
  add_foreign_key "transactions", "budgets"
  add_foreign_key "transactions", "months"
  add_foreign_key "transactions", "plaid_accounts"
end
