import React, { useEffect } from 'react';
import Months from './Months';
import { Api, Month } from '../api/Api';

export default function App() {
  const [months, setMonths] = React.useState<Month[]>([]);

  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  useEffect(() => {
    Api.getMonths().then((data) => setMonths(data));
  }, []);

  return (
    <div>
      <Months
        months={months}
        onCreateMonth={function (month: number, year: number): void {
          Api.createMonth(month, year).then((newMonth) =>
            setMonths((prevMonths) => [newMonth, ...prevMonths]),
          );
        }}
        onNavigateBudget={function (budgetId: number): void {
          window.location.href = `/budgets/${budgetId}`;
        }}
        onEditBudget={function (budgetId: number): void {
          window.location.href = `/budgets/${budgetId}/edit`;
        }}
        onDeleteBudget={function (budgetId: number): void {
          Api.deleteBudget(budgetId).then(() => {
            setMonths((prevMonths) =>
              prevMonths.map((month) => ({
                ...month,
                budgets: month.budgets.filter((b) => b.id !== budgetId),
              })),
            );
          });
        }}
      />
    </div>
  );
}
