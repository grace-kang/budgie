export type Transaction = { amount: number };
export type Budget = {
  id: number;
  name: string;
  total: number;
  transactions: Transaction[];
};
export type Month = {
  year: number;
  month: number;
  budgets: Budget[];
};

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

export const Api = {
  async getMonths(): Promise<Month[]> {
    try {
      const res = await fetch('/months');
      if (!res.ok) throw new Error(`Failed to fetch months: ${res.status} ${res.statusText}`);
      return (await res.json()) as Month[];
    } catch (error) {
      console.error('Error fetching months:', error);
      throw error;
    }
  },
  async createMonth(month: number, year: number): Promise<Month> {
    try {
      const res = await fetch('/months', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({ month: { month, year } }),
      });
      if (!res.ok) throw new Error(`Failed to create month: ${res.status} ${res.statusText}`);
      return (await res.json()) as Month;
    } catch (error) {
      console.error('Error creating month:', error);
      throw error;
    }
  },
  async deleteBudget(budgetId: number): Promise<void> {
    try {
      const res = await fetch(`/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': token,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete budget: ${res.status} ${res.statusText}`);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
  async updateBudget(budgetId: number, data: { name?: string; total?: number }): Promise<Budget> {
    try {
      const res = await fetch(`/budgets/${budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({ budget: data }),
      });
      if (!res.ok) throw new Error(`Failed to edit budget: ${res.status} ${res.statusText}`);
      return (await res.json()) as Budget;
    } catch (error) {
      console.error('Error editing budget:', error);
      throw error;
    }
  },
};
