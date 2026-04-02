'use client';

import * as React from 'react';
import { useFinanceStore } from '@/lib/store';
import type { Category, PaymentMethod, Transaction, TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const CATEGORIES: Category[] = [
  'Salary',
  'Freelance',
  'Food & Dining',
  'Travel',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Transport',
  'Housing',
  'Technology',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Card',
  'Wire',
  'ACH Transfer',
  'Direct Debit',
  'App',
  'Online',
  'Recurring',
  'Deposit',
];

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTransaction?: Transaction | null;
}

export function TransactionForm({ open, onOpenChange, editTransaction }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEditing = !!editTransaction;

  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState<Category>('Other');
  const [type, setType] = React.useState<TransactionType>('expense');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('Card');
  const [date, setDate] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(String(editTransaction.amount));
      setCategory(editTransaction.category);
      setType(editTransaction.type);
      setPaymentMethod(editTransaction.paymentMethod);
      setDate(editTransaction.date);
    } else {
      setDescription('');
      setAmount('');
      setCategory('Other');
      setType('expense');
      setPaymentMethod('Card');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [editTransaction, open]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Valid positive amount is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const txData = {
      description: description.trim(),
      amount: Number(Number(amount).toFixed(2)),
      category,
      type,
      paymentMethod,
      date,
    };

    if (isEditing && editTransaction) {
      updateTransaction(editTransaction.id, txData);
    } else {
      const newTx: Transaction = {
        ...txData,
        id: crypto.randomUUID(),
      };
      addTransaction(newTx);
    }

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modify the transaction details below.'
              : 'Fill in the details to record a new transaction.'}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-description'>Description</Label>
            <Input
              id='tx-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g. Monthly rent payment'
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className='text-destructive text-xs'>{errors.description}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-amount'>Amount ($)</Label>
            <Input
              id='tx-amount'
              type='number'
              step='0.01'
              min='0.01'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0.00'
              className='mono-number'
              aria-invalid={!!errors.amount}
            />
            {errors.amount && <p className='text-destructive text-xs'>{errors.amount}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-type'>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger id='tx-type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='income'>Income</SelectItem>
                <SelectItem value='expense'>Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-category'>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id='tx-category'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-payment'>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger id='tx-payment'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='tx-date'>Date</Label>
            <Input
              id='tx-date'
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={!!errors.date}
            />
            {errors.date && <p className='text-destructive text-xs'>{errors.date}</p>}
          </div>

          <div className='flex gap-3 pt-2'>
            <Button type='submit' className='flex-1'>
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </Button>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
