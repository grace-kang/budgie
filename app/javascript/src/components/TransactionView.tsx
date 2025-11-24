import React, { useState, useMemo } from 'react';

import TrashIcon from '/icons/trash.svg';

import { Budget, Transaction, TransactionParams } from '../types';
import { round } from '../helpers/money';
import {
  useAllTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions';
import { useMonths } from '../hooks/useMonths';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function TransactionView() {
  const { data: transactions = [] } = useAllTransactions();
  const { data: months = [] } = useMonths();

  const budgets = useMemo(() => {
    return months.flatMap((month) => month.budgets || []);
  }, [months]);

  const [form, setForm] = useState<{
    budgetId: number;
    description: string;
    amount: string;
    date: string;
  }>({
    budgetId: budgets[0]?.id ?? 0,
    description: '',
    amount: '',
    date: getTodayDate(),
  });

  const [createBudgetId, setCreateBudgetId] = useState<number>(budgets[0]?.id ?? 0);
  const createTransaction = useCreateTransaction(createBudgetId);
  const getDeleteTransaction = (budgetId: number) => useDeleteTransaction(budgetId);

  const transactionsWithBudget = transactions.map((t) => ({
    ...t,
    budgetName: budgets.find((b) => b.id === t.budget_id)?.name ?? 'Unknown',
  }));

  const sorted = [...transactionsWithBudget].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'budgetId' ? Number(value) : value,
    }));

    if (name === 'budgetId') {
      setCreateBudgetId(Number(value));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date || !form.budgetId) return;
    const params: TransactionParams = {
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
    };
    createTransaction.mutate(params, {
      onSuccess: () =>
        setForm({
          budgetId: budgets[0]?.id ?? 0,
          description: '',
          amount: '',
          date: getTodayDate(),
        }),
    });
  };

  const handleDelete = (transaction: Transaction) => {
    getDeleteTransaction(transaction.budget_id).mutate(transaction.id);
  };

  return (
    <div className="transaction-view">
      <div className="transactions">
        <div className="transactions-header transaction-row">
          <span>Budget</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Date</span>
          <span></span>
        </div>

        <form className="transaction-row" onSubmit={handleFormSubmit}>
          <span className="transaction-cell">
            <select name="budgetId" value={form.budgetId} onChange={handleFormChange} required>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </span>
          <span className="transaction-cell">
            <input
              name="description"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={handleFormChange}
              required
            />
          </span>
          <span className="transaction-cell">
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleFormChange}
              step="0.01"
              required
            />
          </span>
          <span className="transaction-cell">
            <input name="date" type="date" value={form.date} onChange={handleFormChange} required />
          </span>
          <span>
            <button type="submit">Add</button>
          </span>
        </form>

        {sorted.length === 0 ? (
          <div className="transaction-row transaction-empty">
            <span>No transactions yet. Add one above to get started!</span>
          </div>
        ) : (
          sorted.map((transaction) => (
            <div className="transaction-row" key={transaction.id}>
              <span className="transaction-cell transaction-budget">{transaction.budgetName}</span>
              <span className="transaction-cell">{transaction.description}</span>
              <span className="transaction-cell transaction-amount">
                ${round(transaction.amount)}
              </span>
              <span className="transaction-cell transaction-date">{transaction.date}</span>
              <div className="transaction-actions">
                <button onClick={() => handleDelete(transaction)} aria-label="Delete transaction">
                  <img className="icon-button" src={TrashIcon} alt="Delete" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
