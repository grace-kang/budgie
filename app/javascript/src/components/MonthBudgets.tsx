import { useState, useMemo } from 'react';
import { useCreateBudget, useBudgets } from '../hooks/useBudgets';
import { Month } from '../types';
import Budget from './Budget';
import BudgetForm from './BudgetForm';
import AddIcon from '/icons/add.svg';
import { round } from '../helpers/money';

export default function MonthBudgets({ month }: { month: Month }) {
  const [showForm, setShowForm] = useState(false);

  const { data: allBudgets = [] } = useBudgets();
  const createBudget = useCreateBudget();

  const used = useMemo(() => {
    return month.transactions?.reduce((s, t) => s + Number(t.amount), 0) || 0;
  }, [month.transactions]);

  const limit = useMemo(() => {
    return allBudgets.reduce((s, b) => {
      // Get month-specific limit or fall back to budget total
      const customLimit = b.custom_budget_limits?.find((cbl) => cbl.month_id === month.id);
      const budgetLimit = customLimit ? customLimit.limit : b.total;
      return s + Number(budgetLimit);
    }, 0);
  }, [allBudgets, month.id]);

  return (
    <div className="month" key={`${month.year}-${month.month}`}>
      <div className="month-header">
        <h3 className="month-title">
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
      </div>

      {allBudgets.map((budget) => (
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
