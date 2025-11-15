import { useState } from 'react';
import { useDeleteBudget, useUpdateBudget } from '../hooks/useBudgets';
import { Budget } from '../types';
import BudgetForm from './BudgetForm';
import EditIcon from '/icons/edit.svg';
import TrashIcon from '/icons/trash.svg';
import { BudgetModal } from './BudgetModal';
import { round } from '../helpers/money';

export default function Budgets({ budget }: { budget: Budget }) {
  const [editing, setEditing] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  const deleteBudget = useDeleteBudget();
  const updateBudget = useUpdateBudget(budget.id);

  const sum = budget.transactions?.reduce((s, t) => s + Number(t.amount), 0);
  const percent = budget.total ? (sum / budget.total) * 100 : 0;
  const bgClass = percent > 100 ? 'budget-over' : percent > 80 ? 'budget-warn' : 'budget-ok';

  const onBudgetClick = () => setSelectedBudget(budget.id);
  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing((e) => !e);
  };
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBudget.mutate(budget.id);
  };

  return (
    <>
      <div
        key={budget.id}
        className={`budget ${bgClass} ${editing ? 'hide' : ''}`}
        onClick={onBudgetClick}
        role="button"
        tabIndex={0}
      >
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
          monthId={budget.id}
          onSubmit={(params) => updateBudget.mutate(params)}
          onClose={() => setEditing(false)}
        />
      </div>

      {selectedBudget && (
        <BudgetModal budgetId={selectedBudget} onClose={() => setSelectedBudget(null)} />
      )}
    </>
  );
}
