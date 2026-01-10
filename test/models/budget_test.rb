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
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
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
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)

    assert_equal user, budget.user
  end

  test 'has many custom_budget_limits' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
    month1 = user.months.create(month: 1, year: 2024)
    month2 = user.months.create(month: 2, year: 2024)
    limit1 = budget.custom_budget_limits.create(month: month1, limit: 500)
    limit2 = budget.custom_budget_limits.create(month: month2, limit: 600)

    assert_equal 2, budget.custom_budget_limits.count
    assert_includes budget.custom_budget_limits, limit1
    assert_includes budget.custom_budget_limits, limit2
  end

  test 'has many months through custom_budget_limits' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
    month1 = user.months.create(month: 1, year: 2024)
    month2 = user.months.create(month: 2, year: 2024)
    budget.custom_budget_limits.create(month: month1, limit: 500)
    budget.custom_budget_limits.create(month: month2, limit: 600)

    assert_equal 2, budget.months.count
    assert_includes budget.months, month1
    assert_includes budget.months, month2
  end

  test 'limit_for_month returns custom limit when set' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
    month = user.months.create(month: 1, year: 2024)
    budget.custom_budget_limits.create(month: month, limit: 500)

    assert_equal 500, budget.limit_for_month(month)
  end

  test 'limit_for_month returns budget total when no custom limit is set' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
    month = user.months.create(month: 1, year: 2024)

    assert_equal 1000, budget.limit_for_month(month)
  end

  test 'limit_for_month returns different limits for different months' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    budget = user.budgets.create(name: 'Monthly Budget', total: 1000)
    month1 = user.months.create(month: 1, year: 2024)
    month2 = user.months.create(month: 2, year: 2024)
    budget.custom_budget_limits.create(month: month1, limit: 500)
    budget.custom_budget_limits.create(month: month2, limit: 600)

    assert_equal 500, budget.limit_for_month(month1)
    assert_equal 600, budget.limit_for_month(month2)
  end
end
