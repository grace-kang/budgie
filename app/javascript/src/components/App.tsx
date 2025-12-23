import React, { useState } from 'react';
import SignIn from './SignIn';
import Months from './Months';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from './AuthCallback';
import TransactionView from './TransactionView';
import PlaidAccounts from './PlaidAccounts';

type ViewType = 'months' | 'transactions' | 'accounts';

function MainView() {
  const [view, setView] = useState<ViewType>('months');

  return (
    <div>
      <div className="view-toggle-container">
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
      {view === 'months' ? (
        <Months />
      ) : view === 'transactions' ? (
        <TransactionView />
      ) : (
        <PlaidAccounts />
      )}
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
