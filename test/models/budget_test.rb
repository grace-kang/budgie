# frozen_string_literal: true

require 'test_helper'

class BudgetTest < ActiveSupport::TestCase
  test 'should not save without name' do
    budget = Budget.new(total: 1000)
    assert_not budget.save, 'Saved the budget without a name'
  end

  test 'should not save without total' do
    budget = Budget.new(name: 'Monthly Budget')
    assert_not budget.save, 'Saved the budget without a total'
  end

  test 'has many transactions' do
    budget = Budget.create(name: 'Monthly Budget', total: 1000)
    transaction1 = budget.transactions.create(amount: 100, description: 'Groceries', date: Time.zone.today)
    transaction2 = budget.transactions.create(amount: 200, description: 'Rent', date: Time.zone.today)

    assert_equal 2, budget.transactions.count
    assert_includes budget.transactions, transaction1
    assert_includes budget.transactions, transaction2
  end
end
