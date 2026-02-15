import React from 'react';
import { FileText } from 'lucide-react';

import { Transaction, Budget } from '../types';
import TransactionRow from './TransactionRow';
import TransactionEditForm from './TransactionEditForm';

type TransactionWithBudgetName = Transaction & { budgetName: string };

type TransactionsListProps = {
  transactions: TransactionWithBudgetName[];
  budgets: Budget[];
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
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TransactionsList({
  transactions,
  budgets,
  editingTransactionId,
  onSetEditingId,
  onDelete,
  onUpdateTransaction,
}: TransactionsListProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="bento-card bento-card-transactions">
      <div className="bento-card-header">
        <FileText className="bento-card-icon" strokeWidth={1.5} />
        <h3 className="bento-card-title">Transactions</h3>
      </div>
      <div className="bento-card-content">
        {sorted.length === 0 ? (
          <div className="bento-transactions-empty">
            <p>No transactions yet. Add one above to get started!</p>
          </div>
        ) : (
          <div className="bento-transactions-list">
            <div className="bento-transactions-header">
              <span className="bento-transaction-col-date">Date</span>
              <span className="bento-transaction-col-budget">Budget</span>
              <span className="bento-transaction-col-description">Description</span>
              <span className="bento-transaction-col-amount">Amount</span>
              <span className="bento-transaction-col-actions"></span>
            </div>
            {sorted.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TransactionRow
                  transaction={transaction}
                  formatDate={formatDate}
                  isEditing={editingTransactionId === transaction.id}
                  onEdit={
                    onUpdateTransaction
                      ? () => onSetEditingId(transaction.id)
                      : undefined
                  }
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
