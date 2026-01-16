# frozen_string_literal: true

require 'test_helper'

class TransactionControllerTest < ActionDispatch::IntegrationTest
  test 'gets all transactions' do
    get transactions_path, headers: auth_headers
    assert_response :success
  end

  test 'gets transactions for a budget' do
    budget = test_budget
    get budget_transactions_path(budget), headers: auth_headers
    assert_response :success
  end

  test 'gets transactions for a non-existent budget' do
    get budget_transactions_path(budget_id: -1), headers: auth_headers
    assert_response :not_found
  end

  test 'creates a transaction' do
    budget, _month = test_budget_and_month
    assert_difference('Transaction.count', 1) do
      post budget_transactions_path(budget), headers: auth_headers, params: {
        transaction: {
          description: 'Test Transaction',
          amount: 100,
          date: Date.new(2024, 1, 15),
          budget_id: budget.id
        }
      }
    end
    assert_response :created
  end

  test 'fails to create a transaction with invalid data' do
    budget, _month = test_budget_and_month
    assert_no_difference('Transaction.count') do
      post budget_transactions_path(budget), headers: auth_headers, params: {
        transaction: {
          description: nil,
          amount: 100,
          date: Date.new(2024, 1, 15),
          budget_id: budget.id
        }
      }
    end
    assert_response :unprocessable_entity
  end

  test 'deletes a transaction' do
    budget, month = test_budget_and_month
    transaction = Transaction.create(
      description: 'Test Transaction',
      amount: 100,
      date: Date.new(2024, 1, 15),
      budget_id: budget.id,
      month_id: month.id
    )
    assert_difference('Transaction.count', -1) do
      delete budget_transaction_path(budget, transaction), headers: auth_headers
    end
    assert_response :ok
  end

  test 'fails to delete a non-existent transaction' do
    budget = test_budget
    assert_no_difference('Transaction.count') do
      delete budget_transaction_path(budget, id: -1), headers: auth_headers
    end
    assert_response :not_found
  end

  test 'updates a transaction' do
    budget, month = test_budget_and_month
    transaction = Transaction.create!(
      description: 'Test Transaction',
      amount: 100,
      date: Date.new(2024, 1, 15),
      budget: budget,
      month: month
    )

    put transaction_path(transaction), headers: auth_headers, params: {
      transaction: {
        description: 'Updated Transaction',
        amount: 150,
        date: Date.new(2024, 1, 20),
        budget_id: budget.id
      }
    }

    assert_response :ok
    transaction.reload
    assert_equal 'Updated Transaction', transaction.description
    assert_equal 150, transaction.amount.to_f
  end

  test 'fails to update transaction with invalid budget' do
    budget, month = test_budget_and_month
    transaction = Transaction.create!(
      description: 'Test Transaction',
      amount: 100,
      date: Date.new(2024, 1, 15),
      budget: budget,
      month: month
    )

    put transaction_path(transaction), headers: auth_headers, params: {
      transaction: {
        description: 'Updated Transaction',
        amount: 150,
        date: Date.new(2024, 1, 20),
        budget_id: -1
      }
    }

    assert_response :not_found
  end

  private

  def test_budget
    budget, _month = test_budget_and_month
    budget
  end

  def test_budget_and_month
    user = auth_user
    month = user.months.find_or_create_by(month: 1, year: 2024)
    budget = month.budgets.find_or_create_by(name: 'Test Budget', user: user) { |b| b.total = 1000 }
    [budget, month]
  end
end
