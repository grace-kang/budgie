import React, { useState } from 'react';

import CloseIcon from '/icons/close.svg';
import { Transaction, Budget } from '../types';

type Props = {
  transaction: Transaction;
  budgets: Budget[];
  onSubmit: (data: {
    id: number;
    budget_id: number;
    description: string;
    amount: number;
    date: string;
    // month_id not needed - backend derives it from date
  }) => void;
  onClose: () => void;
};

export default function TransactionEditForm({ transaction, budgets, onSubmit, onClose }: Props) {
  const [budgetId, setBudgetId] = useState<number>(transaction.budget_id);
  const [description, setDescription] = useState<string>(transaction.description);
  const [amount, setAmount] = useState<string>(String(transaction.amount));
  const [date, setDate] = useState<string>(transaction.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !budgetId) return;
    onSubmit({
      id: transaction.id,
      budget_id: budgetId,
      description,
      amount: Number(amount),
      date,
    });
    onClose();
  };

  return (
    <form className="transaction-row" onSubmit={handleSubmit}>
      <span className="transaction-cell">
        <select
          name="budgetId"
          value={budgetId}
          onChange={(e) => setBudgetId(Number(e.target.value))}
          required
        >
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </span>
      <span className="transaction-cell">
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          required
        />
      </span>
      <span className="transaction-cell">
        <input
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </span>
      <div className="transaction-actions">
        <div className="hidden-submit">
          <button type="submit"></button>
        </div>
        <button type="button" aria-label="Close" onClick={onClose}>
          <img src={CloseIcon} className="icon-button" alt="Close" />
        </button>
      </div>
    </form>
  );
}
