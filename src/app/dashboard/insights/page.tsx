import { InsightsPanel } from '@/components/insights-panel';

export default function InsightsPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 py-4 sm:py-6 lg:py-8'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <h1 className='font-heading text-2xl font-semibold'>Financial Insights</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Real-time intelligence feed and spending analytics.
        </p>
      </div>
      <div className='px-4 sm:px-6 lg:px-8'>
        <InsightsPanel />
      </div>
    </div>
  );
}
