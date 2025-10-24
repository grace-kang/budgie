# frozen_string_literal: true

require 'test_helper'

class MonthTest < ActiveSupport::TestCase
  test 'should not save month without month and year' do
    month = Month.new
    assert_not month.save, 'Saved the month without month and year'
  end

  test 'should save month with month and year' do
    month = Month.new(month: 5, year: 2024)
    assert month.save, 'Could not save the month with month and year'
  end

  test 'should have many budgets' do
    month = Month.create(month: 6, year: 2024)
    Budget.create(name: 'June Budget 1', total: 1000, month: month)
    Budget.create(name: 'June Budget 2', total: 1500, month: month)

    assert_equal 2, month.budgets.count, 'Month does not have the correct number of budgets'
  end

  test 'should create budgets from previous month' do
    previous_month = Month.create(month: 5, year: 2024)
    Budget.create(name: 'May Budget 1', total: 1000, month: previous_month)
    Budget.create(name: 'May Budget 2', total: 1500, month: previous_month)

    new_month = Month.create(month: 6, year: 2024)
    new_month.create_budgets_from_previous(previous_month)

    assert_equal 2, new_month.budgets.count, 'New month did not create budgets from previous month'
    assert_equal 'May Budget 1', new_month.budgets.first.name, 'Budget name does not match'
    assert_equal 1000, new_month.budgets.first.total, 'Budget total does not match'
  end
end
