export type Role = 'admin' | 'viewer';

export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Food & Dining'
  | 'Travel'
  | 'Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Transport'
  | 'Housing'
  | 'Technology'
  | 'Other';

export type PaymentMethod =
  | 'Card'
  | 'Wire'
  | 'ACH Transfer'
  | 'Direct Debit'
  | 'App'
  | 'Online'
  | 'Recurring'
  | 'Deposit';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  paymentMethod: PaymentMethod;
}

export interface Filters {
  search: string;
  category: Category | 'all';
  type: TransactionType | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | '6m' | '1y';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}
