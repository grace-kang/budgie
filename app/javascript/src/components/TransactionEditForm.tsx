import React, { useState } from 'react';
import { Calendar, Tag, FileText, DollarSign, X } from 'lucide-react';

import { Transaction, Budget } from '../types';
import { useBudgetFilter } from '../hooks/useBudgetFilter';
import { getFilteredBudgets } from '../helpers/budgets';

type Props = {
  transaction: Transaction;
  budgets: Budget[];
  onSubmit: (data: {
    id: number;
    budget_id: number | null;
    description: string;
    amount: number;
    date: string;
    // month_id not needed - backend derives it from date
  }) => void;
  onClose: () => void;
};

export default function TransactionEditForm({ transaction, budgets, onSubmit, onClose }: Props) {
  const [budgetId, setBudgetId] = useState<number | null>(transaction.budget_id);
  const [description, setDescription] = useState<string>(transaction.description);
  const [amount, setAmount] = useState<string>(String(transaction.amount));
  const [date, setDate] = useState<string>(transaction.date);

  // Auto-select first budget if current selection is not in filtered list
  useBudgetFilter(date, budgets, budgetId, setBudgetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;
    onSubmit({
      id: transaction.id,
      budget_id: budgetId,
      description,
      amount: Number(amount),
      date,
    });
    onClose();
  };

  const filteredBudgets = getFilteredBudgets(budgets, date);

  return (
    <div className="bento-card-content">
      <div className="bento-card-header">
        <FileText className="bento-card-icon" strokeWidth={1.5} />
        <h3 className="bento-card-title">Edit Transaction</h3>
        <button
          type="button"
          onClick={onClose}
          className="bento-card-action-button"
          aria-label="Close"
        >
          <X strokeWidth={1.5} size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bento-card-content">
        <div className="bento-form-grid">
          <div className="bento-form-field">
            <label htmlFor="edit-date" className="bento-form-label">
              <Calendar className="bento-form-icon" strokeWidth={1.5} size={16} />
              Date
            </label>
            <input
              id="edit-date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bento-form-input"
              required
            />
          </div>
          <div className="bento-form-field">
            <label htmlFor="edit-budgetId" className="bento-form-label">
              <Tag className="bento-form-icon" strokeWidth={1.5} size={16} />
              Budget
            </label>
            <select
              id="edit-budgetId"
              name="budgetId"
              value={budgetId ?? ''}
              onChange={(e) => setBudgetId(e.target.value === '' ? null : Number(e.target.value))}
              className="bento-form-input"
            >
              <option value="">No budget</option>
              {filteredBudgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bento-form-field">
            <label htmlFor="edit-description" className="bento-form-label">
              <FileText className="bento-form-icon" strokeWidth={1.5} size={16} />
              Description
            </label>
            <input
              id="edit-description"
              name="description"
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bento-form-input"
              required
            />
          </div>
          <div className="bento-form-field">
            <label htmlFor="edit-amount" className="bento-form-label">
              <DollarSign className="bento-form-icon" strokeWidth={1.5} size={16} />
              Amount
            </label>
            <input
              id="edit-amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              className="bento-form-input"
              required
            />
          </div>
        </div>
        <div className="bento-form-actions">
          <button type="submit" className="bento-form-submit bento-form-submit-full">
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bento-form-submit bento-form-cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
