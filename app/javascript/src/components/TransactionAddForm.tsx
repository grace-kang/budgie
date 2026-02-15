import React from 'react';
import { Plus } from 'lucide-react';

import { Budget } from '../types';

type TransactionForm = {
  budgetId: number | null;
  description: string;
  amount: string;
  date: string;
};

type TransactionAddFormProps = {
  form: TransactionForm;
  filteredBudgets: Budget[];
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
};

export default function TransactionAddForm({
  form,
  filteredBudgets,
  onFormChange,
  onFormSubmit,
}: TransactionAddFormProps) {
  return (
    <form
      className="bento-transaction-row bento-transaction-row-add"
      onSubmit={onFormSubmit}
    >
      <span className="bento-transaction-col-date">
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onFormChange}
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Date"
        />
      </span>
      <span className="bento-transaction-col-budget">
        <select
          name="budgetId"
          value={form.budgetId ?? ''}
          onChange={onFormChange}
          className="bento-form-input bento-form-input-inline"
          aria-label="Budget"
        >
          <option value="">No budget</option>
          {filteredBudgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </span>
      <span className="bento-transaction-col-description">
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={onFormChange}
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Description"
        />
      </span>
      <span className="bento-transaction-col-amount">
        <input
          name="amount"
          type="number"
          placeholder="0.00"
          value={form.amount}
          onChange={onFormChange}
          step="0.01"
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Amount"
        />
      </span>
      <span className="bento-transaction-col-actions">
        <button type="submit" className="bento-primary-btn bento-primary-btn-icon" aria-label="Add transaction">
          <Plus strokeWidth={1.5} size={18} />
        </button>
      </span>
    </form>
  );
}
