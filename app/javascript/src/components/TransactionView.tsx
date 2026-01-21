import React, { useState } from 'react';

import { Transaction, TransactionParams } from '../types';
import {
  useAllTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useBudgetFilter } from '../hooks/useBudgetFilter';
import Transactions from './Transactions';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function TransactionView() {
  const { data: transactions = [] } = useAllTransactions();
  const { data: budgets = [] } = useBudgets();

  const [form, setForm] = useState<{
    budgetId: number | null;
    description: string;
    amount: string;
    date: string;
  }>({
    budgetId: null,
    description: '',
    amount: '',
    date: getTodayDate(),
  });

  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();

  const transactionsWithBudget = transactions.map((t) => ({
    ...t,
    budgetName: t.budget_id
      ? (budgets.find((b) => b.id === t.budget_id)?.name ?? 'Unknown')
      : 'No budget',
  }));

  // Auto-adjust budgetId when date or budgets change and current budget is not valid
  useBudgetFilter(form.date, budgets, form.budgetId, (updater) => {
    setForm((f) => {
      const newBudgetId = updater(f.budgetId);
      if (newBudgetId !== f.budgetId) {
        return { ...f, budgetId: newBudgetId };
      }
      return f;
    });
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'budgetId' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    const params: TransactionParams = {
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
      budget_id: form.budgetId ?? null,
    };
    createTransaction.mutate(params, {
      onSuccess: () =>
        setForm({
          budgetId: null,
          description: '',
          amount: '',
          date: getTodayDate(),
        }),
    });
  };

  const handleDelete = (transaction: Transaction) => {
    deleteTransaction.mutate({
      transactionId: transaction.id,
      budgetId: transaction.budget_id ?? null,
    });
  };

  const handleUpdateTransaction = (data: {
    id: number;
    budget_id: number | null;
    description: string;
    amount: number;
    date: string;
  }) => {
    updateTransaction.mutate(data);
  };

  return (
    <Transactions
      transactions={transactionsWithBudget}
      budgets={budgets}
      form={form}
      onFormChange={handleFormChange}
      onFormSubmit={handleFormSubmit}
      onDelete={handleDelete}
      onUpdateTransaction={handleUpdateTransaction}
    />
  );
}
