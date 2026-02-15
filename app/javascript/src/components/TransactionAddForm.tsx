import React, { useRef, useCallback } from 'react';
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

const FIELDS_COUNT = 4; // date, budget, description, amount

export default function TransactionAddForm({
  form,
  filteredBudgets,
  onFormChange,
  onFormSubmit,
}: TransactionAddFormProps) {
  const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (!e.altKey) return;
    if (e.key === 'ArrowRight' && index < FIELDS_COUNT - 1) {
      e.preventDefault();
      fieldRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      fieldRefs.current[index - 1]?.focus();
    }
  }, []);

  return (
    <form className="bento-transaction-row bento-transaction-row-add" onSubmit={onFormSubmit}>
      <span className="bento-transaction-col-date">
        <input
          ref={(el) => {
            fieldRefs.current[0] = el;
          }}
          name="date"
          type="date"
          value={form.date}
          onChange={onFormChange}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Date"
          autoFocus
        />
      </span>
      <span className="bento-transaction-col-budget">
        <select
          ref={(el) => {
            fieldRefs.current[1] = el;
          }}
          name="budgetId"
          value={form.budgetId ?? ''}
          onChange={onFormChange}
          onKeyDown={(e) => handleKeyDown(e, 1)}
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
          ref={(el) => {
            fieldRefs.current[2] = el;
          }}
          name="description"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={onFormChange}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Description"
        />
      </span>
      <span className="bento-transaction-col-amount">
        <input
          ref={(el) => {
            fieldRefs.current[3] = el;
          }}
          name="amount"
          type="number"
          placeholder="0.00"
          value={form.amount}
          onChange={onFormChange}
          onKeyDown={(e) => handleKeyDown(e, 3)}
          step="0.01"
          className="bento-form-input bento-form-input-inline"
          required
          aria-label="Amount"
        />
      </span>
      <span className="bento-transaction-col-actions">
        <button
          type="submit"
          className="bento-primary-btn bento-primary-btn-icon"
          aria-label="Add transaction"
        >
          <Plus strokeWidth={1.5} size={18} />
        </button>
      </span>
    </form>
  );
}
