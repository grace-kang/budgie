# frozen_string_literal: true

require 'test_helper'

# Define test doubles for Plaid objects
PersonalFinanceCategory = Struct.new(:primary, :detailed, keyword_init: true)
PlaidTransaction = Struct.new(
  :transaction_id, :pending, :date, :name, :merchant_name,
  :amount, :category, :personal_finance_category,
  keyword_init: true
)
RemovedTransaction = Struct.new(:transaction_id, keyword_init: true)

# rubocop:disable Metrics/ClassLength
class PlaidSyncTransactionsJobTest < ActiveJob::TestCase
  setup do
    @user = User.create!(
      email: 'test@example.com',
      provider: 'google_oauth2',
      uid: '123456'
    )
    @plaid_account = PlaidAccount.create!(
      user: @user,
      access_token: 'access-token-123',
      item_id: 'item-123',
      institution_name: 'Test Bank'
    )
  end

  # rubocop:disable Metrics/BlockLength
  test 'performs sync for valid plaid account' do
    # Mock Plaid transaction response
    mock_transaction = PlaidTransaction.new(
      transaction_id: 'txn-123',
      pending: false,
      date: Time.zone.today.to_s,
      name: 'Test Transaction',
      merchant_name: nil,
      amount: -50.0,
      category: nil,
      personal_finance_category: PersonalFinanceCategory.new(
        primary: 'GENERAL_MERCHANDISE',
        detailed: 'GENERAL_MERCHANDISE_ONLINE_MARKETPLACES'
      )
    )

    mock_result = {
      transactions: [mock_transaction],
      removed: [],
      has_more: false,
      next_cursor: 'cursor-123'
    }

    stub_plaid_service do |mock|
      mock.define_singleton_method(:get_transactions) do |_access_token, cursor: nil, _start_date: nil, _end_date: nil| # rubocop:disable Lint/UnusedBlockArgument
        mock_result
      end

      assert_difference('Transaction.count', 1) do
        PlaidSyncTransactionsJob.perform_now(@plaid_account.id)
      end
    end

    @plaid_account.reload
    assert_equal 'cursor-123', @plaid_account.cursor
    assert_not_nil @plaid_account.last_successful_update
  end
  # rubocop:enable Metrics/BlockLength

  test 'skips pending transactions' do
    mock_transaction = PlaidTransaction.new(
      transaction_id: 'txn-123',
      pending: true,
      date: Time.zone.today.to_s,
      name: 'Pending Transaction',
      amount: -50.0,
      merchant_name: nil,
      category: nil,
      personal_finance_category: nil
    )

    mock_result = {
      transactions: [mock_transaction],
      removed: [],
      has_more: false,
      next_cursor: 'cursor-123'
    }

    stub_plaid_service do |mock|
      mock.define_singleton_method(:get_transactions) do |_access_token, cursor: nil, _start_date: nil, _end_date: nil| # rubocop:disable Lint/UnusedBlockArgument
        mock_result
      end

      assert_no_difference('Transaction.count') do
        PlaidSyncTransactionsJob.perform_now(@plaid_account.id)
      end
    end
  end

  test 'handles removed transactions' do
    month = @user.months.create!(month: Time.zone.today.month, year: Time.zone.today.year)
    budget = month.budgets.create!(name: 'Other', total: 0)
    budget.transactions.create!(
      description: 'Old Transaction',
      amount: 100,
      date: Time.zone.today,
      plaid_transaction_id: 'txn-removed-123',
      plaid_account: @plaid_account
    )

    mock_removed = RemovedTransaction.new(transaction_id: 'txn-removed-123')
    mock_result = {
      transactions: [],
      removed: [mock_removed],
      has_more: false,
      next_cursor: 'cursor-123'
    }

    stub_plaid_service do |mock|
      mock.define_singleton_method(:get_transactions) do |_access_token, cursor: nil, _start_date: nil, _end_date: nil| # rubocop:disable Lint/UnusedBlockArgument
        mock_result
      end

      assert_difference('Transaction.count', -1) do
        PlaidSyncTransactionsJob.perform_now(@plaid_account.id)
      end
    end
  end

  test 'does nothing for non-existent account' do
    assert_no_difference('Transaction.count') do
      PlaidSyncTransactionsJob.perform_now(999)
    end
  end

  # rubocop:disable Metrics/BlockLength
  test 'categorizes transactions correctly' do
    @user.months.create!(month: Time.zone.today.month, year: Time.zone.today.year)

    food_transaction = PlaidTransaction.new(
      transaction_id: 'txn-food',
      pending: false,
      date: Time.zone.today.to_s,
      name: 'Restaurant',
      amount: -30.0,
      category: nil,
      merchant_name: nil,
      personal_finance_category: PersonalFinanceCategory.new(
        primary: 'FOOD_AND_DRINK',
        detailed: 'FOOD_AND_DRINK_RESTAURANTS'
      )
    )

    mock_result = {
      transactions: [food_transaction],
      removed: [],
      has_more: false,
      next_cursor: 'cursor-123'
    }

    stub_plaid_service do |mock|
      mock.define_singleton_method(:get_transactions) do |_access_token, cursor: nil, _start_date: nil, _end_date: nil| # rubocop:disable Lint/UnusedBlockArgument
        mock_result
      end

      PlaidSyncTransactionsJob.perform_now(@plaid_account.id)
    end

    transaction = Transaction.find_by(plaid_transaction_id: 'txn-food')
    assert_not_nil transaction
    assert_equal 'Food & Dining', transaction.budget.name
  end
  # rubocop:enable Metrics/BlockLength
end
# rubocop:enable Metrics/ClassLength
