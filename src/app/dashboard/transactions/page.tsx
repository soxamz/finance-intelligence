import { TransactionTable } from '@/components/transaction-table';

export default function TransactionsPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 py-4 sm:py-6 lg:py-8'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <h1 className='font-heading text-2xl font-semibold'>Transactions</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Detailed logs of all fiscal activities across connected accounts.
        </p>
      </div>
      <div className='px-4 sm:px-6 lg:px-8'>
        <TransactionTable />
      </div>
    </div>
  );
}
