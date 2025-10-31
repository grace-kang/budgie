import React, { useEffect } from 'react';
import Months from './Months';

export type Transaction = { amount: number };
export type Budget = {
  id: number;
  name: string;
  total: number;
  transactions: Transaction[];
};
export type Month = {
  year: number;
  month: number; // 1..12
  budgets: Budget[];
};

export default function App() {
  const [months, setMonths] = React.useState<Month[]>([]);

  useEffect(() => {
    fetch('/months')
      .then((response) => response.json())
      .then((data: Month[]) => {
        setMonths(data);
      })
      .catch((error) => {
        console.error('Error fetching months data:', error);
      });
  }, []);

  return (
    <div>
      <Months
        months={months}
        onCreateMonth={function (month: number, year: number): void {
          throw new Error('Function not implemented.');
        }}
        onNavigateBudget={function (budgetId: number): void {
          throw new Error('Function not implemented.');
        }}
        onEditBudget={function (budgetId: number): void {
          throw new Error('Function not implemented.');
        }}
        onDeleteBudget={function (budgetId: number): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
}
