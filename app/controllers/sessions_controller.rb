# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_before_action :authorize_request, only: :create

  def create # rubocop:disable Metrics/AbcSize
    user_info = request.env['omniauth.auth']
    user = User.find_or_create_by(provider: user_info['provider'], uid: user_info['uid']) do |u|
      u.email = user_info['info']['email']
      u.name = user_info['info']['name']
    end

    token = JsonWebToken.encode(user_id: user.id)
    redirect_to "#{ENV.fetch('FRONTEND_URL')}/auth/callback?token=#{token}"
  end
end
