export default function TransactionsPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='px-4 lg:px-6'>
        <h1 className='font-heading text-2xl font-semibold'>Transactions</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Detailed logs of all fiscal activities across connected accounts.
        </p>
      </div>
    </div>
  );
}
