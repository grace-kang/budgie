# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength
class PlaidSyncTransactionsJob < ApplicationJob
  queue_as :default

  CATEGORY_PATTERNS = {
    'Food & Dining' => %w[
      food restaurant dining grocery supermarket fast.food coffee bar cafe pizza food_and_drink
    ],
    'Transportation' => %w[
      transport travel gas fuel taxi uber lyft parking toll public.transit automotive
      general.transportation
    ],
    'Shopping' => %w[
      shopping retail store merchandise department clothing apparel electronics amazon
      general.merchandise
    ],
    'Entertainment' => %w[
      entertainment recreation movie theater sport game music streaming netflix spotify
      general.entertainment
    ],
    'Bills & Utilities' => %w[
      bills utilities phone internet electric water utility telecommunication mobile wireless
      general.services
    ],
    'Health & Medical' => %w[
      health medical pharmacy doctor hospital dental vision drug prescription general.healthcare
    ]
  }.freeze

  def perform(plaid_account_id)
    plaid_account = PlaidAccount.find_by(id: plaid_account_id)
    return unless plaid_account

    sync_account_transactions(plaid_account)
  rescue StandardError => e
    log_sync_error(plaid_account_id, e)
    raise
  end

  private

  def sync_account_transactions(plaid_account)
    plaid_service = PlaidService.new
    cursor = plaid_account.cursor
    synced_count = 0

    sync_all_batches(plaid_service, plaid_account, cursor, synced_count)
  end

  def sync_all_batches(plaid_service, plaid_account, cursor, synced_count)
    loop do
      result = fetch_transaction_batch(plaid_service, plaid_account, cursor)
      synced_count += process_batch(result, plaid_account)
      cursor = update_cursor_and_check_more(plaid_account, result)
      break unless result[:has_more]
    end
    synced_count
  end

  def fetch_transaction_batch(plaid_service, plaid_account, cursor)
    plaid_service.get_transactions(plaid_account.access_token, cursor: cursor)
  end

  def process_batch(result, plaid_account)
    synced_count = process_transactions(result[:transactions], plaid_account)
    process_removed_transactions(result[:removed])
    synced_count
  end

  def update_cursor_and_check_more(plaid_account, result)
    cursor = result[:next_cursor]
    plaid_account.update_cursor(cursor) if cursor.present?
    cursor
  end

  def log_sync_error(plaid_account_id, error)
    Rails.logger.error "Failed to sync transactions for PlaidAccount #{plaid_account_id}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end

  def sync_transaction(plaid_account, plaid_transaction)
    return if plaid_transaction.pending

    transaction = find_or_initialize_transaction(plaid_transaction)
    transaction_date = parse_transaction_date(plaid_transaction)
    month = find_or_create_month(plaid_account, transaction_date)
    budget = find_or_create_budget(plaid_account, plaid_transaction, month)

    transaction_data = { plaid_transaction: plaid_transaction, transaction_date: transaction_date }
    update_transaction_attributes(transaction, plaid_account, budget, month, transaction_data)
    transaction.save!
  rescue StandardError => e
    Rails.logger.error "Failed to sync transaction #{plaid_transaction.transaction_id}: #{e.message}"
  end

  def find_or_initialize_transaction(plaid_transaction)
    Transaction.find_or_initialize_by(plaid_transaction_id: plaid_transaction.transaction_id)
  end

  def parse_transaction_date(plaid_transaction)
    case plaid_transaction.date
    when Date
      plaid_transaction.date
    when String
      Date.parse(plaid_transaction.date)
    else
      Date.parse(plaid_transaction.date.to_s)
    end
  end

  def find_or_create_budget(plaid_account, plaid_transaction, month)
    budget_name = categorize_transaction(plaid_transaction)
    month.budgets.find_or_create_by(name: budget_name, user: plaid_account.user) { |b| b.total = 0 }
  end

  def find_or_create_month(plaid_account, transaction_date)
    plaid_account.user.months.find_or_create_by(
      month: transaction_date.month,
      year: transaction_date.year
    )
  end

  def update_transaction_attributes(transaction, plaid_account, budget, month, transaction_data)
    plaid_transaction = transaction_data[:plaid_transaction]
    transaction_date = transaction_data[:transaction_date]
    transaction.assign_attributes(
      plaid_account: plaid_account,
      budget: budget,
      month: month,
      description: extract_description(plaid_transaction),
      amount: plaid_transaction.amount.abs,
      date: transaction_date
    )
  end

  def extract_description(plaid_transaction)
    plaid_transaction.name || plaid_transaction.merchant_name || 'Unknown'
  end

  def categorize_transaction(plaid_transaction)
    all_categories = build_category_text(plaid_transaction)
    match_category(all_categories)
  end

  def build_category_text(plaid_transaction)
    category_text = build_category_text_from_categories(plaid_transaction)
    pfc_text = build_category_text_from_pfc(plaid_transaction)
    [category_text, pfc_text].join(' ').strip
  end

  def build_category_text_from_categories(plaid_transaction)
    categories = plaid_transaction.category || []
    categories.map(&:downcase).join(' ')
  end

  def build_category_text_from_pfc(plaid_transaction)
    pfc = plaid_transaction.personal_finance_category
    primary = pfc&.primary&.downcase || ''
    detailed = pfc&.detailed&.downcase || ''
    [primary, detailed].join(' ')
  end

  def match_category(all_categories)
    matched_category = find_matching_category(all_categories)
    matched_category || 'Other'
  end

  def find_matching_category(all_categories)
    normalized_categories = all_categories.downcase
    category_patterns.each do |category_name, keywords|
      return category_name if keywords.any? { |keyword| normalized_categories.include?(keyword) }
    end
    nil
  end

  def category_patterns
    CATEGORY_PATTERNS
  end

  def process_transactions(transactions, plaid_account)
    count = 0
    (transactions || []).each do |plaid_transaction|
      sync_transaction(plaid_account, plaid_transaction)
      count += 1
    end
    count
  end

  def process_removed_transactions(removed)
    (removed || []).each do |removed_transaction|
      transaction = Transaction.find_by(plaid_transaction_id: removed_transaction.transaction_id)
      transaction&.destroy
    end
  end
end
# rubocop:enable Metrics/ClassLength
