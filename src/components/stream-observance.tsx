'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinanceStore } from '@/lib/store';
import {
  ShoppingBagIcon,
  BriefcaseIcon,
  PlaneIcon,
  UtensilsIcon,
  ArrowRightIcon,
} from 'lucide-react';
import type { Category } from '@/types';

const categoryIcons: Partial<Record<Category, React.ElementType>> = {
  Shopping: ShoppingBagIcon,
  'Food & Dining': UtensilsIcon,
  Travel: PlaneIcon,
  Salary: BriefcaseIcon,
  Freelance: BriefcaseIcon,
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

const fmtDate = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function StreamObservance() {
  const transactions = useFinanceStore((s) => s.transactions);

  const recent = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [transactions]);

  return (
    <Card className='ghost-border bg-surface-container'>
      <CardHeader>
        <div>
          <CardTitle className='font-heading text-lg'>Stream Observance</CardTitle>
          <CardDescription className='text-label'>Real-time Transactional Flow</CardDescription>
        </div>
        <Link
          href='/dashboard/transactions'
          className='text-primary flex items-center gap-1 text-xs hover:underline'
        >
          View Archive
          <ArrowRightIcon className='size-3' />
        </Link>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-1'>
          {recent.map((txn) => {
            const Icon = categoryIcons[txn.category] ?? ShoppingBagIcon;
            const isIncome = txn.type === 'income';

            return (
              <div
                key={txn.id}
                className='hover:bg-surface-container-high flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors'
              >
                <div className='bg-surface-container-highest flex size-9 shrink-0 items-center justify-center rounded-md'>
                  <Icon className='text-muted-foreground size-4' />
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <span className='truncate text-sm font-medium'>{txn.description}</span>
                  <span className='text-muted-foreground text-xs'>
                    {fmtDate(txn.date)} &middot; {txn.category}
                  </span>
                </div>
                <span
                  className={`mono-number shrink-0 text-sm font-medium ${isIncome ? 'text-success' : 'text-foreground'}`}
                >
                  {isIncome ? '+' : '-'}
                  {fmt(txn.amount)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live feed indicator */}
        <div className='mt-4 flex items-center justify-center gap-2'>
          <span className='pulse-indicator' />
          <Badge variant='outline' className='text-muted-foreground text-[0.65rem]'>
            Live Feed Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
