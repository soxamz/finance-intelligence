'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useFinanceStore } from '@/lib/store';

// Module-level formatter instance avoids recreating on every render
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
const fmt = (n: number) => currencyFormatter.format(n);

export function SectionCards() {
  const transactions = useFinanceStore((s) => s.transactions);

  const stats = useMemo(() => {
    // Single pass: js-combine-iterations
    let income = 0;
    let expenses = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    }
    return {
      balance: income - expenses,
      income,
      expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
  }, [transactions]);

  return (
    <div className='grid grid-cols-1 gap-4 px-4 sm:px-6 lg:px-8 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      {/* Total Balance */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <div className='flex items-center justify-between gap-2'>
            <CardDescription className='text-label flex items-center gap-2'>
              <WalletIcon className='size-3.5' />
              Total Balance
            </CardDescription>
            <Badge variant='outline' className='border-success/30 text-success shrink-0 gap-1'>
              <TrendingUpIcon className='size-3' />
              +12.5%
            </Badge>
          </div>
          <CardTitle className='mono-number text-2xl font-semibold @[200px]/card:text-3xl'>
            {fmt(stats.balance)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Total Income */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <div className='flex items-center justify-between gap-2'>
            <CardDescription className='text-label flex items-center gap-2'>
              <ArrowUpIcon className='text-success size-3.5' />
              Total Income
            </CardDescription>
            <Badge variant='outline' className='border-success/30 text-success shrink-0 gap-1'>
              <TrendingUpIcon className='size-3' />
              +5.2%
            </Badge>
          </div>
          <CardTitle className='mono-number text-success text-2xl font-semibold @[200px]/card:text-3xl'>
            {fmt(stats.income)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Total Expenses */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <div className='flex items-center justify-between gap-2'>
            <CardDescription className='text-label flex items-center gap-2'>
              <ArrowDownIcon className='text-destructive size-3.5' />
              Total Expenses
            </CardDescription>
            <Badge
              variant='outline'
              className='border-destructive/30 text-destructive shrink-0 gap-1'
            >
              <TrendingDownIcon className='size-3' />
              -2.1%
            </Badge>
          </div>
          <CardTitle className='mono-number text-destructive text-2xl font-semibold @[200px]/card:text-3xl'>
            {fmt(stats.expenses)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Savings Rate */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <div className='flex items-center justify-between gap-2'>
            <CardDescription className='text-label flex items-center gap-2'>
              <PiggyBankIcon className='text-primary size-3.5' />
              Savings Rate
            </CardDescription>
            <Badge
              variant='outline'
              className={cn(
                'shrink-0 gap-1',
                stats.savingsRate >= 20
                  ? 'border-success/30 text-success'
                  : 'border-warning/30 text-warning',
              )}
            >
              {stats.savingsRate >= 20 ? (
                <TrendingUpIcon className='size-3' />
              ) : (
                <TrendingDownIcon className='size-3' />
              )}
              {stats.savingsRate >= 20 ? 'On track' : 'Below 20%'}
            </Badge>
          </div>
          <CardTitle className='mono-number text-primary text-2xl font-semibold @[200px]/card:text-3xl'>
            {stats.savingsRate.toFixed(1)}%
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
