import React from 'react';
import { Plus, Calendar, Tag, FileText, DollarSign } from 'lucide-react';

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
    <div className="bento-card bento-card-form">
      <div className="bento-card-header">
        <Plus className="bento-card-icon" strokeWidth={1.5} />
        <h3 className="bento-card-title">Add Transaction</h3>
      </div>
      <form className="bento-card-content" onSubmit={onFormSubmit}>
        <div className="bento-form-grid">
          <div className="bento-form-field">
            <label htmlFor="date" className="bento-form-label">
              <Calendar className="bento-form-icon" strokeWidth={1.5} size={16} />
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={onFormChange}
              className="bento-form-input"
              required
            />
          </div>
          <div className="bento-form-field">
            <label htmlFor="budgetId" className="bento-form-label">
              <Tag className="bento-form-icon" strokeWidth={1.5} size={16} />
              Budget
            </label>
            <select
              id="budgetId"
              name="budgetId"
              value={form.budgetId ?? ''}
              onChange={onFormChange}
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
            <label htmlFor="description" className="bento-form-label">
              <FileText className="bento-form-icon" strokeWidth={1.5} size={16} />
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Enter description"
              value={form.description}
              onChange={onFormChange}
              className="bento-form-input"
              required
            />
          </div>
          <div className="bento-form-field">
            <label htmlFor="amount" className="bento-form-label">
              <DollarSign className="bento-form-icon" strokeWidth={1.5} size={16} />
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={onFormChange}
              step="0.01"
              className="bento-form-input"
              required
            />
          </div>
        </div>
        <button type="submit" className="bento-primary-btn">
          <Plus strokeWidth={1.5} size={18} />
          Add Transaction
        </button>
      </form>
    </div>
  );
}
