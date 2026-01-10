# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should create budget' do
    assert_difference('Budget.count') do
      post budgets_url, headers: auth_headers, params: { budget: { name: 'New Budget', total: 500 } }
    end

    assert_response :created
  end

  test 'fails to create budget with invalid data' do
    assert_no_difference('Budget.count') do
      post budgets_url, headers: auth_headers, params: { budget: { name: '', total: 500 } }
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
    assert_difference('Budget.count', -1) { delete budget_url(test_budget), headers: auth_headers }
    assert_response :ok
  end

  test 'fails to destroy non-existent budget' do
    assert_no_difference('Budget.count') do
      delete budget_url(id: -1), headers: auth_headers
    end
    assert_response :not_found
  end

  test 'should include custom_budget_limits in index response' do
    budget_with_custom_limit
    get budgets_url, headers: auth_headers
    assert_response :success
    assert_custom_limit_in_json(response.parsed_body.first, '500.0')
  end

  test 'should include custom_budget_limits in show response' do
    budget = budget_with_custom_limit
    get budget_url(budget), headers: auth_headers
    assert_response :success
    assert_custom_limit_in_json(response.parsed_body, '500.0')
  end

  test 'should create custom budget limit' do
    budget = test_budget
    month = test_month
    assert_difference('CustomBudgetLimit.count') { update_custom_limit(budget, month.id, 500) }
    assert_response :ok
    assert_equal 500, budget.custom_budget_limits.find_by(month: month).limit
  end

  test 'should update existing custom budget limit' do
    budget = budget_with_custom_limit
    month = test_month
    assert_no_difference('CustomBudgetLimit.count') { update_custom_limit(budget, month.id, 600) }
    assert_response :ok
    assert_equal 600, budget.custom_budget_limits.find_by(month: month).limit
  end

  test 'fails to update custom limit with invalid limit' do
    assert_no_difference('CustomBudgetLimit.count') { update_custom_limit(test_budget, test_month.id, -100) }
    assert_response :unprocessable_entity
  end

  test 'fails to update custom limit for non-existent month' do
    assert_no_difference('CustomBudgetLimit.count') { update_custom_limit(test_budget, -1, 500) }
    assert_response :not_found
  end

  test 'fails to update custom limit for another users month' do
    assert_no_difference('CustomBudgetLimit.count') { update_custom_limit(test_budget, other_user_month.id, 500) }
    assert_response :not_found
  end

  private

  def test_budget
    user = auth_user
    user.budgets.find_or_create_by(name: 'Test Budget') { |b| b.total = 1000 }
  end

  def test_month
    auth_user.months.find_or_create_by(month: 1, year: 2024)
  end

  def budget_with_custom_limit
    test_budget.tap { |b| b.custom_budget_limits.create(month: test_month, limit: 500) }
  end

  def other_user_month
    other_user = User.create(email: 'other@example.com', provider: 'google', uid: '99999')
    other_user.months.create(month: 1, year: 2024)
  end

  def assert_custom_limit_in_json(json, expected_limit)
    assert json.key?('custom_budget_limits')
    assert_equal 1, json['custom_budget_limits'].length
    assert_equal expected_limit, json['custom_budget_limits'].first['limit']
  end

  def update_custom_limit(budget, month_id, limit)
    put custom_limit_budget_path(budget, month_id: month_id), headers: auth_headers, params: { limit: limit }
  end
end
