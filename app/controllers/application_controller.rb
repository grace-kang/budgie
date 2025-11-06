# frozen_string_literal: true

class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  before_action :require_login
  helper_method :current_user

  private

  def require_login
    return if current_user

    respond_to do |format|
      format.html { redirect_to root_path, alert: 'Please sign in' }
      format.json { render json: { error: 'Unauthorized' }, status: :unauthorized }
    end
  end

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = User.find_by(id: session[:user_id])
  end
end
