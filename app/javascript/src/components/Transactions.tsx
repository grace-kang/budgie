import React from 'react';

import TrashIcon from '/icons/trash.svg';
import AddIcon from '/icons/add.svg';

import { Transaction, Budget } from '../types';
import { round } from '../helpers/money';

type TransactionsProps = {
  transactions: (Transaction & { budgetName: string })[];
  budgets: Budget[];
  form: {
    budgetId: number;
    description: string;
    amount: string;
    date: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onDelete: (transaction: Transaction) => void;
};

export default function Transactions({
  transactions,
  budgets,
  form,
  onFormChange,
  onFormSubmit,
  onDelete,
}: TransactionsProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="transaction-view">
      <div className="transactions">
        <div className="transactions-header transaction-row">
          <span>Budget</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Date</span>
          <span></span>
        </div>

        <form className="transaction-row" onSubmit={onFormSubmit}>
          <span className="transaction-cell">
            <select name="budgetId" value={form.budgetId} onChange={onFormChange} required>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </span>
          <span className="transaction-cell">
            <input
              name="description"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={onFormChange}
              required
            />
          </span>
          <span className="transaction-cell">
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={onFormChange}
              step="0.01"
              required
            />
          </span>
          <span className="transaction-cell">
            <input name="date" type="date" value={form.date} onChange={onFormChange} required />
          </span>
          <span>
            <button type="submit">
              <img src={AddIcon} className="icon-button" alt="Submit" />
            </button>
          </span>
        </form>

        {sorted.length === 0 ? (
          <div className="transaction-row transaction-empty">
            <span>No transactions yet. Add one above to get started!</span>
          </div>
        ) : (
          sorted.map((transaction) => (
            <div className="transaction-row" key={transaction.id}>
              <span className="transaction-cell transaction-budget">{transaction.budgetName}</span>
              <span className="transaction-cell">{transaction.description}</span>
              <span className="transaction-cell transaction-amount">
                ${round(transaction.amount)}
              </span>
              <span className="transaction-cell transaction-date">{transaction.date}</span>
              <div className="transaction-actions">
                <button onClick={() => onDelete(transaction)} aria-label="Delete transaction">
                  <img className="icon-button" src={TrashIcon} alt="Delete" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

