import React, { useState } from 'react';
import SignIn from './SignIn';
import Months from './Months';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthCallback from './AuthCallback';
import TransactionView from './TransactionView';

type ViewType = 'months' | 'transactions';

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
      </div>
      {view === 'months' ? <Months /> : <TransactionView />}
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
