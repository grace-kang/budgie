# frozen_string_literal: true

module FeatureFlags
  def self.plaid_enabled?
    ENV.fetch('ENABLE_PLAID', 'false') == 'true'
  end
end
