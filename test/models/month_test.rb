# frozen_string_literal: true

require 'test_helper'

class MonthTest < ActiveSupport::TestCase
  test 'should not save month without month and year' do
    month = Month.new
    assert_not month.save, 'Saved the month without month and year'
  end

  test 'should save month with month and year' do
    month = test_user.months.new(month: 5, year: 2024)
    assert month.save, 'Could not save the month with month and year'
  end

  test 'should have many transactions' do
    user = test_user
    month = user.months.create(month: 6, year: 2024)
    budget = month.budgets.create(name: 'June Budget', total: 1000, user: user)
    transaction1 = budget.transactions.create(
      description: 'Groceries',
      amount: 100,
      date: Date.new(2024, 6, 5),
      month: month
    )
    transaction2 = budget.transactions.create(
      description: 'Rent',
      amount: 200,
      date: Date.new(2024, 6, 1),
      month: month
    )

    assert_equal 2, month.transactions.count, 'Month does not have the correct number of transactions'
    assert_includes month.transactions, transaction1
    assert_includes month.transactions, transaction2
  end

  test 'should have many budgets' do
    user = test_user
    month = user.months.create(month: 6, year: 2024)
    budget1 = month.budgets.create(name: 'June Budget', total: 1000, user: user)
    budget2 = month.budgets.create(name: 'Another Budget', total: 2000, user: user)

    assert_equal 2, month.budgets.count
    assert_includes month.budgets, budget1
    assert_includes month.budgets, budget2
  end

  test 'copies budgets from previous month after creation' do
    user = test_user
    month1 = user.months.create(month: 1, year: 2024)
    month1.budgets.create(name: 'Groceries', total: 500, user: user)
    month1.budgets.create(name: 'Rent', total: 1000, user: user)

    month2 = user.months.create(month: 2, year: 2024)

    assert_equal 2, month2.budgets.count, 'Month 2 should have 2 budgets copied from month 1'
    assert_equal %w[Groceries Rent], month2.budgets.pluck(:name).sort
    assert_equal [500, 1000], month2.budgets.order(:name).pluck(:total).map(&:to_i)
  end

  test 'does not copy budgets if no previous month exists' do
    user = test_user
    month = user.months.create(month: 1, year: 2024)

    assert_equal 0, month.budgets.count, 'First month should have no budgets'
  end

  test 'copies budgets from previous month across year boundary' do
    user = test_user
    december_month = user.months.create(month: 12, year: 2024)
    december_month.budgets.create(name: 'Holiday Shopping', total: 800, user: user)
    december_month.budgets.create(name: 'Gifts', total: 600, user: user)

    january_month = user.months.create(month: 1, year: 2025)

    assert_equal 2, january_month.budgets.count, 'January 2025 should have 2 budgets copied from December 2024'
    assert_equal ['Gifts', 'Holiday Shopping'], january_month.budgets.pluck(:name).sort
    assert_equal [600, 800], january_month.budgets.order(:name).pluck(:total).map(&:to_i)
  end

  test 'does not raise error when budget with same name already exists' do
    user = test_user
    month1 = user.months.create(month: 1, year: 2024)
    month1.budgets.create(name: 'Groceries', total: 500, user: user)

    # Create month2 - the callback will run and create the budget
    month2 = user.months.create(month: 2, year: 2024)
    initial_budget = month2.budgets.find_by(name: 'Groceries')
    assert_not_nil initial_budget, 'Budget should have been created by callback'

    # Call the callback method again to simulate it running multiple times
    # (e.g., from a retry or concurrent operation)
    # Should not raise an error and should not create a duplicate
    assert_nothing_raised do
      month2.send(:copy_budgets_from_previous_month)
    end

    # Should still have only one budget (not a duplicate)
    assert_equal 1, month2.budgets.count, 'Should have only one budget, not a duplicate'
    assert_equal initial_budget.id, month2.budgets.first.id, 'Should be the same budget'
  end

  private

  def test_user
    User.create(email: 'test@example.com', provider: 'google', uid: '12345')
  end
end
