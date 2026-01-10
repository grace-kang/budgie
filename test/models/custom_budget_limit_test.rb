# frozen_string_literal: true

require 'test_helper'

class CustomBudgetLimitTest < ActiveSupport::TestCase
  def setup
    @user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    @budget = @user.budgets.create(name: 'Test Budget', total: 1000)
    @month = @user.months.create(month: 1, year: 2024)
  end

  test 'should not save without limit' do
    custom_limit = CustomBudgetLimit.new(budget: @budget, month: @month)
    assert_not custom_limit.save, 'Saved the custom budget limit without a limit'
  end

  test 'should not save with negative limit' do
    custom_limit = CustomBudgetLimit.new(budget: @budget, month: @month, limit: -100)
    assert_not custom_limit.save, 'Saved the custom budget limit with negative limit'
  end

  test 'should save with valid limit' do
    custom_limit = CustomBudgetLimit.new(budget: @budget, month: @month, limit: 500)
    assert custom_limit.save, 'Could not save the custom budget limit with valid limit'
  end

  test 'should not allow duplicate budget and month combination' do
    CustomBudgetLimit.create(budget: @budget, month: @month, limit: 500)
    duplicate = CustomBudgetLimit.new(budget: @budget, month: @month, limit: 600)
    assert_not duplicate.save, 'Saved duplicate custom budget limit for same budget and month'
  end

  test 'belongs to budget' do
    custom_limit = CustomBudgetLimit.create(budget: @budget, month: @month, limit: 500)
    assert_equal @budget, custom_limit.budget
  end

  test 'belongs to month' do
    custom_limit = CustomBudgetLimit.create(budget: @budget, month: @month, limit: 500)
    assert_equal @month, custom_limit.month
  end

  test 'allows different limits for same budget in different months' do
    month2 = @user.months.create(month: 2, year: 2024)
    limit1 = CustomBudgetLimit.create(budget: @budget, month: @month, limit: 500)
    limit2 = CustomBudgetLimit.create(budget: @budget, month: month2, limit: 600)

    assert limit1.persisted?
    assert limit2.persisted?
    assert_equal 500, limit1.limit
    assert_equal 600, limit2.limit
  end

  test 'allows different budgets to have limits for same month' do
    budget2 = @user.budgets.create(name: 'Another Budget', total: 2000)
    limit1 = CustomBudgetLimit.create(budget: @budget, month: @month, limit: 500)
    limit2 = CustomBudgetLimit.create(budget: budget2, month: @month, limit: 700)

    assert limit1.persisted?
    assert limit2.persisted?
    assert_equal 500, limit1.limit
    assert_equal 700, limit2.limit
  end
end
