import React, { useState } from 'react';
import { useCreateBudget } from '../hooks/useBudgets';

interface Props {
  monthId: number;
  initialBudget?: {
    name?: string;
    total?: number;
    errors?: string[];
  };
}

export default function BudgetForm({ monthId, initialBudget }: Props) {
  const [name, setName] = useState(initialBudget?.name ?? '');
  const [total, setTotal] = useState<number | ''>(initialBudget?.total ?? '');
  const createBudget = useCreateBudget(monthId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !total) return;
    createBudget.mutate({ name, total: Number(total) });
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
          <button type="submit">Create</button>
        </div>
      </div>
    </form>
  );
}
