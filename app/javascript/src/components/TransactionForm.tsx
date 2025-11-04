import { useState } from 'react';

import AddIcon from '/icons/add.svg';
import { Budget, TransactionParams } from '../types';

type Props = {
  budget: Budget;
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
  transaction = {},
  errors = [],
  onSubmit,
}: Props) {
  const [description, setDescription] = useState<string>(transaction.description ?? '');
  const [amount, setAmount] = useState<string>(
    transaction.amount != null ? String(transaction.amount) : '',
  );
  const defaultDate =
    new Date().getMonth() + 1 == budget.month.month
      ? new Date()
      : new Date(budget.month.year, budget.month.month - 1, 1);
  const monthStart = new Date(budget.month.year, budget.month.month - 1, 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(budget.month.year, budget.month.month, 0).toISOString().slice(0, 10);

  const [date, setDate] = useState<string>(
    transaction.date ?? defaultDate.toISOString().slice(0, 10),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: Number(amount || 0),
      date,
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-input">
          <input
            name="date"
            type="date"
            min={monthStart}
            max={monthEnd}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
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
