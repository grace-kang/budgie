export type Transaction = {
  id: number;
  budget_id: number | null;
  month_id: number;
  amount: number;
  description: string;
  date: string;
  created_at?: string;
};

export type Budget = {
  id: number;
  name: string;
  total: number;
  transactions: Transaction[];
  month_id: number;
  month: {
    id: number;
    month: number;
    year: number;
  };
};
export type Month = {
  id: number;
  year: number;
  month: number;
  transactions: Transaction[];
};

export type BudgetParams = {
  name: string;
  total: number;
};

export type TransactionParams = {
  description: string;
  amount: number;
  date: string;
  budget_id?: number | null;
};

export type PlaidAccount = {
  id: number;
  institution_name: string;
  item_id: string;
  last_successful_update: string | null;
};
