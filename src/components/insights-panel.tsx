'use client';

import * as React from 'react';
import { useFinanceStore } from '@/lib/store';
import type { Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp } from 'lucide-react';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const chartConfig = {
  income: { label: 'Income', color: 'var(--chart-2)' },
  expenses: { label: 'Expenses', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function InsightsPanel() {
  const { transactions } = useFinanceStore();

  // Compute analytics
  const analytics = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Highest spending category
    const categorySpending = new Map<string, number>();
    for (const t of transactions.filter((t) => t.type === 'expense')) {
      categorySpending.set(t.category, (categorySpending.get(t.category) || 0) + t.amount);
    }
    let highestCategory = { name: 'N/A', amount: 0 };
    for (const [name, amount] of categorySpending) {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    }

    // Monthly breakdown for chart
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData.has(key)) monthlyData.set(key, { income: 0, expenses: 0 });
      const entry = monthlyData.get(key)!;
      if (t.type === 'income') entry.income += t.amount;
      else entry.expenses += t.amount;
    }
    const monthlyChart = Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [y, m] = month.split('-');
        const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', {
          month: 'short',
        });
        return { month: label, income: data.income, expenses: data.expenses };
      });

    // Top 5 largest expenses
    const topExpenses = [...transactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Average monthly spending
    const monthCount = monthlyData.size || 1;
    const avgMonthlySpending = totalExpenses / monthCount;

    return {
      totalIncome,
      totalExpenses,
      savingsRate,
      highestCategory,
      monthlyChart,
      topExpenses,
      avgMonthlySpending,
    };
  }, [transactions]);

  return (
    <div className='flex flex-col gap-4'>
      {/* KPI Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='ghost-border bg-surface-container'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Net Savings Rate</CardTitle>
            <PiggyBank className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='mono-number text-2xl font-bold'>
              {analytics.savingsRate.toFixed(1)}%
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {analytics.savingsRate >= 20 ? (
                <span className='text-emerald-400'>
                  <TrendingUp className='mr-1 inline size-3' />
                  Healthy savings rate
                </span>
              ) : (
                <span className='text-amber-400'>
                  <AlertTriangle className='mr-1 inline size-3' />
                  Below recommended 20%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className='ghost-border bg-surface-container'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Highest Spending</CardTitle>
            <ArrowDownRight className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold'>{analytics.highestCategory.name}</div>
            <p className='mono-number text-muted-foreground mt-1 text-xs'>
              {formatCurrency(analytics.highestCategory.amount)} total
            </p>
          </CardContent>
        </Card>

        <Card className='ghost-border bg-surface-container'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Avg Monthly Spend</CardTitle>
            <ArrowDownRight className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='mono-number text-2xl font-bold'>
              {formatCurrency(analytics.avgMonthlySpending)}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Across {transactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className='ghost-border bg-surface-container'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Income vs Expenses</CardTitle>
            <ArrowUpRight className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline gap-2'>
              <span className='mono-number text-lg font-bold text-emerald-400'>
                {formatCurrency(analytics.totalIncome)}
              </span>
              <span className='text-muted-foreground text-xs'>vs</span>
              <span className='mono-number text-lg font-bold'>
                {formatCurrency(analytics.totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <Card className='ghost-border bg-surface-container'>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>Side-by-side comparison of monthly cash flows</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[300px] w-full'>
            <BarChart data={analytics.monthlyChart} barGap={4}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='month' tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='income' fill='var(--color-income)' radius={[4, 4, 0, 0]} />
              <Bar dataKey='expenses' fill='var(--color-expenses)' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Expenses */}
      <Card className='ghost-border bg-surface-container'>
        <CardHeader>
          <CardTitle>Top Expenses</CardTitle>
          <CardDescription>Largest individual expense transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3'>
            {analytics.topExpenses.map((tx, i) => (
              <div
                key={tx.id}
                className='bg-surface-container-low flex items-center justify-between rounded-lg px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  <span className='text-muted-foreground font-mono text-sm'>#{i + 1}</span>
                  <div>
                    <p className='text-sm font-medium'>{tx.description}</p>
                    <p className='text-muted-foreground text-xs'>
                      {tx.category} &middot;{' '}
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className='mono-number text-sm font-semibold'>
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
