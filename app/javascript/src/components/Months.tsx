import React, { useEffect } from 'react';

import AddIcon from '/icons/add.svg';

import MonthBudgets from './MonthBudgets';
import { useCreateMonth, useMonths } from '../hooks/useMonths';
import { useNavigate } from 'react-router-dom';

export default function Months() {
  const { data: months } = useMonths();
  const createMonth = useCreateMonth();

  if (!months?.length) return null;

  const sortedMonths = months.sort((a, b) => b.year - a.year || b.month - a.month);
  const first = sortedMonths[0];
  const last = sortedMonths[months.length - 1];

  const createNewer = (e: React.MouseEvent) => {
    e.preventDefault();
    createMonth.mutate({ month: first.month + 1, year: first.year });
  };

  const createOlder = (e: React.MouseEvent) => {
    e.preventDefault();
    createMonth.mutate({ month: last.month - 1, year: last.year });
  };

  return (
    <div className="months">
      <div className="create-month">
        <form className="new-month-form" onSubmit={(e) => e.preventDefault()}>
          <button type="button" onClick={createNewer} aria-label="Add month">
            <img src={AddIcon} className="icon-button" alt="Add" />
          </button>
        </form>
      </div>
      {sortedMonths.map((month) => (
        <MonthBudgets key={month.id} month={month} />
      ))}
      <div className="create-month">
        <form className="new-month-form" onSubmit={(e) => e.preventDefault()}>
          <button type="button" onClick={createOlder} aria-label="Add month">
            <img src={AddIcon} className="icon-button" alt="Add" />
          </button>
        </form>
      </div>
    </div>
  );
}
