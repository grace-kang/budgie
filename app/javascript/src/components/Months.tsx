import React from 'react';

import AddIcon from '/icons/add.svg';

import MonthBudgets from './MonthBudgets';
import { useCreateMonth, useMonths } from '../hooks/useMonths';

export default function Months() {
  const { data: months, isLoading, error } = useMonths();
  const createMonth = useCreateMonth();

  if (!months || months.length === 0) return null;

  const first = months[0];
  const firstDate = new Date(first.year, first.month - 1, 1);
  const nextDate = new Date(firstDate);
  nextDate.setMonth(firstDate.getMonth() + 1);
  const nextMonthNum = nextDate.getMonth() + 1;
  const nextYearNum = nextDate.getFullYear();

  const handleCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    createMonth.mutate({ month: nextMonthNum, year: nextYearNum });
  };

  return (
    <div className="months">
      <div className="create-month">
        <form className="new-month-form" onSubmit={(e) => e.preventDefault()}>
          <button type="button" onClick={handleCreate} aria-label="Add month">
            <img src={AddIcon} className="icon-button" alt="Add" />
          </button>
        </form>
      </div>
      {months.map((month) => (
        <MonthBudgets key={month.id} month={month} />
      ))}
    </div>
  );
}
