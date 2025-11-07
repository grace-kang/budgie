# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should create budget' do
    assert_difference('Budget.count') do
      post month_budgets_url(test_month), headers: auth_headers, params: { budget: { name: 'New Budget', total: 500 } }
    end

    assert_response :created
  end

  test 'fails to create budget with invalid data' do
    assert_no_difference('Budget.count') do
      post month_budgets_url(test_month), headers: auth_headers, params: { budget: { name: '', total: 500 } }
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

    assert_difference('Budget.count', -1) do
      delete budget_url(budget), headers: auth_headers
    end

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
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    user.months.create(month: 1, year: 2024)
  end

  def test_budget
    test_month.budgets.create(name: 'Test Budget', total: 1000)
  end
end
