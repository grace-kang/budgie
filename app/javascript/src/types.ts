export type Transaction = { amount: number };
export type Budget = {
  id: number;
  name: string;
  total: number;
  transactions: Transaction[];
};
export type Month = {
  id: number;
  year: number;
  month: number;
  budgets: Budget[];
};

export type BudgetParams = {
  name: string;
  total: number;
  month_id: number;
};
