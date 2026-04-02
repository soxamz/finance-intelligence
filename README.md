# Finance Intelligence
<img width="1800" height="760" alt="all-devices-black" src="https://github.com/user-attachments/assets/3a6608c5-db4e-4757-8534-714cca3e2b95" />
A comprehensive personal finance dashboard built with Next.js 16, featuring transaction management, spending analytics, and role-based access control.

## Tech Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **UI:** shadcn/ui + Tailwind CSS 4 + Radix UI
- **State:** Zustand with localStorage persistence
- **Charts:** Recharts (Area, Pie, Bar)
- **Table:** TanStack React Table v8
- **Typography:** Sora + Space Grotesk + Geist Mono
- **Design System:** "Monolithic Observer" — dark obsidian theme with Electric Indigo accents

## Features

### Dashboard Overview (`/dashboard`)

- **Summary Cards** — Total Balance, Income, and Expenses computed from transactions with trend indicators
- **Balance Trajectory** — Projected vs actual balance area chart (toggleable 6m/3m)
- **Expenditure Hub** — Donut chart showing categorical spending breakdown
- **Stream Observance** — Live feed of recent transactions

### Transactions (`/dashboard/transactions`)

- Full data table with sorting (date, amount) and pagination (10 per page)
- Filter by search, category, type (income/expense), and date range
- **Admin only:** Add/Edit transaction via side sheet, Delete, Export CSV
- **Viewer:** Read-only table (no CRUD actions visible)
- Empty state with clear-filters prompt

### Financial Insights (`/dashboard/insights`)

- Net savings rate with health indicator
- Highest spending category identification
- Average monthly spending calculation
- Monthly income vs expenses bar chart
- Top 5 largest expense transactions

### RBAC (Role-Based Access Control)

- Toggle between **Admin** and **Viewer** roles via the header dropdown
- Admin: Full CRUD operations, CSV export, add/edit/delete transactions
- Viewer: Read-only access across all pages

### Design System

- Dark-first design with light mode variant
- Ghost borders (15% opacity), glassmorphism surfaces
- Surface hierarchy tokens (5 elevation levels)
- Pulse indicators and ambient shadows
- Responsive layout with sidebar navigation

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Format code
bun run format

# Lint
bun run lint
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens & theme
│   ├── layout.tsx           # Root layout with fonts & providers
│   ├── page.tsx             # Redirect to /dashboard
│   └── dashboard/
│       ├── layout.tsx       # Sidebar + header chrome
│       ├── page.tsx         # Overview composition
│       ├── transactions/    # Transaction table page
│       └── insights/        # Analytics page
├── components/
│   ├── app-sidebar.tsx      # Navigation sidebar
│   ├── site-header.tsx      # Breadcrumbs, role switcher, controls
│   ├── section-cards.tsx    # Summary KPI cards
│   ├── chart-area-interactive.tsx  # Balance trajectory chart
│   ├── expenditure-hub.tsx  # Spending donut chart
│   ├── stream-observance.tsx # Recent transactions feed
│   ├── transaction-table.tsx # Full transaction data table
│   ├── transaction-form.tsx  # Add/edit transaction sheet
│   ├── insights-panel.tsx   # Analytics dashboard
│   └── ui/                  # shadcn/ui primitives
├── constants/
│   └── mock-data.ts         # 42 realistic mock transactions
├── lib/
│   ├── store.ts             # Zustand store (role, transactions, filters)
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── hooks/
    └── use-mobile.ts        # Mobile detection hook
```
