# frozen_string_literal: true

class User < ApplicationRecord
  has_many :months, dependent: :destroy
  has_many :budgets, dependent: :destroy
  has_many :transactions, through: :months, source: :transactions
  has_many :plaid_accounts, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :provider, :uid, presence: true
  validate :validate_theme_preference

  THEME_OPTIONS = %w[light dark pink].freeze

  def theme
    preferences['theme'] || 'light'
  end

  def theme=(value)
    self.preferences ||= {}
    self.preferences['theme'] = value
  end

  private

  def validate_theme_preference
    return unless preferences.present? && preferences['theme'].present?

    return if THEME_OPTIONS.include?(preferences['theme'])

    errors.add(:preferences, "theme must be one of: #{THEME_OPTIONS.join(', ')}")
  end
end
