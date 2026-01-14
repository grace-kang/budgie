import { useState } from 'react';
import SignIn from './SignIn';
import Months from './Months';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from './AuthCallback';
import TransactionView from './TransactionView';
import PlaidAccounts from './PlaidAccounts';
import ThemeSelector from './ThemeSelector';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

type ViewType = 'months' | 'transactions' | 'accounts';

function MainView() {
  const [view, setView] = useState<ViewType>('months');
  const { data: featureFlags } = useFeatureFlags();
  useTheme(); // Initialize theme on mount

  return (
    <div className="main-view">
      <div className="app-header">
        <div className="title">
          <div className="app-logo">
            <Logo className="logo-icon" size={40} />
            <h1>budgie</h1>
          </div>
        </div>
        <div className="app-header-content">
          <div className="view-toggle-group">
            <button
              onClick={() => setView('months')}
              className={`view-toggle-button ${view === 'months' ? 'active' : ''}`}
            >
              Months
            </button>
            <button
              onClick={() => setView('transactions')}
              className={`view-toggle-button ${view === 'transactions' ? 'active' : ''}`}
            >
              Transactions
            </button>
            {featureFlags?.plaid_enabled && (
              <button
                onClick={() => setView('accounts')}
                className={`view-toggle-button ${view === 'accounts' ? 'active' : ''}`}
              >
                Bank Accounts
              </button>
            )}
          </div>
          <ThemeSelector />
        </div>
      </div>
      <main className="app-main">
        {view === 'months' ? (
          <Months />
        ) : view === 'transactions' ? (
          <TransactionView />
        ) : (
          featureFlags?.plaid_enabled && <PlaidAccounts />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<MainView />} />
      </Routes>
    </Router>
  );
}
