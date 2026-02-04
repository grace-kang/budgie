# frozen_string_literal: true

require 'test_helper'

class MonthsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get months_url, headers: auth_headers
    assert_response :success
  end

  test 'should create month' do
    assert_difference('Month.count', 1) do
      post months_url, params: { month: { month: 3, year: 2025 } }, headers: auth_headers, as: :json
    end
    assert_response :created
    json = response.parsed_body
    assert_equal 3, json['month']
    assert_equal 2025, json['year']
  end

  test 'create returns existing month when already exists' do
    user = auth_user
    user.months.create!(month: 6, year: 2025)
    assert_no_difference('Month.count') do
      post months_url, params: { month: { month: 6, year: 2025 } }, headers: auth_headers, as: :json
    end
    assert_response :ok
    json = response.parsed_body
    assert_equal 6, json['month']
    assert_equal 2025, json['year']
  end
end
