import React from 'react';
import { Plus } from 'lucide-react';

type TransactionsToolbarProps = {
  showAddForm: boolean;
  onOpenAddForm: () => void;
  onCloseAddForm: () => void;
};

export default function TransactionsToolbar({
  showAddForm,
  onOpenAddForm,
  onCloseAddForm,
}: TransactionsToolbarProps) {
  return (
    <div className="transaction-view-toolbar">
      <button
        type="button"
        onClick={showAddForm ? onCloseAddForm : onOpenAddForm}
        className="bento-primary-btn"
        aria-label={showAddForm ? 'Cancel' : 'Add transaction'}
      >
        <Plus strokeWidth={1.5} size={18} />
        {showAddForm ? 'Cancel' : 'Add transaction'}
      </button>
    </div>
  );
}
