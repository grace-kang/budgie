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
  const createBudget = useCreateBudget(month.id);

  // Filter budgets for this specific month
  const monthBudgets = useMemo(() => {
    return allBudgets.filter((b) => b.month_id === month.id);
  }, [allBudgets, month.id]);

  const used = useMemo(() => {
    return month.transactions?.reduce((s, t) => s + Number(t.amount), 0) || 0;
  }, [month.transactions]);

  const limit = useMemo(() => {
    return monthBudgets.reduce((s, b) => s + Number(b.total), 0);
  }, [monthBudgets]);

  const noBudgetTransactions = useMemo(() => {
    return month.transactions?.filter((t) => !t.budget_id) || [];
  }, [month.transactions]);

  const noBudgetTotal = useMemo(() => {
    return noBudgetTransactions.reduce((s, t) => s + Number(t.amount), 0);
  }, [noBudgetTransactions]);

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

      {monthBudgets.map((budget) => (
        <Budget key={budget.id} month={month} budget={budget} />
      ))}

      {noBudgetTransactions.length > 0 && (
        <div className="budget budget-ok">
          <span>No budget</span>
          <div className="budget-total">
            <span>${round(noBudgetTotal)}</span>
          </div>
        </div>
      )}

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
