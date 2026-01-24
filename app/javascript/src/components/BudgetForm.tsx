import React, { useState, useEffect } from 'react';
import { X, Tag, DollarSign } from 'lucide-react';

interface Props {
  initialBudget?: {
    name?: string;
    total?: number;
  };
  onSubmit: (BudgetParams: any) => void;
  onClose: () => void;
}

export default function BudgetForm({ initialBudget, onSubmit, onClose }: Props) {
  const [name, setName] = useState(initialBudget?.name ?? '');
  const [total, setTotal] = useState<number | ''>(initialBudget?.total ?? '');

  // Update form state when initialBudget changes
  // Use primitive values as dependencies to avoid unnecessary re-renders
  useEffect(() => {
    if (initialBudget) {
      setName(initialBudget.name ?? '');
      setTotal(initialBudget.total ?? '');
    }
  }, [initialBudget?.name, initialBudget?.total]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !total) return;
    onSubmit({ name, total });
    // Only clear form if creating (no initialBudget), not when editing
    if (!initialBudget) {
      setName('');
      setTotal('');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bento-budget-form-content">
      <div className="bento-form-grid">
        <div className="bento-form-field">
          <label htmlFor="budget-name" className="bento-form-label">
            <Tag className="bento-form-icon" strokeWidth={1.5} size={16} />
            Name
          </label>
          <input
            id="budget-name"
            type="text"
            name="name"
            placeholder="Budget name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bento-form-input"
            required
          />
        </div>

        <div className="bento-form-field">
          <label htmlFor="budget-total" className="bento-form-label">
            <DollarSign className="bento-form-icon" strokeWidth={1.5} size={16} />
            Limit
          </label>
          <input
            id="budget-total"
            type="number"
            name="total"
            placeholder="0.00"
            value={total === '' ? '' : String(total)}
            onChange={(e) => setTotal(e.target.value === '' ? '' : Number(e.target.value))}
            className="bento-form-input"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="bento-form-actions">
        <button type="submit" className="bento-form-submit bento-form-submit-full">
          {initialBudget ? 'Update Budget' : 'Create Budget'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bento-form-submit bento-form-cancel-button"
          aria-label="Close"
        >
          <X strokeWidth={1.5} size={18} />
        </button>
      </div>
    </form>
  );
}
