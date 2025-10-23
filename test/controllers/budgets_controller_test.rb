# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get budgets_url
    assert_response :success
  end

  test 'should create budget' do
    month = Month.create(month: 1, year: 2024)
    assert_difference('Budget.count') do
      post budgets_url, params: { budget: { name: 'New Budget', total: 500, month_id: month.id } }
    end

    assert_redirected_to budgets_url
  end

  test 'fails to create budget with invalid data' do
    month = Month.create(month: 1, year: 2024)
    assert_no_difference('Budget.count') do
      post budgets_url, params: { budget: { name: '', total: 500, month_id: month.id } }
    end
    assert_response :unprocessable_entity
  end

  test 'should show budget' do
    get budget_url(test_budget)
    assert_response :success
  end

  test 'should get edit' do
    get edit_budget_url(test_budget)
    assert_response :success
  end

  test 'should update budget' do
    patch budget_url(test_budget), params: { budget: { name: 'Updated Budget', total: 1500 } }
    assert_redirected_to budgets_url
  end

  test 'fails to update budget with invalid data' do
    patch budget_url(test_budget), params: { budget: { name: '', total: 1500 } }
    assert_response :unprocessable_entity
  end

  test 'should destroy budget' do
    budget = test_budget

    assert_difference('Budget.count', -1) do
      delete budget_url(budget)
    end

    assert_redirected_to budgets_url
  end

  test 'fails to destroy non-existent budget' do
    assert_no_difference('Budget.count') do
      delete budget_url(id: -1)
    end
    assert_response :not_found
  end

  private

  def test_budget
    month = Month.create(month: 1, year: 2024)
    month.budgets.create(name: 'Test Budget', total: 1000)
  end
end
