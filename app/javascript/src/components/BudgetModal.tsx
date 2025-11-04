import { useQuery } from '@tanstack/react-query';
import { getBudget } from '../hooks/useBudgets';
import Transactions from './Transactions';

export function BudgetModal({ budgetId, onClose }: { budgetId: number; onClose: () => void }) {
  const { data: budget, isLoading, error } = getBudget(budgetId);

  if (isLoading) return <div className="modal">Loading...</div>;
  if (error) return <div className="modal">Error loading budget</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{budget?.name}</h2>
        <Transactions budget={budget!} transactions={budget!.transactions} />
      </div>
    </div>
  );
}
