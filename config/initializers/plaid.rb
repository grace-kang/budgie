# frozen_string_literal: true

# Plaid Configuration
# Make sure to set these environment variables:
# - PLAID_CLIENT_ID: Your Plaid client ID
# - PLAID_SECRET: Your Plaid secret key
# - PLAID_ENV: Environment (sandbox, development, or production)
# - ENABLE_PLAID: Set to 'true' to enable Plaid integration

# Default to sandbox if not set
ENV['PLAID_ENV'] ||= 'sandbox' if FeatureFlags.plaid_enabled?
