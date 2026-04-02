'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  CircleHelpIcon,
  LayoutDashboardIcon,
  LightbulbIcon,
  MoonIcon,
  ReceiptTextIcon,
  Settings2Icon,
  ShieldCheckIcon,
  SunIcon,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/lib/store';
import type { Role } from '@/types';

const navItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Transactions',
    url: '/dashboard/transactions',
    icon: ReceiptTextIcon,
  },
  {
    title: 'Insights',
    url: '/dashboard/insights',
    icon: LightbulbIcon,
  },
];

const secondaryItems = [
  {
    title: 'Settings',
    url: '#',
    icon: Settings2Icon,
  },
  {
    title: 'Help',
    url: '#',
    icon: CircleHelpIcon,
  },
];

const user = {
  name: 'Alexander Vance',
  email: 'alex@finance.io',
  avatar: '',
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:p-1.5!'>
              <Link href='/dashboard'>
                <div className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md'>
                  <span className='font-heading text-sm font-bold'>FI</span>
                </div>
                <div className='flex flex-col'>
                  <span className='font-heading text-sm font-semibold'>Finance Intelligence</span>
                  <span className='text-label text-muted-foreground text-[0.6rem]'>
                    Monolithic Observer
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className='mt-auto'>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Mobile-only controls — hidden on sm+ because header shows them there */}
      <SidebarGroup className='sm:hidden'>
        <SidebarGroupLabel className='flex items-center gap-1.5'>
          <ShieldCheckIcon className='size-3.5' />
          Preferences
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className='flex flex-col gap-2 px-2 pb-2'>
            {/* Role switcher */}
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className='h-8 w-full text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='viewer'>Viewer</SelectItem>
              </SelectContent>
            </Select>

            {/* Theme toggle */}
            <Button
              variant='outline'
              className='h-8 w-full justify-start gap-2 text-xs'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <SunIcon className='size-4' />
              ) : (
                <MoonIcon className='size-4' />
              )}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
