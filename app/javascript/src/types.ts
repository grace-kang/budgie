export type Transaction = {
  id: number;
  budget_id: number;
  amount: number;
  description: string;
  date: string;
};

export type Budget = {
  id: number;
  name: string;
  total: number;
  transactions: Transaction[];
  month: Month;
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
};

export type TransactionParams = {
  description: string;
  amount: number;
  date: string;
};
