# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_before_action :authorize_request, only: :create

  def create
    user_info = request.env['omniauth.auth']
    user = find_or_create_user(user_info)
    create_current_month_for(user)

    token = JsonWebToken.encode(user_id: user.id)
    redirect_to "#{ENV.fetch('FRONTEND_URL')}/auth/callback?token=#{token}"
  end

  private

  def find_or_create_user(user_info)
    User.find_or_create_by(provider: user_info['provider'], uid: user_info['uid']) do |u|
      u.email = user_info['info']['email']
      u.name = user_info['info']['name']
    end
  end

  def create_current_month_for(user)
    current_date = Time.zone.today
    user.months.find_or_create_by(month: current_date.month, year: current_date.year)
  end
end
