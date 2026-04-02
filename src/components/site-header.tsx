'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BellIcon, MoonIcon, ShieldCheckIcon, SunIcon } from 'lucide-react';

import { useFinanceStore } from '@/lib/store';
import type { Role } from '@/types';

function getPageTitle(pathname: string) {
  if (pathname === '/dashboard') return 'Overview';
  if (pathname.includes('/transactions')) return 'Transactions';
  if (pathname.includes('/insights')) return 'Insights';
  return 'Dashboard';
}

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);

  const pageTitle = getPageTitle(pathname);

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 sm:px-6 lg:gap-2 lg:px-8'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />

        {/* Breadcrumb */}
        <div className='flex items-center gap-1.5 text-sm'>
          <span className='text-muted-foreground'>Pages</span>
          <span className='text-muted-foreground'>/</span>
          <span className='font-medium'>{pageTitle}</span>
        </div>

        {/* Right side actions */}
        <div className='ml-auto flex items-center gap-2'>
          {/* Role Switcher — hidden on mobile, visible sm+ */}
          <div className='hidden sm:block'>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className='h-8 w-27.5 text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='viewer'>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme Toggle — hidden on mobile, visible sm+ */}
          <Button
            variant='ghost'
            size='icon'
            className='hidden size-8 sm:inline-flex'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunIcon className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <MoonIcon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            <span className='sr-only'>Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant='ghost' size='icon' className='relative size-8'>
            <BellIcon className='size-4' />
            <span className='pulse-indicator absolute -top-0.5 -right-0.5' />
            <span className='sr-only'>Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
