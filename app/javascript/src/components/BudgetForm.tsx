import React, { useState } from 'react';

import CloseIcon from '/icons/close.svg';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !total) return;
    onSubmit({ name, total });
    setName('');
    setTotal('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form">
        <div className="budget-name-input">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="budget-total-input">
          <input
            type="number"
            name="total"
            placeholder="Limit"
            value={total === '' ? '' : String(total)}
            onChange={(e) => setTotal(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        <div className="hidden-submit">
          <button type="submit"></button>
        </div>

        <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
          <img src={CloseIcon} alt="" />
        </button>
      </div>
    </form>
  );
}
