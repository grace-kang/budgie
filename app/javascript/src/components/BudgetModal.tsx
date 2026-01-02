import { getBudget } from '../hooks/useBudgets';
import Transactions from './Transactions';
import { Month } from '../types';

export function BudgetModal({
  month,
  budgetId,
  onClose,
}: {
  month: Month;
  budgetId: number;
  onClose: () => void;
}) {
  const { data: budget, isLoading, error } = getBudget(budgetId);

  if (isLoading) return <div className="modal">Loading...</div>;
  if (error) return <div className="modal">Error loading budget</div>;

  const transactions = budget?.transactions.filter((t) => t.month_id === month.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{budget?.name}</h2>
        <Transactions budget={budget!} transactions={transactions!} />
      </div>
    </div>
  );
}
