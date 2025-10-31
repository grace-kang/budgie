# frozen_string_literal: true

class SpaController < ApplicationController
  def index
    render template: 'index'
  end
end
