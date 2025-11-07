# frozen_string_literal: true

require 'test_helper'

class MonthsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get months_url, headers: auth_headers
    assert_response :success
  end

  test 'should create month and copy budgets from previous month' do
    user = test_user
    @previous_month = user.months.create(month: 12, year: 2023)
    @month = user.months.create(month: 1, year: 2024)
    assert_difference('Month.count') do
      post months_url, headers: auth_headers, params: { month: { month: 2, year: 2024 } }
    end

    new_month = user.months.last
    assert_equal 2, new_month.month
    assert_equal 2024, new_month.year

    # Copy budgets from previous month
    @month.create_budgets_from_previous(@previous_month)

    assert_equal @previous_month.budgets.count, new_month.budgets.count
    @previous_month.budgets.each_with_index do |prev_budget, index|
      new_budget = new_month.budgets[index]
      assert_equal prev_budget.name, new_budget.name
      assert_equal prev_budget.total, new_budget.total
    end

    assert_response :created
  end

  test 'fails to create month with invalid data' do
    assert_no_difference('Month.count') do
      post months_url, headers: auth_headers, params: { month: { month: nil, year: 2024 } }
    end
    assert_response :unprocessable_entity
  end

  test 'should destroy month' do
    month = test_user.months.create(month: 3, year: 2024)
    assert_difference('Month.count', -1) do
      delete month_url(month), headers: auth_headers
    end
    assert_response :ok
  end

  test 'fails to destroy non-existent month' do
    assert_no_difference('Month.count') do
      delete month_url(id: 'non-existent-id'), headers: auth_headers
    end
    assert_response :not_found
  end

  private

  def test_user
    User.create(email: 'test@example.com', provider: 'google', uid: '12345')
  end
end
