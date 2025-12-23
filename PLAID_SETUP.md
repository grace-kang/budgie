# Plaid Integration Setup Guide

This guide will help you set up Plaid integration for your Budgie budgeting app.

## Prerequisites

1. Create a Plaid account at https://dashboard.plaid.com/signup
2. Get your API credentials from the Plaid Dashboard

## Environment Variables

Add the following environment variables to your `.env` file (or your deployment environment):

```bash
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_key_here
PLAID_ENV=sandbox  # Options: sandbox, development, production
```

For development, use `sandbox`. For production, use `production`.

## Installation Steps

1. **Install the Plaid gem:**
   ```bash
   bundle install
   ```

2. **Run the migrations:**
   ```bash
   rails db:migrate
   ```

3. **Set up Plaid webhooks (optional but recommended):**
   - In your Plaid Dashboard, go to Team Settings > Webhooks
   - Add your webhook URL: `https://your-domain.com/plaid/webhook`
   - This allows Plaid to notify your app when new transactions are available

## API Endpoints

### Create Link Token
**POST** `/plaid/link_token`
- Creates a Plaid Link token for the current user
- Returns: `{ link_token: "..." }`

### Exchange Public Token
**POST** `/plaid/exchange_token`
- Body: `{ public_token: "..." }`
- Exchanges the public token from Plaid Link for an access token
- Automatically triggers initial transaction sync
- Returns: `{ plaid_account: { id, institution_name, item_id } }`

### List Connected Accounts
**GET** `/plaid/accounts`
- Returns all Plaid accounts for the current user
- Returns: Array of account objects

### Sync Transactions
**POST** `/plaid/accounts/:id/sync`
- Manually triggers a transaction sync for a specific account
- Returns: `{ message: "Sync started" }`

### Disconnect Account
**DELETE** `/plaid/accounts/:id`
- Removes a connected Plaid account
- Returns: `{ message: "Account disconnected" }`

### Webhook Endpoint
**POST** `/plaid/webhook`
- Receives webhooks from Plaid
- Automatically triggers syncs when new transactions are available

## Frontend Integration

To integrate Plaid Link in your frontend, you'll need to:

1. Install Plaid Link:
   ```bash
   npm install react-plaid-link
   # or
   yarn add react-plaid-link
   ```

2. Create a component to handle Plaid Link:
   ```tsx
   import { usePlaidLink } from 'react-plaid-link';
   import { apiFetch } from '../apiClient';

   function PlaidLinkButton() {
     const [linkToken, setLinkToken] = useState<string | null>(null);

     useEffect(() => {
       // Fetch link token from your backend
       apiFetch<{ link_token: string }>('/plaid/link_token', {
         method: 'POST'
       }).then(data => setLinkToken(data.link_token));
     }, []);

     const { open, ready } = usePlaidLink({
       token: linkToken,
       onSuccess: (publicToken) => {
         // Exchange public token
         apiFetch('/plaid/exchange_token', {
           method: 'POST',
           body: JSON.stringify({ public_token: publicToken })
         });
       }
     });

     return (
       <button onClick={() => open()} disabled={!ready}>
         Connect Bank Account
       </button>
     );
   }
   ```

## How It Works

1. **User connects account:**
   - Frontend requests a link token from `/plaid/link_token`
   - User completes Plaid Link flow
   - Frontend sends public token to `/plaid/exchange_token`
   - Backend exchanges token and creates a `PlaidAccount` record
   - Initial sync job is triggered

2. **Transaction syncing:**
   - `PlaidSyncTransactionsJob` fetches transactions from Plaid
   - Transactions are automatically categorized into budgets
   - Transactions are matched by `plaid_transaction_id` to avoid duplicates
   - Cursor is updated to track sync progress

3. **Automatic updates:**
   - Plaid sends webhooks when new transactions are available
   - Webhook handler triggers sync jobs automatically

## Transaction Categorization

Transactions are automatically categorized based on Plaid's category data:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Health & Medical
- Other

You can customize the categorization logic in `app/jobs/plaid_sync_transactions_job.rb`.

## Testing with Sandbox

In sandbox mode, you can use test credentials:
- Username: `user_good`
- Password: `pass_good`

See Plaid's sandbox documentation for more test credentials and scenarios.

## Troubleshooting

- **"Failed to create link token"**: Check your `PLAID_CLIENT_ID` and `PLAID_SECRET` environment variables
- **Transactions not syncing**: Check your background job processor (e.g., Sidekiq, Delayed Job) is running
- **Webhooks not working**: Verify your webhook URL is publicly accessible and correctly configured in Plaid Dashboard

