# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should create budget' do
    month = Month.create(month: 1, year: 2024)
    assert_difference('Budget.count') do
      post month_budgets_url(month), params: { budget: { name: 'New Budget', total: 500 } }
    end

    assert_response :created
  end

  test 'fails to create budget with invalid data' do
    month = Month.create(month: 1, year: 2024)
    assert_no_difference('Budget.count') do
      post month_budgets_url(month), params: { budget: { name: '', total: 500 } }
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
    assert_response :ok
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

    assert_response :ok
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
