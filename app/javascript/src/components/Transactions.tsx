import React, { useState } from 'react';

import { Transaction, Budget } from '../types';
import TransactionStats from './TransactionStats';
import TransactionsList from './TransactionsList';

type TransactionsProps = {
  transactions: (Transaction & { budgetName: string })[];
  budgets: Budget[];
  form: {
    budgetId: number | null;
    description: string;
    amount: string;
    date: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onDelete: (transaction: Transaction) => void;
  onUpdateTransaction?: (data: {
    id: number;
    budget_id: number | null;
    description: string;
    amount: number;
    date: string;
  }) => void;
};

export default function Transactions({
  transactions,
  budgets,
  form,
  onFormChange,
  onFormSubmit,
  onDelete,
  onUpdateTransaction,
}: TransactionsProps) {
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);

  return (
    <div className="transaction-view">
      <div className="bento-grid">
        <TransactionStats transactions={transactions} />

        <TransactionsList
          transactions={transactions}
          budgets={budgets}
          addForm={form}
          onFormChange={onFormChange}
          onFormSubmit={onFormSubmit}
          editingTransactionId={editingTransactionId}
          onSetEditingId={setEditingTransactionId}
          onDelete={onDelete}
          onUpdateTransaction={onUpdateTransaction}
        />
      </div>
    </div>
  );
}
