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
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000, user: user)
    transaction1 = budget.transactions.create(amount: 100, description: 'Groceries', date: Date.new(2024, 1, 5),
                                              month: month)
    transaction2 = budget.transactions.create(amount: 200, description: 'Rent', date: Date.new(2024, 1, 1),
                                              month: month)

    assert_equal 2, budget.transactions.count
    assert_includes budget.transactions, transaction1
    assert_includes budget.transactions, transaction2
  end

  test 'belongs to user' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000, user: user)

    assert_equal user, budget.user
  end

  test 'belongs to month' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000, user: user)

    assert_equal month, budget.month
  end

  test 'should enforce uniqueness of name within user and month scope' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    month.budgets.create(name: 'Monthly Budget', total: 1000, user: user)
    duplicate = month.budgets.new(name: 'Monthly Budget', total: 2000, user: user)

    assert_not duplicate.save, 'Saved duplicate budget with same name in same month'
  end

  test 'allows same budget name in different months' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month1 = user.months.create(month: 1, year: 2024)
    month2 = user.months.create(month: 2, year: 2024)
    budget1 = month1.budgets.create(name: 'Monthly Budget', total: 1000, user: user)
    budget2 = month2.budgets.create(name: 'Monthly Budget', total: 1500, user: user)

    assert budget1.persisted?
    assert budget2.persisted?
  end
end
