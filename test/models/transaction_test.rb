# frozen_string_literal: true

require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  test 'should not save without description' do
    transaction = test_budget.transactions.new(amount: 100, date: Date.new(2024, 1, 1))
    assert_not transaction.save, 'Saved the transaction without a description'
  end

  test 'should not save without amount' do
    transaction = test_budget.transactions.new(description: 'Groceries', date: Date.new(2024, 1, 1))
    assert_not transaction.save, 'Saved the transaction without an amount'
  end

  test 'should not save without date' do
    transaction = test_budget.transactions.new(description: 'Groceries', amount: 100)
    assert_not transaction.save, 'Saved the transaction without a date'
  end

  test 'belongs to budget' do
    budget = test_budget
    transaction = budget.transactions.create(description: 'Groceries', amount: 100, date: Time.zone.today)

    assert_equal budget, transaction.budget
  end

  test 'date must be within budget month' do
    budget = test_budget
    valid_transaction = budget.transactions.new(description: 'Groceries', amount: 100, date: Date.new(2024, 1, 15))
    assert valid_transaction.valid?, 'Transaction with date within budget month is not valid'

    invalid_transaction = budget.transactions.new(description: 'Rent', amount: 500, date: Date.new(2024, 2, 1))
    assert_not invalid_transaction.valid?, 'Transaction with date outside budget month is valid'
  end

  private

  def test_budget
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    month.budgets.create(name: 'Monthly Budget', total: 1000)
  end
end
