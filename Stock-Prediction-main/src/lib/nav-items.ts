import {
  LayoutDashboard,
  Bot,
  History,
  PieChart,
  AreaChart,
  Star,
  Bell,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
}

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Signal Engine', href: '/signal-engine', icon: Bot },
  { title: 'Backtesting', href: '/backtesting', icon: History },
  { title: 'Portfolio Analytics', href: '/portfolio-analytics', icon: PieChart },
  { title: 'Market Data', href: '/market-data', icon: AreaChart },
  { title: 'Watchlist', href: '/watchlist', icon: Star },
  { title: 'Alerts', href: '/alerts', icon: Bell },
  { title: 'Settings', href: '/settings', icon: Settings },
];
