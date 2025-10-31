import React from 'react';

import AddIcon from '/icons/add.svg';

import Budget from './Budget';
import { Month } from '../api/Api';
import MonthBudgets from './MonthBudgets';

type Props = {
  months: Month[];
  onCreateMonth: (month: number, year: number) => void;
  onNavigateBudget: (budgetId: number) => void;
  onEditBudget: (budgetId: number) => void;
  onDeleteBudget: (budgetId: number) => void;
};

export default function Months({
  months,
  onCreateMonth,
  onNavigateBudget,
  onEditBudget,
  onDeleteBudget,
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
      {months.map((month) =>
        <MonthBudgets
          month={month}
          onNavigateBudget={onNavigateBudget}
          onDeleteBudget={onDeleteBudget}
          onEditBudget={onEditBudget}
        />
      )}
    </div>
  );
}
