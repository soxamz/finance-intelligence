import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ExpenditureHub } from '@/components/expenditure-hub';
import { SectionCards } from '@/components/section-cards';
import { StreamObservance } from '@/components/stream-observance';

export default function Page() {
  return (
    <div className='flex flex-col gap-4 py-4 sm:py-6 lg:py-8'>
      {/* Page heading */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <h2 className='text-label text-muted-foreground'>Portfolio / Overview</h2>
      </div>

      {/* Summary cards */}
      <SectionCards />

      {/* Charts row: trajectory + expenditure hub */}
      <div className='grid grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-5 lg:px-8'>
        <div className='flex flex-col lg:col-span-3'>
          <ChartAreaInteractive />
        </div>
        <div className='flex flex-col lg:col-span-2'>
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
