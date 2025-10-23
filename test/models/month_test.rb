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
end
