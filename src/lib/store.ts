'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Filters, Role, Transaction } from '@/types';
import { mockTransactions } from '@/constants/mock-data';

interface FinanceState {
  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Filters
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  dateRange: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      // Role
      role: 'admin',
      setRole: (role) => set({ role }),

      // Transactions
      transactions: mockTransactions,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Filters
      filters: defaultFilters,
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'finance-intelligence-store',
      partialize: (state) => ({
        role: state.role,
        transactions: state.transactions,
      }),
    },
  ),
);
