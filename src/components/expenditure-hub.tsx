'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/lib/store';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

export function ExpenditureHub() {
  const transactions = useFinanceStore((s) => s.transactions);

  const { data, total } = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    for (const t of expenses) {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
    }

    const sorted = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

    // Group the rest into "Other"
    const topTotal = sorted.reduce((sum, [, v]) => sum + v, 0);
    const other = total - topTotal;

    const data = sorted.map(([name, value]) => ({ name, value }));
    if (other > 0) {
      data.push({ name: 'Other', value: other });
    }

    return { data, total };
  }, [transactions]);

  return (
    <Card className='ghost-border bg-surface-container'>
      <CardHeader>
        <CardTitle className='font-heading text-lg'>Expenditure Hub</CardTitle>
        <CardDescription className='text-label'>Categorical Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center gap-6 sm:flex-row'>
          {/* Donut chart */}
          <div className='relative h-[180px] w-[180px] shrink-0'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  cx='50%'
                  cy='50%'
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey='value'
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell key={data[index].name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <span className='mono-number text-muted-foreground text-xs'>{fmt(total)}</span>
              <span className='text-label text-muted-foreground text-[0.6rem]'>Total Out</span>
            </div>
          </div>

          {/* Legend */}
          <div className='flex flex-1 flex-col gap-3'>
            {data.map((item, index) => (
              <div key={item.name} className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <div
                    className='size-2.5 rounded-full'
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className='text-sm'>{item.name}</span>
                </div>
                <span className='mono-number text-muted-foreground text-sm'>{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
