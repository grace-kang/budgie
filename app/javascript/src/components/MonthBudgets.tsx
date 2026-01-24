import { useState, useMemo } from 'react';
import { Calendar, Plus, Wallet } from 'lucide-react';
import { useCreateBudget, useBudgets } from '../hooks/useBudgets';
import { Month } from '../types';
import Budget from './Budget';
import BudgetForm from './BudgetForm';
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

  const monthName = new Date(month.year, month.month - 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bento-card bento-card-month" key={`${month.year}-${month.month}`}>
      <div className="bento-card-header">
        <Calendar className="bento-card-icon" strokeWidth={1.5} />
        <h3 className="bento-card-title">{monthName}</h3>
        <div className="bento-card-stat-value" style={{ fontSize: '1rem', marginLeft: 'auto' }}>
          ${round(used)} / ${round(limit)}
        </div>
      </div>

      <div className="bento-card-content">
        <div className="bento-budgets-list">
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
        </div>

        <div className={showForm ? 'hide' : 'bento-add-budget-button'}>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bento-add-budget-btn"
            aria-label="Add Budget"
          >
            <Plus strokeWidth={1.5} size={18} />
            Add Budget
          </button>
        </div>

        <div className={showForm ? 'bento-budget-form' : 'hide'}>
          <BudgetForm
            onSubmit={(params) => createBudget.mutate(params)}
            onClose={() => setShowForm(false)}
          />
        </div>
      </div>
    </div>
  );
}
