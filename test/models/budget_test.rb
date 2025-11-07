# frozen_string_literal: true

require 'test_helper'

class BudgetTest < ActiveSupport::TestCase
  test 'should not save without name' do
    budget = Budget.new(total: 1000)
    assert_not budget.save, 'Saved the budget without a name'
  end

  test 'should not save without total' do
    budget = Budget.new(name: 'Monthly Budget')
    assert_not budget.save, 'Saved the budget without a total'
  end

  test 'has many transactions' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)
    transaction1 = budget.transactions.create(amount: 100, description: 'Groceries', date: Date.new(2024, 1, 5))
    transaction2 = budget.transactions.create(amount: 200, description: 'Rent', date: Date.new(2024, 1, 1))

    assert_equal 2, budget.transactions.count
    assert_includes budget.transactions, transaction1
    assert_includes budget.transactions, transaction2
  end

  test 'belongs to month' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)

    assert_equal month, budget.month
  end
end
