# frozen_string_literal: true

require 'test_helper'

class PlaidAccountTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: 'test@example.com',
      provider: 'google_oauth2',
      uid: '123456'
    )
  end

  test 'creates plaid account with valid attributes' do
    account = PlaidAccount.new(
      user: @user,
      access_token: 'access-token-123',
      item_id: 'item-123'
    )

    assert account.valid?
    assert account.save
  end

  test 'requires access_token' do
    account = PlaidAccount.new(
      user: @user,
      item_id: 'item-123'
    )

    assert_not account.valid?
    assert_includes account.errors[:access_token], "can't be blank"
  end

  test 'requires item_id' do
    account = PlaidAccount.new(
      user: @user,
      access_token: 'access-token-123'
    )

    assert_not account.valid?
    assert_includes account.errors[:item_id], "can't be blank"
  end

  test 'item_id must be unique' do
    PlaidAccount.create!(
      user: @user,
      access_token: 'token-1',
      item_id: 'item-123'
    )

    account = PlaidAccount.new(
      user: @user,
      access_token: 'token-2',
      item_id: 'item-123'
    )

    assert_not account.valid?
    assert_includes account.errors[:item_id], 'has already been taken'
  end

  test 'belongs to user' do
    account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123'
    )

    assert_equal @user, account.user
  end

  test 'update_cursor updates cursor and timestamp' do
    account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123'
    )

    account.update_cursor('new-cursor-123')

    account.reload
    assert_equal 'new-cursor-123', account.cursor
    assert_not_nil account.last_successful_update
  end

  test 'nullifies plaid_account_id on transactions when deleted' do
    account = PlaidAccount.create!(
      user: @user,
      access_token: 'token-123',
      item_id: 'item-123'
    )

    month = @user.months.create!(month: 1, year: 2024)
    budget = month.budgets.create!(name: 'Test', total: 1000)
    transaction = budget.transactions.create!(
      description: 'Test',
      amount: 100,
      date: Date.new(2024, 1, 15),
      plaid_account: account,
      plaid_transaction_id: 'plaid-123'
    )

    account.destroy

    assert_nil transaction.reload.plaid_account_id
  end
end
