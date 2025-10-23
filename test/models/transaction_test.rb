# frozen_string_literal: true

require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  test 'should not save without description' do
    month = Month.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(amount: 100, date: Date.new(2024, 1, 1), budget: budget)
    assert_not transaction.save, 'Saved the transaction without a description'
  end

  test 'should not save without amount' do
    month = Month.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(description: 'Groceries', date: Date.new(2024, 1, 1), budget: budget)
    assert_not transaction.save, 'Saved the transaction without an amount'
  end

  test 'should not save without date' do
    month = Month.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(description: 'Groceries', amount: 100, budget: budget)
    assert_not transaction.save, 'Saved the transaction without a date'
  end

  test 'belongs to budget' do
    month = Month.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.create(description: 'Groceries', amount: 100, date: Time.zone.today, budget: budget)

    assert_equal budget, transaction.budget
  end

  test 'date must be within budget month' do
    month = Month.create(month: 1, year: 2024)
    budget = month.budgets.create(name: 'Monthly Budget', total: 1000)

    valid_transaction = Transaction.new(description: 'Groceries', amount: 100, date: Date.new(2024, 1, 15),
                                        budget: budget)
    assert valid_transaction.valid?, 'Transaction with date within budget month is not valid'

    invalid_transaction = Transaction.new(description: 'Rent', amount: 500, date: Date.new(2024, 2, 1), budget: budget)
    assert_not invalid_transaction.valid?, 'Transaction with date outside budget month is valid'
  end
end
