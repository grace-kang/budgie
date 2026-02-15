import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Tag, Edit, Trash2, MoreVertical } from 'lucide-react';

import { Transaction } from '../types';
import { round } from '../helpers/money';

type TransactionWithBudgetName = Transaction & { budgetName: string };

type TransactionRowProps = {
  transaction: TransactionWithBudgetName;
  formatDate: (dateString: string) => string;
  isEditing: boolean;
  onEdit?: () => void;
  onDelete: (transaction: Transaction) => void;
};

export default function TransactionRow({
  transaction,
  formatDate,
  isEditing,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleDelete = () => {
    onDelete(transaction);
    setDropdownOpen(false);
  };

  const handleEdit = () => {
    onEdit?.();
    setDropdownOpen(false);
  };

  return (
    <div
      className={`bento-transaction-row ${isEditing ? 'hide' : ''}`}
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
          ref={dropdownRef}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
            className="bento-transaction-action-button bento-transaction-more-button"
            aria-label="Show actions"
            aria-expanded={dropdownOpen}
          >
            <MoreVertical strokeWidth={1.5} size={18} />
          </button>
          {dropdownOpen && (
            <div className="bento-transaction-dropdown">
              {onEdit && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bento-transaction-dropdown-item"
                >
                  <Edit strokeWidth={1.5} size={16} />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
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
  );
}
