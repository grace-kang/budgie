# frozen_string_literal: true

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'should not save without email' do
    user = User.new(provider: 'google', uid: '12345')
    assert_not user.save, 'Saved the user without an email'
  end

  test 'should not save without provider' do
    user = User.new(email: 'test@example.com', uid: '12345')
    assert_not user.save, 'Saved the user without a provider'
  end

  test 'should not save without uid' do
    user = User.new(email: 'test@example.com', provider: 'google')
    assert_not user.save, 'Saved the user without a uid'
  end

  test 'should save with valid attributes' do
    user = User.new(email: 'test@example.com', provider: 'google', uid: '12345')
    assert user.save, 'Could not save the user with valid attributes'
  end

  test 'should have many months' do
    user = User.create(email: 'test@example.com', provider: 'google', uid: '12345')
    month1 = user.months.create(month: 1, year: 2024)
    month2 = user.months.create(month: 2, year: 2024)
    assert_equal 2, user.months.count, 'User does not have the correct number of months'
    assert_includes user.months, month1
    assert_includes user.months, month2
  end
end
