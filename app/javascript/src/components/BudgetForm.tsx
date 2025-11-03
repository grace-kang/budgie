import React, { useState } from 'react';

import CloseIcon from '/icons/close.svg';

interface Props {
  monthId: number;
  initialBudget?: {
    name?: string;
    total?: number;
  };
  onSubmit: (BudgetParams: any) => void;
  onClose: () => void;
}

export default function BudgetForm({ monthId, initialBudget, onSubmit, onClose }: Props) {
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

        <input type="hidden" name="month_id" value={monthId} />

        <div className="hidden-submit">
          <button type="submit"></button>
        </div>

        <img src={CloseIcon} className="icon-button" alt="Close" onClick={onClose} />
      </div>
    </form>
  );
}
