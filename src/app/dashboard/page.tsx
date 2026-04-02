import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ExpenditureHub } from '@/components/expenditure-hub';
import { SectionCards } from '@/components/section-cards';
import { StreamObservance } from '@/components/stream-observance';

export default function Page() {
  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      {/* Page heading */}
      <div className='px-4 lg:px-6'>
        <h2 className='text-label text-muted-foreground'>Portfolio / Overview</h2>
      </div>

      {/* Summary cards */}
      <SectionCards />

      {/* Charts row: trajectory + expenditure hub */}
      <div className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-5 lg:px-6'>
        <div className='lg:col-span-3'>
          <ChartAreaInteractive />
        </div>
        <div className='lg:col-span-2'>
          <ExpenditureHub />
        </div>
      </div>

      {/* Recent transactions feed */}
      <div className='px-4 lg:px-6'>
        <StreamObservance />
      </div>
    </div>
  );
}
