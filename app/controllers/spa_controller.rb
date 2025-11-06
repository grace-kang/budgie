# frozen_string_literal: true

class SpaController < ApplicationController
  skip_before_action :authorize_request, only: :index

  def index
    render template: 'index'
  end
end
