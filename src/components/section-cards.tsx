'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';
import { useFinanceStore } from '@/lib/store';
import { useMemo } from 'react';

export function SectionCards() {
  const transactions = useFinanceStore((s) => s.transactions);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    return { balance, income, expenses };
  }, [transactions]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3'>
      {/* Total Balance */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <CardDescription className='text-label flex items-center gap-2'>
            <WalletIcon className='size-3.5' />
            Total Balance
          </CardDescription>
          <CardTitle className='mono-number text-3xl font-semibold @[250px]/card:text-4xl'>
            {fmt(stats.balance)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline' className='border-success/30 text-success gap-1'>
              <TrendingUpIcon className='size-3' />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Total Income */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <CardDescription className='text-label flex items-center gap-2'>
            <ArrowUpIcon className='text-success size-3.5' />
            Total Income
          </CardDescription>
          <CardTitle className='mono-number text-success text-3xl font-semibold @[250px]/card:text-4xl'>
            {fmt(stats.income)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline' className='border-success/30 text-success gap-1'>
              <TrendingUpIcon className='size-3' />
              +5.2%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Total Expenses */}
      <Card className='ghost-border bg-surface-container @container/card'>
        <CardHeader>
          <CardDescription className='text-label flex items-center gap-2'>
            <ArrowDownIcon className='text-destructive size-3.5' />
            Total Expenses
          </CardDescription>
          <CardTitle className='mono-number text-destructive text-3xl font-semibold @[250px]/card:text-4xl'>
            {fmt(stats.expenses)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline' className='border-destructive/30 text-destructive gap-1'>
              <TrendingDownIcon className='size-3' />
              -2.1%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
