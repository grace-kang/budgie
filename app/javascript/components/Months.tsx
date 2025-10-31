import React from 'react';
import { Month } from './App';

import AddIcon from '/icons/add.svg';
import EditIcon from '/icons/edit.svg';
import TrashIcon from '/icons/trash.svg';

type Props = {
  months: Month[];
  onCreateMonth: (month: number, year: number) => void;
  onNavigateBudget: (budgetId: number) => void;
  onEditBudget: (budgetId: number) => void;
  onDeleteBudget: (budgetId: number) => void;
  renderBudgetForm?: (month: Month) => React.ReactNode;
};

export default function Months({
  months,
  onCreateMonth,
  onNavigateBudget,
  onEditBudget,
  onDeleteBudget,
  renderBudgetForm,
}: Props) {
  if (!months || months.length === 0) return null;

  const first = months[0];
  const firstDate = new Date(first.year, first.month - 1, 1);
  const nextDate = new Date(firstDate);
  nextDate.setMonth(firstDate.getMonth() + 1);
  const nextMonthNum = nextDate.getMonth() + 1;
  const nextYearNum = nextDate.getFullYear();

  const handleCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    onCreateMonth(nextMonthNum, nextYearNum);
  };

  return (
    <div className="budgets">
      <div className="create-month">
        <form className="new-month-form" onSubmit={(e) => e.preventDefault()}>
          <button type="button" onClick={handleCreate} aria-label="Add month">
            <img src={AddIcon} className="icon-button" alt="Add" />
          </button>
        </form>
      </div>

      {months.map((month) => {
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
              <span>
                ${used} / ${limit}
              </span>
            </div>

            {month.budgets?.map((budget) => {
              const sum = budget.transactions?.reduce((s, t) => s + t.amount, 0);
              const percent = budget.total ? (sum / budget.total) * 100 : 0;
              const bgClass =
                percent > 100 ? 'budget-over' : percent > 80 ? 'budget-warn' : 'budget-ok';

              const onBudgetClick = () => onNavigateBudget(budget.id);
              const onEditClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                onEditBudget(budget.id);
              };
              const onDeleteClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (confirm('Are you sure?')) {
                  onDeleteBudget(budget.id);
                }
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
            })}

            {renderBudgetForm ? renderBudgetForm(month) : null}
          </div>
        );
      })}
    </div>
  );
}
