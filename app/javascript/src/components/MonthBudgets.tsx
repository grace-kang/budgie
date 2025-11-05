import { useState } from 'react';
import { useCreateBudget } from '../hooks/useBudgets';
import { BudgetParams, Month } from '../types';
import Budget from './Budget';
import BudgetForm from './BudgetForm';
import AddIcon from '/icons/add.svg';
import TrashIcon from '/icons/trash.svg';
import { useDeleteMonth } from '../hooks/useMonths';

export default function MonthBudgets({ month }: { month: Month }) {
  const [showForm, setShowForm] = useState(false);

  const createBudget = useCreateBudget(month.id);
  const deleteMonth = useDeleteMonth(month.id);

  const used = month.budgets?.reduce(
    (s, b) => s + b.transactions.reduce((st, t) => st + t.amount, 0),
    0,
  );
  const limit = month.budgets?.reduce((s, b) => s + b.total, 0);

  return (
    <div className="month" key={`${month.year}-${month.month}`}>
      <div className="month-header">
        <h3>
          {new Date(month.year, month.month - 1)
            .toLocaleString(undefined, {
              month: 'long',
              year: 'numeric',
            })
            .toUpperCase()}
        </h3>
        <div className="month-total">
          <span>
            ${used} / ${limit}
          </span>
        </div>
        <div className="month-actions">
          <button type="button" onClick={() => deleteMonth.mutate()} aria-label="Delete month">
            <img src={TrashIcon} className="icon-button" alt="Delete Month" />
          </button>
        </div>
      </div>

      {month.budgets?.map((budget) => (
        <Budget key={budget.id} budget={budget} />
      ))}

      <div className={showForm ? 'hide' : 'create-budget-button show'}>
        <img
          src={AddIcon}
          className="icon-button"
          alt="Add Budget"
          onClick={() => setShowForm(true)}
        />
      </div>

      <div className={showForm ? 'show' : 'hide'}>
        <BudgetForm
          monthId={month.id}
          onSubmit={(params) => createBudget.mutate(params)}
          onClose={() => setShowForm(false)}
        />
      </div>
    </div>
  );
}
