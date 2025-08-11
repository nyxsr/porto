import * as Icons from 'lucide-react';

export type SidebarItemBase = {
  id: string;
  title: string;
  icon?: keyof typeof Icons;
  path: string;
  isDisabled?: boolean;
  children?: SidebarItem[];
};

export type SidebarItem = SidebarItemBase | SidebarItemBase[];

export const SIDEBAR_ITEMS: SidebarItem[] = [
  [
    {
      id: 'new-chat',
      title: 'New Chat',
      icon: 'PenBox',
      path: '/dashboard',
    },
    {
      id: 'search-chat',
      title: 'Search Chat',
      icon: 'Search',
      path: '/search',
    },
  ],
  [
    {
      id: 'sahrul-project',
      title: 'My Project',
      path: '/projects',
      children: [],
    },
  ],
];
