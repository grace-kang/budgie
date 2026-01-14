# frozen_string_literal: true

class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  before_action :authorize_request, except: :feature_flags
  helper_method :current_user

  def feature_flags
    render json: {
      plaid_enabled: FeatureFlags.plaid_enabled?
    }
  end

  private

  attr_reader :current_user

  def authorize_request
    header = request.headers['Authorization']
    header = header.split.last if header
    decoded = JsonWebToken.decode(header)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render json: { errors: 'Unauthorized' }, status: :unauthorized
  end
end
