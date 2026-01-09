import MonthBudgets from './MonthBudgets';
import { useMonths } from '../hooks/useMonths';

export default function Months() {
  const { data: months } = useMonths();

  if (!months?.length) return null;

  const sortedMonths = months.sort((a, b) => b.year - a.year || b.month - a.month);

  return (
    <div className="months">
      {sortedMonths.map((month) => (
        <MonthBudgets key={month.id} month={month} />
      ))}
    </div>
  );
}
