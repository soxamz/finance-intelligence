'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboardIcon,
  ReceiptTextIcon,
  LightbulbIcon,
  Settings2Icon,
  CircleHelpIcon,
} from 'lucide-react';

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
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
