'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Balance trajectory data — monthly projected vs actual
const chartData = [
  { month: 'Aug', projected: 18200, actual: 17800 },
  { month: 'Sep', projected: 19100, actual: 19500 },
  { month: 'Oct', projected: 20000, actual: 19200 },
  { month: 'Nov', projected: 21200, actual: 21800 },
  { month: 'Dec', projected: 22400, actual: 23100 },
  { month: 'Jan', projected: 23800, actual: 24592 },
];

const chartConfig = {
  projected: {
    label: 'Projected',
    color: 'var(--chart-5)',
  },
  actual: {
    label: 'Actual',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('6m');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('3m');
    }
  }, [isMobile]);

  const filteredData = timeRange === '3m' ? chartData.slice(-3) : chartData;

  return (
    <Card className='ghost-border bg-surface-container @container/card'>
      <CardHeader>
        <div>
          <CardTitle className='font-heading text-lg'>Balance Trajectory</CardTitle>
          <CardDescription className='text-label mt-1'>H1 Performance Metrics</CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:px-4! @[540px]/card:flex'
          >
            <ToggleGroupItem value='6m'>6 months</ToggleGroupItem>
            <ToggleGroupItem value='3m'>3 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='flex w-32 @[540px]/card:hidden'
              size='sm'
              aria-label='Select time range'
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='6m'>6 months</SelectItem>
              <SelectItem value='3m'>3 months</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillProjected' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-projected)' stopOpacity={0.4} />
                <stop offset='95%' stopColor='var(--color-projected)' stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id='fillActual' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-actual)' stopOpacity={0.6} />
                <stop offset='95%' stopColor='var(--color-actual)' stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray='3 3' stroke='var(--border)' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className='text-label'
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => fmt(v)}
              width={60}
              className='text-label'
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  formatter={(value, name) => [fmt(Number(value)), String(name)]}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='projected'
              type='monotone'
              fill='url(#fillProjected)'
              stroke='var(--color-projected)'
              strokeDasharray='5 5'
              strokeWidth={2}
            />
            <Area
              dataKey='actual'
              type='monotone'
              fill='url(#fillActual)'
              stroke='var(--color-actual)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
