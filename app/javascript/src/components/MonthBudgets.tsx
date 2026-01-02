import { useState, useMemo } from 'react';
import { useCreateBudget, useBudgets } from '../hooks/useBudgets';
import { Month } from '../types';
import Budget from './Budget';
import BudgetForm from './BudgetForm';
import AddIcon from '/icons/add.svg';
import TrashIcon from '/icons/trash.svg';
import { useDeleteMonth } from '../hooks/useMonths';
import { round } from '../helpers/money';

export default function MonthBudgets({ month }: { month: Month }) {
  const [showForm, setShowForm] = useState(false);

  const { data: allBudgets = [] } = useBudgets();
  const createBudget = useCreateBudget();
  const deleteMonth = useDeleteMonth(month.id);

  // Filter budgets that have transactions in this month
  const monthBudgets = useMemo(() => {
    return allBudgets.filter((budget) => budget.transactions?.some((t) => t.month_id === month.id));
  }, [allBudgets, month.id]);

  const used = useMemo(() => {
    return month.transactions?.reduce((s, t) => s + Number(t.amount), 0) || 0;
  }, [month.transactions]);

  const limit = useMemo(() => {
    return monthBudgets.reduce((s, b) => s + Number(b.total), 0);
  }, [monthBudgets]);

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
          ${round(used)} / ${round(limit)}
        </div>
        <div className="month-actions">
          <button type="button" onClick={() => deleteMonth.mutate()} aria-label="Delete month">
            <img src={TrashIcon} className="icon-button" alt="Delete Month" />
          </button>
        </div>
      </div>

      {monthBudgets.map((budget) => (
        <Budget key={budget.id} month={month} budget={budget} />
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
          onSubmit={(params) => createBudget.mutate(params)}
          onClose={() => setShowForm(false)}
        />
      </div>
    </div>
  );
}
