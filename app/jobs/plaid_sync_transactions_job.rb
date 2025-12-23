# frozen_string_literal: true

class PlaidSyncTransactionsJob < ApplicationJob
  queue_as :default

  def perform(plaid_account_id)
    plaid_account = PlaidAccount.find_by(id: plaid_account_id)
    return unless plaid_account

    plaid_service = PlaidService.new
    # If cursor is set but we want to force a full resync, set cursor to nil
    # For now, use the stored cursor (which will only get new transactions)
    cursor = plaid_account.cursor
    has_more = true
    synced_count = 0
    batch_count = 0

    Rails.logger.info "Starting sync for PlaidAccount #{plaid_account_id}, cursor: #{cursor || 'nil (full historical sync)'}"

    while has_more
      batch_count += 1
      Rails.logger.info "Fetching batch #{batch_count} with cursor: #{cursor}"

      result = plaid_service.get_transactions(
        plaid_account.access_token,
        cursor: cursor
      )

      added_count = result[:transactions]&.length || 0
      removed_count = result[:removed]&.length || 0

      Rails.logger.info "Batch #{batch_count}: #{added_count} transactions to process, #{removed_count} to remove"

      # Process added and modified transactions
      (result[:transactions] || []).each do |plaid_transaction|
        sync_transaction(plaid_account, plaid_transaction)
        synced_count += 1
      end

      # Handle removed transactions
      (result[:removed] || []).each do |removed_transaction|
        transaction = Transaction.find_by(plaid_transaction_id: removed_transaction.transaction_id)
        transaction&.destroy
      end

      cursor = result[:next_cursor]
      has_more = result[:has_more]

      Rails.logger.info "Batch #{batch_count} complete. Has more: #{has_more}, next cursor: #{cursor}"

      # Update cursor after each batch
      plaid_account.update_cursor(cursor) if cursor.present?
    end

    Rails.logger.info "Sync complete for PlaidAccount #{plaid_account_id}: #{synced_count} transactions synced in #{batch_count} batch(es)"
  rescue StandardError => e
    Rails.logger.error "Failed to sync transactions for PlaidAccount #{plaid_account_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise
  end

  private

  def sync_transaction(plaid_account, plaid_transaction)
    # Skip pending transactions
    return if plaid_transaction.pending

    # Find or create transaction by plaid_transaction_id
    transaction = Transaction.find_or_initialize_by(
      plaid_transaction_id: plaid_transaction.transaction_id
    )

    # Find or create the appropriate budget for this transaction
    # Handle both string and Date formats from Plaid
    transaction_date = if plaid_transaction.date.is_a?(Date)
                         plaid_transaction.date
                       elsif plaid_transaction.date.is_a?(String)
                         Date.parse(plaid_transaction.date)
                       else
                         Date.parse(plaid_transaction.date.to_s)
                       end
    month = plaid_account.user.months.find_or_create_by(
      month: transaction_date.month,
      year: transaction_date.year
    )

    # Try to match to an existing budget by name or create a default one
    # You may want to customize this logic based on your needs
    budget_name = categorize_transaction(plaid_transaction)
    budget = month.budgets.find_or_create_by(name: budget_name) do |b|
      b.total = 0
    end

    # Update transaction attributes
    transaction.assign_attributes(
      plaid_account: plaid_account,
      budget: budget,
      description: plaid_transaction.name || plaid_transaction.merchant_name || 'Unknown',
      amount: plaid_transaction.amount.abs, # Plaid uses negative for debits
      date: transaction_date
    )

    transaction.save!
  rescue StandardError => e
    Rails.logger.error "Failed to sync transaction #{plaid_transaction.transaction_id}: #{e.message}"
  end

  def categorize_transaction(plaid_transaction)
    # Plaid uses personal_finance_category with primary and detailed fields
    # Format: primary="FOOD_AND_DRINK", detailed="FOOD_AND_DRINK_FAST_FOOD"
    pfc = plaid_transaction.personal_finance_category

    # Get category values, handling both old category array and new personal_finance_category
    categories = plaid_transaction.category || []
    category_text = categories.map(&:downcase).join(' ')

    primary_category = pfc&.primary&.downcase || ''
    detailed_category = pfc&.detailed&.downcase || ''

    # Combine all category information
    all_categories = [category_text, primary_category, detailed_category].join(' ')

    # Log category info for debugging
    Rails.logger.info "Categorizing transaction: #{plaid_transaction.name || plaid_transaction.merchant_name}"
    Rails.logger.info "  Category array: #{categories.inspect}"
    Rails.logger.info "  PFC Primary: #{pfc&.primary.inspect}"
    Rails.logger.info "  PFC Detailed: #{pfc&.detailed.inspect}"
    Rails.logger.info "  Combined text: '#{all_categories}'"

    # Match against category text (handle both old format and new PFC format)
    # PFC uses underscores: FOOD_AND_DRINK, FOOD_AND_DRINK_FAST_FOOD, etc.
    result = case all_categories
             when /food|restaurant|dining|grocery|supermarket|fast.food|coffee|bar|cafe|pizza|food_and_drink/
               'Food & Dining'
             when /transport|travel|gas|fuel|taxi|uber|lyft|parking|toll|public.transit|automotive|general.transportation/
               'Transportation'
             when /shopping|retail|store|merchandise|department|clothing|apparel|electronics|amazon|general.merchandise/
               'Shopping'
             when /entertainment|recreation|movie|theater|sport|game|music|streaming|netflix|spotify|general.entertainment/
               'Entertainment'
             when /bills|utilities|phone|internet|electric|water|utility|telecommunication|mobile|wireless|general.services|utilities/
               'Bills & Utilities'
             when /health|medical|pharmacy|doctor|hospital|dental|vision|drug|prescription|general.healthcare/
               'Health & Medical'
             when /transfer|deposit|withdrawal|payment|credit|debit|general.transfer/
               'Other'
             else
               'Other'
             end

    Rails.logger.info "  → Categorized as: #{result}"
    result
  end
end
