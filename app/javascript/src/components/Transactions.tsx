import React, { useState } from 'react';

import { Transaction, Budget } from '../types';
import { getFilteredBudgets } from '../helpers/budgets';
import TransactionStats from './TransactionStats';
import TransactionsToolbar from './TransactionsToolbar';
import TransactionAddForm from './TransactionAddForm';
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
  showAddForm: boolean;
  onOpenAddForm: () => void;
  onCloseAddForm: () => void;
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
  showAddForm,
  onOpenAddForm,
  onCloseAddForm,
  onFormChange,
  onFormSubmit,
  onDelete,
  onUpdateTransaction,
}: TransactionsProps) {
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
  const filteredBudgetsForForm = getFilteredBudgets(budgets, form.date);

  return (
    <div className="transaction-view">
      <div className="bento-grid">
        <TransactionStats transactions={transactions} />

        <TransactionsToolbar
          showAddForm={showAddForm}
          onOpenAddForm={onOpenAddForm}
          onCloseAddForm={onCloseAddForm}
        />

        {showAddForm && (
          <TransactionAddForm
            form={form}
            filteredBudgets={filteredBudgetsForForm}
            onFormChange={onFormChange}
            onFormSubmit={onFormSubmit}
          />
        )}

        <TransactionsList
          transactions={transactions}
          budgets={budgets}
          editingTransactionId={editingTransactionId}
          onSetEditingId={setEditingTransactionId}
          onDelete={onDelete}
          onUpdateTransaction={onUpdateTransaction}
        />
      </div>
    </div>
  );
}
