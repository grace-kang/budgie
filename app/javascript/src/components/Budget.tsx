import { useState, useMemo } from 'react';
import { useDeleteBudget, useUpdateBudget } from '../hooks/useBudgets';
import { Budget, Month } from '../types';
import BudgetForm from './BudgetForm';
import EditIcon from '/icons/edit.svg';
import TrashIcon from '/icons/trash.svg';
import { round } from '../helpers/money';

export default function Budgets({ month, budget }: { month: Month; budget: Budget }) {
  const [editing, setEditing] = useState(false);

  const deleteBudget = useDeleteBudget();
  const updateBudget = useUpdateBudget(budget.id);

  // Memoize initialBudget to prevent unnecessary re-renders
  const initialBudget = useMemo(
    () => ({ name: budget.name, total: budget.total }),
    [budget.name, budget.total],
  );

  const sum =
    month.transactions
      ?.filter((t) => t.budget_id === budget.id)
      .reduce((s, t) => s + Number(t.amount), 0) || 0;
  const percent = budget.total ? (sum / budget.total) * 100 : 0;
  const bgClass = percent > 100 ? 'budget-over' : percent > 80 ? 'budget-warn' : 'budget-ok';

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing((e) => !e);
  };
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBudget.mutate(budget.id);
  };

  const handleBudgetUpdate = (params: { name: string; total: number }) => {
    const nameChanged = params.name !== budget.name;
    const totalChanged = params.total !== budget.total;

    if (!nameChanged && !totalChanged) {
      // Nothing changed
      setEditing(false);
      return;
    }

    updateBudget.mutate(params, {
      onSuccess: () => setEditing(false),
    });
  };

  return (
    <>
      <div key={budget.id} className={`budget ${bgClass} ${editing ? 'hide' : ''}`}>
        <span>{budget.name}</span>

        <div className="budget-total">
          <span>
            ${round(sum)} / ${round(budget.total)}
          </span>
        </div>

        <div className="budget-actions" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={onEditClick} aria-label="Edit budget">
            <img src={EditIcon} className="icon-button" alt="Edit" />
          </button>

          <button type="button" onClick={onDeleteClick} aria-label="Delete budget">
            <img src={TrashIcon} className="icon-button" alt="Delete" />
          </button>
        </div>
      </div>

      <div className={editing ? 'show' : 'hide'}>
        <BudgetForm
          initialBudget={initialBudget}
          onSubmit={handleBudgetUpdate}
          onClose={() => setEditing(false)}
        />
      </div>
    </>
  );
}
