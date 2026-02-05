import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, Tag, FileText, DollarSign, Edit, Trash2, MoreVertical } from 'lucide-react';

import { Transaction, Budget } from '../types';
import { round } from '../helpers/money';
import { getFilteredBudgets } from '../helpers/budgets';
import TransactionEditForm from './TransactionEditForm';
import TransactionStats from './TransactionStats';

type TransactionsProps = {
  transactions: (Transaction & { budgetName: string })[];
  budgets: Budget[];
  form: {
    budgetId: number | null;
    description: string;
    amount: string;
    date: string;
  };
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
  onFormChange,
  onFormSubmit,
  onDelete,
  onUpdateTransaction,
}: TransactionsProps) {
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);
  const [dropdownOpenRowId, setDropdownOpenRowId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dropdownOpenRowId === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setDropdownOpenRowId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpenRowId]);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const filteredBudgetsForForm = getFilteredBudgets(budgets, form.date);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="transaction-view">
      <div className="bento-grid">
        <TransactionStats transactions={transactions} />

        {/* Add Transaction Form Card */}
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
                  {filteredBudgetsForForm.map((b) => (
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
            <button type="submit" className="bento-form-submit">
              <Plus strokeWidth={1.5} size={18} />
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List Card */}
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
                    <div
                      className={`bento-transaction-row ${
                        editingTransactionId === transaction.id ? 'hide' : ''
                      }`}
                    >
                      <span className="bento-transaction-col-date">
                        <Calendar
                          className="bento-transaction-row-icon"
                          strokeWidth={1.5}
                          size={14}
                        />
                        {formatDate(transaction.date)}
                      </span>
                      <span className="bento-transaction-col-budget">
                        <Tag className="bento-transaction-row-icon" strokeWidth={1.5} size={14} />
                        {transaction.budgetName}
                      </span>
                      <span className="bento-transaction-col-description">
                        {transaction.description}
                      </span>
                      <span className="bento-transaction-col-amount">
                        ${round(transaction.amount)}
                      </span>
                      <span className="bento-transaction-col-actions">
                        <div
                          className="bento-transaction-actions-wrap"
                          ref={dropdownOpenRowId === transaction.id ? dropdownRef : null}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpenRowId((prev) => (prev === transaction.id ? null : transaction.id));
                            }}
                            className="bento-transaction-action-button bento-transaction-more-button"
                            aria-label="Show actions"
                            aria-expanded={dropdownOpenRowId === transaction.id}
                          >
                            <MoreVertical strokeWidth={1.5} size={18} />
                          </button>
                          {dropdownOpenRowId === transaction.id && (
                            <div className="bento-transaction-dropdown">
                              {onUpdateTransaction && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTransactionId(transaction.id);
                                    setDropdownOpenRowId(null);
                                  }}
                                  className="bento-transaction-dropdown-item"
                                >
                                  <Edit strokeWidth={1.5} size={16} />
                                  Edit
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  onDelete(transaction);
                                  setDropdownOpenRowId(null);
                                }}
                                className="bento-transaction-dropdown-item bento-transaction-dropdown-item-danger"
                              >
                                <Trash2 strokeWidth={1.5} size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </span>
                    </div>

                    {editingTransactionId === transaction.id && onUpdateTransaction && (
                      <div className="bento-transaction-edit-row">
                        <TransactionEditForm
                          transaction={transaction}
                          budgets={budgets}
                          onSubmit={onUpdateTransaction}
                          onClose={() => setEditingTransactionId(null)}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
