'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useFinanceStore } from '@/lib/store';
import type { Transaction } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { TransactionForm } from './transaction-form';

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Food & Dining',
  'Travel',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Transport',
  'Housing',
  'Technology',
  'Other',
] as const;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TransactionTable() {
  const { transactions, role, deleteTransaction, filters, setFilters, resetFilters } =
    useFinanceStore();
  const isAdmin = role === 'admin';

  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<Transaction | null>(null);

  // Sync store filters to column filters
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = [];
    if (filters.search) {
      newFilters.push({ id: 'description', value: filters.search });
    }
    if (filters.category !== 'all') {
      newFilters.push({ id: 'category', value: filters.category });
    }
    if (filters.type !== 'all') {
      newFilters.push({ id: 'type', value: filters.type });
    }
    setColumnFilters(newFilters);
  }, [filters]);

  // Date-filtered transactions
  const dateFilteredTransactions = React.useMemo(() => {
    if (filters.dateRange === 'all') return transactions;
    const now = new Date();
    const ms: Record<string, number> = {
      '7d': 7 * 86400000,
      '30d': 30 * 86400000,
      '90d': 90 * 86400000,
      '6m': 180 * 86400000,
      '1y': 365 * 86400000,
    };
    const cutoff = new Date(now.getTime() - (ms[filters.dateRange] || 0));
    return transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [transactions, filters.dateRange]);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className='ml-1 size-3.5' />
          </Button>
        ),
        cell: ({ row }) => (
          <span className='mono-number text-muted-foreground text-sm'>
            {formatDate(row.getValue('date'))}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className='font-medium'>{row.getValue('description')}</span>,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant='secondary' className='text-xs font-normal'>
            {row.getValue('category')}
          </Badge>
        ),
        filterFn: 'equals',
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return (
            <Badge variant={type === 'income' ? 'default' : 'outline'} className='text-xs'>
              {type === 'income' ? '↑ Income' : '↓ Expense'}
            </Badge>
          );
        },
        filterFn: 'equals',
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <ArrowUpDown className='ml-1 size-3.5' />
          </Button>
        ),
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <span
              className={`mono-number font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-foreground'}`}
            >
              {tx.type === 'income' ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </span>
          );
        },
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Method',
        cell: ({ row }) => (
          <span className='text-muted-foreground text-sm'>{row.getValue('paymentMethod')}</span>
        ),
      },
      ...(isAdmin
        ? [
            {
              id: 'actions',
              header: '',
              cell: ({ row }: { row: { original: Transaction } }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='size-8'>
                      <MoreHorizontal className='size-4' />
                      <span className='sr-only'>Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingTx(row.original);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className='mr-2 size-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-destructive focus:text-destructive'
                      onClick={() => deleteTransaction(row.original.id)}
                    >
                      <Trash2 className='mr-2 size-4' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            } satisfies ColumnDef<Transaction>,
          ]
        : []),
    ],
    [isAdmin, deleteTransaction],
  );

  const table = useReactTable({
    data: dateFilteredTransactions,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  function handleExportCSV() {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method'];
    const rows = dateFilteredTransactions.map((t) => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.paymentMethod,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className='flex flex-col gap-4'>
      {/* Toolbar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          <div className='relative max-w-xs flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
            <Input
              placeholder='Search transactions...'
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className='pl-8'
            />
          </div>
          <Select
            value={filters.category}
            onValueChange={(v) => setFilters({ category: v as typeof filters.category })}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.type}
            onValueChange={(v) => setFilters({ type: v as typeof filters.type })}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='income'>Income</SelectItem>
              <SelectItem value='expense'>Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.dateRange}
            onValueChange={(v) => setFilters({ dateRange: v as typeof filters.dateRange })}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Date Range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Time</SelectItem>
              <SelectItem value='7d'>Last 7 Days</SelectItem>
              <SelectItem value='30d'>Last 30 Days</SelectItem>
              <SelectItem value='90d'>Last 90 Days</SelectItem>
              <SelectItem value='6m'>Last 6 Months</SelectItem>
              <SelectItem value='1y'>Last Year</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant='ghost' size='sm' onClick={resetFilters} className='h-8 px-2'>
              <X className='mr-1 size-3.5' />
              Clear
            </Button>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {isAdmin && (
            <>
              <Button variant='outline' size='sm' onClick={handleExportCSV}>
                <Download className='mr-1.5 size-3.5' />
                Export CSV
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  setEditingTx(null);
                  setFormOpen(true);
                }}
              >
                <Plus className='mr-1.5 size-3.5' />
                Add Transaction
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='ghost-border bg-surface-container rounded-xl'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center gap-2'>
                    <Search className='size-8 opacity-40' />
                    <p>No transactions found.</p>
                    {hasActiveFilters && (
                      <Button variant='link' size='sm' onClick={resetFilters}>
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          {table.getFilteredRowModel().rows.length} transaction
          {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className='text-muted-foreground text-sm'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Form Sheet */}
      <TransactionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTx(null);
        }}
        editTransaction={editingTx}
      />
    </div>
  );
}
