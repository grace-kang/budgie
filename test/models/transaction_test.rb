# frozen_string_literal: true

require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  test 'should not save without description' do
    budget, month = test_budget_and_month
    transaction = budget.transactions.new(amount: 100, date: Date.new(2024, 1, 1), month: month)
    assert_not transaction.save, 'Saved the transaction without a description'
  end

  test 'should not save without amount' do
    budget, month = test_budget_and_month
    transaction = budget.transactions.new(description: 'Groceries', date: Date.new(2024, 1, 1), month: month)
    assert_not transaction.save, 'Saved the transaction without an amount'
  end

  test 'should not save without date' do
    budget, month = test_budget_and_month
    transaction = budget.transactions.new(description: 'Groceries', amount: 100, month: month)
    assert_not transaction.save, 'Saved the transaction without a date'
  end

  test 'belongs to budget' do
    budget, month = test_budget_and_month
    transaction = budget.transactions.create(description: 'Groceries', amount: 100, date: Time.zone.today, month: month)

    assert_equal budget, transaction.budget
  end

  test 'belongs to month' do
    budget, month = test_budget_and_month
    transaction = budget.transactions.create(description: 'Groceries', amount: 100, date: Date.new(2024, 1, 15),
                                             month: month)

    assert_equal month, transaction.month
  end

  private

  def test_budget
    budget, _month = test_budget_and_month
    budget
  end

  def test_budget_and_month
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000, user: user)
    [budget, month]
  end
end
