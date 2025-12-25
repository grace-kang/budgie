import React from 'react';

import TrashIcon from '/icons/trash.svg';

import { Budget, Transaction, TransactionParams, Month } from '../types';
import TransactionForm from './TransactionForm';
import { useCreateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { useMonths } from '../hooks/useMonths';
import { round } from '../helpers/money';

export default function Transactions({
  budget,
  transactions,
}: {
  budget: Budget;
  transactions: Transaction[];
}) {
  const { data: months = [] } = useMonths();
  const createTransaction = useCreateTransaction(budget.id);
  const deleteTransaction = useDeleteTransaction(budget.id);

  // Get month from first transaction if available, or find current month
  const getMonthForTransaction = (transactionDate: string): Month | undefined => {
    const dateObj = new Date(transactionDate);
    return months.find(
      (m) => m.month === dateObj.getMonth() + 1 && m.year === dateObj.getFullYear(),
    );
  };

  const defaultMonth =
    transactions.length > 0
      ? getMonthForTransaction(transactions[0].date)
      : months.find(
          (m) => m.month === new Date().getMonth() + 1 && m.year === new Date().getFullYear(),
        );

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleDelete = (id: number) => {
    deleteTransaction.mutate(id);
  };

  return (
    <div>
      <div className="transactions">
        <div className="transactions-header transaction-row">
          <span>Description</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        <TransactionForm
          budget={budget}
          month={defaultMonth}
          onSubmit={(data: TransactionParams) => createTransaction.mutate(data)}
        />

        {sorted.map((transaction) => (
          <div className="transaction-row" key={transaction.id}>
            <span className="transaction-cell">{transaction.description}</span>
            <span className="transaction-cell">${round(transaction.amount)}</span>
            <span className="transaction-cell">{transaction.date}</span>
            <button onClick={() => handleDelete(transaction.id)} aria-label="Delete transaction">
              <img className="icon-button" src={TrashIcon} alt=" Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
