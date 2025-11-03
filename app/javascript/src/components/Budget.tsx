import { useDeleteBudget } from '../hooks/useBudgets';
import { Budget } from '../types';
import EditIcon from '/icons/edit.svg';
import TrashIcon from '/icons/trash.svg';

export default function Budgets({ budget }: { budget: Budget }) {
  const deleteBudget = useDeleteBudget();

  const sum = budget.transactions?.reduce((s, t) => s + t.amount, 0);
  const percent = budget.total ? (sum / budget.total) * 100 : 0;
  const bgClass = percent > 100 ? 'budget-over' : percent > 80 ? 'budget-warn' : 'budget-ok';

  const onBudgetClick = () => (window.location.href = `/budgets/${budget.id}`);
  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/budgets/${budget.id}/edit`;
  };
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBudget.mutate(budget.id);
  };

  return (
    <div
      key={budget.id}
      className={`budget ${bgClass}`}
      onClick={onBudgetClick}
      role="button"
      tabIndex={0}
    >
      <span>{budget.name}</span>

      <div className="budget-total">
        <span>
          ${sum} / ${budget.total}
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
  );
}
