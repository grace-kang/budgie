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
    budget = user.budgets.create(name: 'June Budget', total: 1000)
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

  private

  def test_user
    User.create(email: 'test@example.com', provider: 'google', uid: '12345')
  end
end
