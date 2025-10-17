# frozen_string_literal: true

require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get budgets_url
    assert_response :success
  end

  test 'should get new' do
    get new_budget_url
    assert_response :success
  end

  test 'should create budget' do
    assert_difference('Budget.count') do
      post budgets_url, params: { budget: { name: 'New Budget', total: 500 } }
    end

    assert_redirected_to budgets_url
  end

  test 'fails to create budget with invalid data' do
    assert_no_difference('Budget.count') do
      post budgets_url, params: { budget: { name: '', total: 500 } }
    end
    assert_response :unprocessable_entity
  end

  test 'should show budget' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    get budget_url(budget)
    assert_response :success
  end

  test 'should get edit' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    get edit_budget_url(budget)
    assert_response :success
  end

  test 'should update budget' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    patch budget_url(budget), params: { budget: { name: 'Updated Budget', total: 1500 } }
    assert_redirected_to budgets_url
  end

  test 'fails to update budget with invalid data' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    patch budget_url(budget), params: { budget: { name: '', total: 1500 } }
    assert_response :unprocessable_entity
  end

  test 'should destroy budget' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
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
end
