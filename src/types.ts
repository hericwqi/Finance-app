export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  emoji: string;
  bg: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  method?: string;
}

export interface Budget {
  id: string;
  emoji: string;
  name: string;
  spent: number;
  limit: number;
}

export interface Bill {
  id: string;
  emoji: string;
  bg: string;
  name: string;
  amount: number;
  due: number;
  status: 'paid' | 'pending' | 'overdue';
  recur: string;
}

export interface UserProfile {
  name: string;
  monthlySalary: number;
  savingsGoal: number;
  spendingLimit: number;
  email: string;
  appearance: 'Claro' | 'Escuro' | 'Sistema';
  currency: string;
  notifications: boolean;
}

export interface AppState {
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
}
