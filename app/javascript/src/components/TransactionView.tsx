import React, { useState } from 'react';

import { Transaction, TransactionParams } from '../types';
import {
  useAllTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from '../hooks/useTransactions';
import { useMonths } from '../hooks/useMonths';
import { useBudgets } from '../hooks/useBudgets';
import Transactions from './Transactions';
import { getMonthFromDate } from '../helpers/date';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function TransactionView() {
  const { data: transactions = [] } = useAllTransactions();
  const { data: months = [] } = useMonths();
  const { data: budgets = [] } = useBudgets();

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
  const updateTransaction = useUpdateTransaction();

  const transactionsWithBudget = transactions.map((t) => ({
    ...t,
    budgetName: budgets.find((b) => b.id === t.budget_id)?.name ?? 'Unknown',
  }));

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
    const selectedMonth = getMonthFromDate(form.date, months);
    if (!selectedMonth) {
      // If no month found, we can't create the transaction
      return;
    }
    const params: TransactionParams = {
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
      month_id: selectedMonth.id,
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

  const handleUpdateTransaction = (data: {
    id: number;
    budget_id: number;
    description: string;
    amount: number;
    date: string;
    month_id: number;
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
