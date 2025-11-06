# frozen_string_literal: true

class SessionsController < ApplicationController
  def create # rubocop:disable Metrics/AbcSize
    user_info = request.env['omniauth.auth']
    user = User.find_or_create_by(provider: user_info['provider'], uid: user_info['uid']) do |u|
      u.email = user_info['info']['email']
      u.name = user_info['info']['name']
    end

    session[:user_id] = user.id
    redirect_to root_path, notice: "Signed in with #{user.provider.titleize}!"
  end
end
