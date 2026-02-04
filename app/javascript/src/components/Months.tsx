import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import MonthBudgets from './MonthBudgets';
import { useCreateMonth, useMonths } from '../hooks/useMonths';

export default function Months() {
  const { data: months } = useMonths();
  const createMonth = useCreateMonth();
  const [monthInput, setMonthInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  const sortedMonths = (months ?? []).slice().sort((a, b) => b.year - a.year || b.month - a.month);

  const handleAddMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthInput) return;
    const [yearStr, monthStr] = monthInput.split('-');
    const year = parseInt(yearStr!, 10);
    const month = parseInt(monthStr!, 10);
    if (!year || !month) return;
    createMonth.mutate(
      { year, month },
      {
        onSuccess: () => {
          setMonthInput('');
          setShowForm(false);
        },
      },
    );
  };

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const openForm = () => {
    setMonthInput(defaultMonth);
    setShowForm(true);
  };

  return (
    <div className="months-view">
      <div className="months-view-toolbar">
        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openForm())}
          className="bento-add-budget-btn months-add-month-btn"
          aria-label="Add month"
        >
          <CalendarPlus strokeWidth={1.5} size={18} />
          Add month
        </button>
        {showForm && (
          <form onSubmit={handleAddMonth} className="months-add-form">
            <input
              type="month"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              min="2020-01"
              max="2030-12"
              required
              className="months-add-input"
              autoFocus
            />
            <div className="months-add-form-actions">
              <button
                type="submit"
                className="bento-add-budget-btn"
                disabled={createMonth.isPending}
              >
                {createMonth.isPending ? 'Adding…' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bento-add-budget-btn months-add-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bento-grid">
        {sortedMonths.length === 0 && !showForm && (
          <p className="months-empty">Add a month above to get started.</p>
        )}
        {sortedMonths.map((month) => (
          <MonthBudgets key={month.id} month={month} />
        ))}
      </div>
    </div>
  );
}
