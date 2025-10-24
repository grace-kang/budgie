# frozen_string_literal: true

require 'test_helper'

class TransactionControllerTest < ActionDispatch::IntegrationTest
  test 'creates a transaction' do
    budget = test_budget
    assert_difference('Transaction.count', 1) do
      post budget_transactions_path(budget), params: {
        transaction: {
          description: 'Test Transaction',
          amount: 100,
          date: Date.new(2024, 1, 15),
          budget_id: budget.id
        }
      }
    end
    assert_redirected_to budget_path(budget)
  end

  test 'fails to create a transaction with invalid data' do
    budget = test_budget
    assert_no_difference('Transaction.count') do
      post budget_transactions_path(budget), params: {
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

  test 'fails to create a transaction with date outside budget month' do
    budget = test_budget
    assert_no_difference('Transaction.count') do
      post budget_transactions_path(budget), params: {
        transaction: {
          description: 'Test Transaction',
          amount: 100,
          date: Date.new(2024, 2, 15),
          budget_id: budget.id
        }
      }
    end
    assert_response :unprocessable_entity
  end

  test 'deletes a transaction' do
    budget = test_budget
    transaction = Transaction.create(
      description: 'Test Transaction',
      amount: 100,
      date: Date.new(2024, 1, 15),
      budget_id: budget.id
    )
    assert_difference('Transaction.count', -1) do
      delete transaction_path(transaction)
    end
    assert_redirected_to budget_path(budget)
  end

  test 'fails to delete a non-existent transaction' do
    assert_no_difference('Transaction.count') do
      delete transaction_path(id: -1)
    end
    assert_response :not_found
  end

  private

  def test_budget
    month = Month.create(month: 1, year: 2024)
    month.budgets.create(name: 'Test Budget', total: 1000)
  end
end
