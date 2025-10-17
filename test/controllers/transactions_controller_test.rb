# frozen_string_literal: true

require 'test_helper'

class TransactionControllerTest < ActionDispatch::IntegrationTest
  test 'creates a transaction' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    assert_difference('Transaction.count', 1) do
      post budget_transactions_path(budget), params: {
        transaction: {
          description: 'Test Transaction',
          amount: 100,
          date: Time.zone.today,
          budget_id: budget.id
        }
      }
    end
    assert_redirected_to budget_path(budget)
  end

  test 'fails to create a transaction with invalid data' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    assert_no_difference('Transaction.count') do
      post budget_transactions_path(budget), params: {
        transaction: {
          description: nil,
          amount: 100,
          date: Time.zone.today,
          budget_id: budget.id
        }
      }
    end
    assert_response :unprocessable_entity
  end

  test 'deletes a transaction' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    transaction = Transaction.create(
      description: 'Test Transaction',
      amount: 100,
      date: Time.zone.today,
      budget_id: budget.id
    )
    assert_difference('Transaction.count', -1) do
      delete budget_transaction_path(budget, transaction)
    end
    assert_redirected_to budget_path(budget)
  end

  test 'fails to delete a non-existent transaction' do
    budget = Budget.create(name: 'Test Budget', total: 1000)
    assert_no_difference('Transaction.count') do
      delete budget_transaction_path(budget, id: -1)
    end
    assert_response :not_found
  end
end
