import React from 'react';
import { FileText } from 'lucide-react';

import { Transaction, Budget } from '../types';
import { getFilteredBudgets } from '../helpers/budgets';
import TransactionRow from './TransactionRow';
import TransactionEditForm from './TransactionEditForm';
import TransactionAddForm from './TransactionAddForm';

type TransactionWithBudgetName = Transaction & { budgetName: string };

type AddFormState = {
  budgetId: number | null;
  description: string;
  amount: string;
  date: string;
};

type TransactionsListProps = {
  transactions: TransactionWithBudgetName[];
  budgets: Budget[];
  addForm: AddFormState;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  editingTransactionId: number | null;
  onSetEditingId: (id: number | null) => void;
  onDelete: (transaction: Transaction) => void;
  onUpdateTransaction?: (data: {
    id: number;
    budget_id: number | null;
    description: string;
    amount: number;
    date: string;
  }) => void;
};

function formatDate(dateString: string) {
  // Parse as local date so displayed date matches form input (YYYY-MM-DD)
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TransactionsList({
  transactions,
  budgets,
  addForm,
  onFormChange,
  onFormSubmit,
  editingTransactionId,
  onSetEditingId,
  onDelete,
  onUpdateTransaction,
}: TransactionsListProps) {
  const sorted = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;
    const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return createdB - createdA;
  });
  const filteredBudgetsForForm = getFilteredBudgets(budgets, addForm.date);

  return (
    <div className="bento-card bento-card-transactions">
      <div className="bento-card-header">
        <FileText className="bento-card-icon" strokeWidth={1.5} />
        <h3 className="bento-card-title">Transactions</h3>
      </div>
      <div className="bento-card-content">
        <div className="bento-transactions-list">
          <div className="bento-transactions-header">
            <span className="bento-transaction-col-date">Date</span>
            <span className="bento-transaction-col-budget">Budget</span>
            <span className="bento-transaction-col-description">Description</span>
            <span className="bento-transaction-col-amount">Amount</span>
            <span className="bento-transaction-col-actions"></span>
          </div>
          <TransactionAddForm
            form={addForm}
            filteredBudgets={filteredBudgetsForForm}
            onFormChange={onFormChange}
            onFormSubmit={onFormSubmit}
          />
          {sorted.length === 0 ? (
            <div className="bento-transactions-empty">
              <p>No transactions yet.</p>
            </div>
          ) : (
            sorted.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TransactionRow
                  transaction={transaction}
                  formatDate={formatDate}
                  isEditing={editingTransactionId === transaction.id}
                  onEdit={onUpdateTransaction ? () => onSetEditingId(transaction.id) : undefined}
                  onDelete={onDelete}
                />
                {editingTransactionId === transaction.id && onUpdateTransaction && (
                  <div className="bento-transaction-edit-row">
                    <TransactionEditForm
                      transaction={transaction}
                      budgets={budgets}
                      onSubmit={onUpdateTransaction}
                      onClose={() => onSetEditingId(null)}
                    />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
