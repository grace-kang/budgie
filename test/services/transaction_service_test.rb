# frozen_string_literal: true

require 'test_helper'

class TransactionServiceTest < ActiveSupport::TestCase
  setup do
    @user = auth_user
    @service = TransactionService.new(@user)
  end

  test 'builds transaction with budget from same month' do
    month = create_month(1, 2024)
    budget = create_budget(month, 'Groceries', total: 500)

    transaction = @service.build_transaction(
      description: 'Test Transaction',
      amount: 50,
      date: Date.new(2024, 1, 15).to_s,
      budget_id: budget.id
    )

    assert_equal 'Test Transaction', transaction.description
    assert_equal 50, transaction.amount.to_f
    assert_equal Date.new(2024, 1, 15), transaction.date
    assert_equal budget.id, transaction.budget_id
    assert_equal month.id, transaction.month_id
  end

  test 'builds transaction with budget from different month creates new month and budget' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Rent', total: 1000)

    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 1) do
        transaction = @service.build_transaction(
          description: 'February Rent',
          amount: 1000,
          date: Date.new(2024, 2, 1).to_s,
          budget_id: january_budget.id
        )

        february_month = find_month(2, 2024)
        february_budget = find_budget_in_month(february_month, 'Rent')

        assert_equal Date.new(2024, 2, 1), transaction.date
        assert_equal february_month.id, transaction.month_id
        assert_equal february_budget.id, transaction.budget_id
        assert_equal 1000, february_budget.total.to_f
      end
    end
  end

  test 'builds transaction for month that does not exist yet' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Utilities', total: 200)

    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 1) do
        transaction = @service.build_transaction(
          description: 'March Utilities',
          amount: 180,
          date: Date.new(2024, 3, 10).to_s,
          budget_id: january_budget.id
        )

        march_month = find_month(3, 2024)
        march_budget = find_budget_in_month(march_month, 'Utilities')

        assert_equal march_month.id, transaction.month_id
        assert_equal march_budget.id, transaction.budget_id
      end
    end
  end

  test 'does not create duplicate budget when budget already exists in target month' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Dining', total: 300)
    february_month = create_month(2, 2024)
    february_budget = create_budget(february_month, 'Dining', total: 300)

    assert_no_difference('Budget.count') do
      transaction = @service.build_transaction(
        description: 'February Meal',
        amount: 25,
        date: Date.new(2024, 2, 15).to_s,
        budget_id: january_budget.id
      )

      assert_equal february_budget.id, transaction.budget_id
      assert_equal february_month.id, transaction.month_id
    end
  end

  test 'prepare_update_params updates month when date changes' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Transportation', total: 150)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'Gas', amount: 40, date: Date.new(2024, 1, 5))

    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 1) do
        updated_params = @service.prepare_update_params(transaction, {
                                                          date: Date.new(2024, 2, 5).to_s,
                                                          budget_id: january_budget.id
                                                        })

        february_month = find_month(2, 2024)
        february_budget = find_budget_in_month(february_month, 'Transportation')

        assert_equal february_month.id, updated_params[:month_id]
        assert_equal february_budget.id, updated_params[:budget_id]
      end
    end
  end

  test 'prepare_update_params updates budget when budget changes to different month' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Groceries', total: 500)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'January Groceries', amount: 50, date: Date.new(2024, 1, 10))
    entertainment_budget = create_budget(january_month, 'Entertainment', total: 200)

    # When February month is created, Month's after_create callback copies all budgets from January
    # So both Groceries and Entertainment will be created in February
    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 2) do
        updated_params = @service.prepare_update_params(transaction, {
                                                          date: Date.new(2024, 2, 15).to_s,
                                                          budget_id: entertainment_budget.id
                                                        })

        february_month = find_month(2, 2024)
        assert_not_nil february_month, 'February month should be created'
        assert_equal february_month.id, updated_params[:month_id]

        february_budget = find_budget_in_month(february_month, 'Entertainment')
        assert_not_nil february_budget, 'Entertainment budget should be created in February'
        assert_equal february_budget.id, updated_params[:budget_id]
      end
    end
  end

  test 'prepare_update_params does not change budget when budget_id is same' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Utilities', total: 200)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'Electricity', amount: 150, date: Date.new(2024, 1, 10))

    assert_no_difference('Budget.count') do
      updated_params = @service.prepare_update_params(transaction, {
                                                        date: Date.new(2024, 1, 15).to_s,
                                                        budget_id: january_budget.id
                                                      })

      assert_equal january_budget.id, updated_params[:budget_id]
      assert_equal january_month.id, updated_params[:month_id]
    end
  end

  test 'prepare_update_params uses existing date when date not provided' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Rent', total: 1000)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'Rent', amount: 1000, date: Date.new(2024, 1, 1))

    updated_params = @service.prepare_update_params(transaction, {
                                                      budget_id: january_budget.id
                                                    })

    assert_equal january_month.id, updated_params[:month_id]
  end

  test 'prepare_update_params creates budget in new month when date changes but budget_id unchanged' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Shopping', total: 300)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'January Shopping', amount: 50, date: Date.new(2024, 1, 10))

    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 1) do
        updated_params = @service.prepare_update_params(transaction, {
                                                          date: Date.new(2024, 2, 15).to_s
                                                        })

        february_month = find_month(2, 2024)
        february_budget = find_budget_in_month(february_month, 'Shopping')

        assert_equal february_month.id, updated_params[:month_id]
        assert_equal february_budget.id, updated_params[:budget_id]
        assert_equal 300, february_budget.total.to_f
      end
    end
  end

  test 'prepare_update_params creates budget in new month when date changes and same budget_id provided' do
    january_month = create_month(1, 2024)
    january_budget = create_budget(january_month, 'Healthcare', total: 150)
    transaction = create_transaction(january_month, january_budget,
                                     description: 'January Doctor Visit', amount: 100, date: Date.new(2024, 1, 5))

    assert_difference('Month.count', 1) do
      assert_difference('Budget.count', 1) do
        updated_params = @service.prepare_update_params(transaction, {
                                                          date: Date.new(2024, 2, 10).to_s,
                                                          budget_id: january_budget.id
                                                        })

        february_month = find_month(2, 2024)
        february_budget = find_budget_in_month(february_month, 'Healthcare')

        assert_equal february_month.id, updated_params[:month_id]
        assert_equal february_budget.id, updated_params[:budget_id]
        assert_equal 150, february_budget.total.to_f
        assert_not_equal january_budget.id, updated_params[:budget_id]
      end
    end
  end

  private

  def create_month(month, year)
    @user.months.find_or_create_by(month: month, year: year)
  end

  def create_budget(month, name, total: 0)
    month.budgets.find_or_create_by(name: name, user: @user) { |b| b.total = total }
  end

  def create_transaction(month, budget, description:, amount:, date:)
    Transaction.create!(
      description: description,
      amount: amount,
      date: date,
      budget: budget,
      month: month
    )
  end

  def find_month(month, year)
    @user.months.find_by(month: month, year: year)
  end

  def find_budget_in_month(month, name)
    @user.budgets.find_by(month_id: month.id, name: name)
  end
end
