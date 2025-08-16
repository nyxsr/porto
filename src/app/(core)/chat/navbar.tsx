'use client';

import { Columns2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebar.store';
import { Button } from '@/components/ui/button';

import SocialMedias from '../_components/social-medias';

export default function Navbar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  return (
    <nav
      className={cn(
        'sticky top-0 left-0 flex items-center border-b border-b-[#303030] px-6 py-4',
        !isCollapsed ? 'justify-end' : 'justify-between',
      )}
    >
      {isCollapsed && (
        <Button
          onClick={toggleSidebar}
          variant='link'
          className='cursor-pointer opacity-50 hover:opacity-100'
        >
          <Columns2 className='size-4' />
        </Button>
      )}
      <SocialMedias />
    </nav>
  );
}
