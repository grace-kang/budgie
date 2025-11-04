import React from 'react';

import TrashIcon from '/icons/trash.svg';

import { Budget, Transaction, TransactionParams } from '../types';
import TransactionForm from './TransactionForm';
import { useCreateTransaction, useDeleteTransaction } from '../hooks/useTransactions';

export default function Transactions({
  budget,
  transactions,
}: {
  budget: Budget;
  transactions: Transaction[];
}) {
  const createTransaction = useCreateTransaction(budget.id);
  const deleteTransaction = useDeleteTransaction(budget.id);

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
          onSubmit={(data: TransactionParams) => createTransaction.mutate(data)}
        />

        {sorted.map((transaction) => (
          <div className="transaction-row" key={transaction.id}>
            <span className="transaction-cell">{transaction.description}</span>
            <span className="transaction-cell">${transaction.amount}</span>
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
