import React, { useState, useEffect, useRef } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {
  usePlaidAccounts,
  useCreateLinkToken,
  useExchangePlaidToken,
  useSyncPlaidAccount,
  useDeletePlaidAccount,
} from '../hooks/usePlaid';
import TrashIcon from '/icons/trash.svg';

export default function PlaidAccounts() {
  const { data: accounts = [], isLoading } = usePlaidAccounts();
  const { data: linkTokenData, refetch: fetchLinkToken } = useCreateLinkToken();
  const exchangeToken = useExchangePlaidToken();
  const syncAccount = useSyncPlaidAccount();
  const deleteAccount = useDeletePlaidAccount();

  const [isConnecting, setIsConnecting] = useState(false);
  const shouldOpenRef = useRef(false);

  const { open, ready } = usePlaidLink({
    token: linkTokenData?.link_token || null,
    onSuccess: (publicToken) => {
      exchangeToken.mutate(publicToken, {
        onSuccess: () => {
          setIsConnecting(false);
          shouldOpenRef.current = false;
        },
        onError: () => {
          setIsConnecting(false);
          shouldOpenRef.current = false;
        },
      });
    },
    onExit: () => {
      setIsConnecting(false);
      shouldOpenRef.current = false;
    },
  });

  // Open Plaid Link when token is ready
  useEffect(() => {
    if (shouldOpenRef.current && linkTokenData?.link_token && ready) {
      open();
      shouldOpenRef.current = false;
    }
  }, [linkTokenData?.link_token, ready, open]);

  const handleConnect = async () => {
    setIsConnecting(true);
    shouldOpenRef.current = true;
    try {
      await fetchLinkToken();
    } catch (error) {
      console.error('Failed to get link token:', error);
      setIsConnecting(false);
      shouldOpenRef.current = false;
    }
  };

  const handleSync = (accountId: number, forceResync = false) => {
    syncAccount.mutate({ accountId, forceResync });
  };

  const handleDelete = (accountId: number) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      deleteAccount.mutate(accountId);
    }
  };

  return (
    <div className="plaid-accounts">
      <div className="plaid-accounts-header">
        <h2>Bank Accounts</h2>
        <button onClick={handleConnect} disabled={isConnecting} className="button-primary">
          {isConnecting ? 'Connecting...' : 'Connect Bank Account'}
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <p>No bank accounts connected yet.</p>
          <p>Click "Connect Bank Account" to link your bank account with Plaid.</p>
        </div>
      ) : (
        <div className="accounts-list">
          {accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-info">
                <h3>{account.institution_name}</h3>
                <p className="account-meta">
                  Last synced:{' '}
                  {account.last_successful_update
                    ? new Date(account.last_successful_update).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <div className="account-actions">
                <button
                  onClick={() => handleSync(account.id, false)}
                  disabled={syncAccount.isPending}
                  className="button-secondary"
                  title="Sync new transactions only"
                >
                  {syncAccount.isPending ? 'Syncing...' : 'Sync New'}
                </button>
                <button
                  onClick={() => handleSync(account.id, true)}
                  disabled={syncAccount.isPending}
                  className="button-secondary"
                  title="Resync all historical transactions"
                >
                  {syncAccount.isPending ? 'Syncing...' : 'Resync All'}
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  disabled={deleteAccount.isPending}
                  className="button-danger"
                  aria-label="Disconnect account"
                >
                  <img src={TrashIcon} className="icon-button" alt="Disconnect" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {exchangeToken.isError && (
        <div className="error-message">Failed to connect account. Please try again.</div>
      )}

      {syncAccount.isError && (
        <div className="error-message">Failed to sync transactions. Please try again.</div>
      )}
    </div>
  );
}
