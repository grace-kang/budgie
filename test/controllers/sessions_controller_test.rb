# frozen_string_literal: true

require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @omniauth_hash = {
      'provider' => 'google_oauth2',
      'uid' => '12345',
      'info' => {
        'email' => 'test@example.com',
        'name' => 'Test User'
      }
    }

    ENV['FRONTEND_URL'] = 'http://www.example.com'
  end

  test 'should create session and redirect with token' do
    # Mock out the OmniAuth environment for the request
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(@omniauth_hash)

    # Simulate the callback route (whatever OmniAuth posts to)
    get '/auth/google_oauth2/callback', env: { 'omniauth.auth' => @omniauth_hash }

    user = User.find_by(email: 'test@example.com')
    assert user.present?, 'User should have been created'

    # Should redirect to frontend with a JWT token
    assert_response :redirect
    redirect_url = response.headers['Location']
    assert_match %r{http://www.example.com/auth/callback\?token=}, redirect_url

    # Decode token to verify correctness if you want
    token = redirect_url.split('token=').last
    payload = JsonWebToken.decode(token)
    assert_equal user.id, payload[:user_id]

    # Check that the user's current month record was created
    today = Time.zone.today
    assert user.months.exists?(month: today.month, year: today.year)
  end

  test 'should find existing user on login' do
    existing_user = User.create(email: 'test@example.com', provider: 'google_oauth2', uid: '12345',
                                name: 'Existing User')
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(@omniauth_hash)

    get '/auth/google_oauth2/callback', env: { 'omniauth.auth' => @omniauth_hash }
    assert_response :redirect
    user = User.find_by(email: 'test@example.com')
    assert_equal existing_user.id, user.id, 'Should find the existing user, not create a new one'
  end

  test 'creates current month for new user on login' do
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(@omniauth_hash)
    get '/auth/google_oauth2/callback', env: { 'omniauth.auth' => @omniauth_hash }
    user = User.find_by(email: 'test@example.com')
    today = Time.zone.today
    month = user.months.find_by(month: today.month, year: today.year)
    assert month.present?, 'Current month should be created for new user'
  end

  test 'creates example budgets for new user on first login' do
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(@omniauth_hash)
    get '/auth/google_oauth2/callback', env: { 'omniauth.auth' => @omniauth_hash }
    user = User.find_by(email: 'test@example.com')
    today = Time.zone.today
    month = user.months.find_by(month: today.month, year: today.year)
    assert month.present?, 'Current month should be created'
    assert month.budgets.any?, 'Example budgets should be created for new user'
    budget_names = month.budgets.pluck(:name)
    assert_includes budget_names, 'Groceries'
    assert_includes budget_names, 'Housing'
    assert_includes budget_names, 'Dining Out'
  end
end
