# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should create budget with month_id' do
    month = test_month
    assert_difference('Budget.count') do
      post budgets_url, headers: auth_headers,
                        params: { budget: { name: 'New Budget', total: 500 }, month_id: month.id }
    end

    assert_response :created
    budget = Budget.last
    assert_equal month.id, budget.month_id
  end

  test 'fails to create budget without month_id' do
    assert_no_difference('Budget.count') do
      post budgets_url, headers: auth_headers, params: { budget: { name: 'New Budget', total: 500 } }
    end
    assert_response :not_found
  end

  test 'fails to create budget with invalid data' do
    month = test_month
    assert_no_difference('Budget.count') do
      post budgets_url, headers: auth_headers, params: { budget: { name: '', total: 500 }, month_id: month.id }
    end
    assert_response :unprocessable_entity
  end

  test 'should show budget' do
    get budget_url(test_budget), headers: auth_headers
    assert_response :success
  end

  test 'should update budget' do
    patch budget_url(test_budget), headers: auth_headers, params: { budget: { name: 'Updated Budget', total: 1500 } }
    assert_response :ok
  end

  test 'fails to update budget with invalid data' do
    patch budget_url(test_budget), headers: auth_headers, params: { budget: { name: '', total: 1500 } }
    assert_response :unprocessable_entity
  end

  test 'should destroy budget' do
    budget = test_budget
    assert_difference('Budget.count', -1) { delete budget_url(budget), headers: auth_headers }
    assert_response :ok
  end

  test 'fails to destroy non-existent budget' do
    assert_no_difference('Budget.count') do
      delete budget_url(id: -1), headers: auth_headers
    end
    assert_response :not_found
  end

  private

  def test_month
    auth_user.months.find_or_create_by(month: 1, year: 2024)
  end

  def test_budget
    user = auth_user
    month = user.months.find_or_create_by(month: 1, year: 2024)
    month.budgets.find_or_create_by(name: 'Test Budget', user: user) { |b| b.total = 1000 }
  end
end
