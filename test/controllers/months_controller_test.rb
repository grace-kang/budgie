# frozen_string_literal: true

require 'test_helper'

class MonthsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get months_url, headers: auth_headers
    assert_response :success
  end
end
