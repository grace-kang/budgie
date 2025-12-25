# frozen_string_literal: true

require 'test_helper'

class MonthsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get months_url, headers: auth_headers
    assert_response :success
  end

  test 'fails to create month with invalid data' do
    assert_no_difference('Month.count') do
      post months_url, headers: auth_headers, params: { month: { month: nil, year: 2024 } }
    end
    assert_response :unprocessable_entity
  end

  test 'should destroy month' do
    month = test_user.months.create(month: 3, year: 2024)
    assert_difference('Month.count', -1) do
      delete month_url(month), headers: auth_headers
    end
    assert_response :ok
  end

  test 'fails to destroy non-existent month' do
    assert_no_difference('Month.count') do
      delete month_url(id: 'non-existent-id'), headers: auth_headers
    end
    assert_response :not_found
  end

  private

  def test_user
    User.create(email: 'test@example.com', provider: 'google', uid: '12345')
  end
end
