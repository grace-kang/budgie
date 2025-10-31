import React from 'react';
import { Month } from './App';

import AddIcon from '/icons/add.svg';

import Budget from './Budget';

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

            {month.budgets?.map((budget) => (
              <Budget
                key={budget.id}
                budget={budget}
                onNavigateBudget={onNavigateBudget}
                onEditBudget={onEditBudget}
                onDeleteBudget={onDeleteBudget}
              />
            ))}

            {renderBudgetForm ? renderBudgetForm(month) : null}
          </div>
        );
      })}
    </div>
  );
}
