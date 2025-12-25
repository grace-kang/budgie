import { useState } from 'react';

import AddIcon from '/icons/add.svg';
import { Budget, TransactionParams, Month } from '../types';
import { useMonths } from '../hooks/useMonths';

type Props = {
  budget: Budget;
  month?: Month;
  transaction?: {
    description?: string;
    amount?: number;
    date?: string;
  };
  errors?: string[]; // maps to transaction.errors.full_messages
  onSubmit: (data: TransactionParams) => void;
};

export default function TransactionForm({
  budget,
  month,
  transaction = {},
  errors = [],
  onSubmit,
}: Props) {
  const { data: months = [] } = useMonths();
  const [description, setDescription] = useState<string>(transaction.description ?? '');
  const [amount, setAmount] = useState<string>(
    transaction.amount != null ? String(transaction.amount) : '',
  );

  const defaultDate = new Date();
  const [date, setDate] = useState<string>(
    transaction.date ?? defaultDate.toISOString().slice(0, 10),
  );

  // Find month based on date
  const getMonthFromDate = (dateStr: string): Month | undefined => {
    const dateObj = new Date(dateStr);
    return months.find(
      (m) => m.month === dateObj.getMonth() + 1 && m.year === dateObj.getFullYear(),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMonth = month || getMonthFromDate(date);
    if (!selectedMonth) {
      // If no month found, we can't create the transaction
      return;
    }
    onSubmit({
      description,
      amount: Number(amount || 0),
      date,
      month_id: selectedMonth.id,
    });
    setDescription('');
    setAmount('');
    setDate(defaultDate.toISOString().slice(0, 10));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="transaction-row">
        <div className="form-input">
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-input">
          <input
            name="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-input">
          <input name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <input type="hidden" name="budget_id" value={String(budget.id)} />

        <div className="form-submit">
          <button type="submit">
            <img src={AddIcon} className="icon-button" alt="Submit" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="form-errors">
            {errors.map((msg, i) => (
              <span key={i}>{msg}</span>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
