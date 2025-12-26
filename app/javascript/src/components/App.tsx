import React, { useState } from 'react';
import SignIn from './SignIn';
import Months from './Months';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from './AuthCallback';
import TransactionView from './TransactionView';
import PlaidAccounts from './PlaidAccounts';
import ThemeSelector from './ThemeSelector';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';

type ViewType = 'months' | 'transactions' | 'accounts';

function MainView() {
  const [view, setView] = useState<ViewType>('months');
  useTheme(); // Initialize theme on mount

  return (
    <div className="main-view">
      <header className="app-header">
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
            <button
              onClick={() => setView('accounts')}
              className={`view-toggle-button ${view === 'accounts' ? 'active' : ''}`}
            >
              Bank Accounts
            </button>
          </div>
          <ThemeSelector />
        </div>
      </header>
      <main className="app-main">
        {view === 'months' ? (
          <Months />
        ) : view === 'transactions' ? (
          <TransactionView />
        ) : (
          <PlaidAccounts />
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
