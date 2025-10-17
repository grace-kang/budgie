# frozen_string_literal: true

require 'test_helper'

class TransactionTest < ActiveSupport::TestCase
  test 'should not save without description' do
    budget = Budget.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(amount: 100, date: Time.zone.today, budget: budget)
    assert_not transaction.save, 'Saved the transaction without a description'
  end

  test 'should not save without amount' do
    budget = Budget.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(description: 'Groceries', date: Time.zone.today, budget: budget)
    assert_not transaction.save, 'Saved the transaction without an amount'
  end

  test 'should not save without date' do
    budget = Budget.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.new(description: 'Groceries', amount: 100, budget: budget)
    assert_not transaction.save, 'Saved the transaction without a date'
  end

  test 'belongs to budget' do
    budget = Budget.create(name: 'Monthly Budget', total: 1000)
    transaction = Transaction.create(description: 'Groceries', amount: 100, date: Time.zone.today, budget: budget)

    assert_equal budget, transaction.budget
  end
end
