import { useCreateBudget } from '../hooks/useBudgets';
import { BudgetParams, Month } from '../types';
import Budget from './Budget';
import CreateBudgetForm from './CreateBudgetForm';

export default function MonthBudgets({ month }: { month: Month }) {
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
        <Budget key={budget.id} budget={budget} />
      ))}

      <CreateBudgetForm monthId={month.id} />
    </div>
  );
}
