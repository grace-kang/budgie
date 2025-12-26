# frozen_string_literal: true

class UsersController < ApplicationController
  def preferences
    render json: { preferences: current_user.preferences }, status: :ok
  end

  def update_preferences
    new_preferences = (current_user.preferences || {}).merge(preferences_params.to_h)
    current_user.preferences = new_preferences

    if current_user.save
      render json: { preferences: current_user.preferences }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def preferences_params
    params.require(:preferences).permit(:theme)
  end
end

