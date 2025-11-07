# frozen_string_literal: true

require 'test_helper'

class TransactionControllerTest < ActionDispatch::IntegrationTest
  test 'creates a transaction' do
    budget = test_budget
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
    budget = test_budget
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

  test 'fails to create a transaction with date outside budget month' do
    budget = test_budget
    assert_no_difference('Transaction.count') do
      post budget_transactions_path(budget), headers: auth_headers, params: {
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
      delete transaction_path(transaction), headers: auth_headers
    end
    assert_response :ok
  end

  test 'fails to delete a non-existent transaction' do
    assert_no_difference('Transaction.count') do
      delete transaction_path(id: -1), headers: auth_headers
    end
    assert_response :not_found
  end

  private

  def test_budget
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month = user.months.create(month: 1, year: 2024)
    month.budgets.create(name: 'Test Budget', total: 1000)
  end
end
