'use client';

// import { Columns2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PenBox } from 'lucide-react';

import { cn } from '@/lib/utils';

// import { useSidebarStore } from '@/store/sidebar.store';

import SocialMedias from '../_components/social-medias';

export default function Navbar() {
  const router = useRouter();
  // const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  // const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed);

  // const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const goToNewChat = () => {
    router.push('/');
  };

  return (
    <nav
      className={cn(
        'sticky top-0 left-0 flex items-center justify-between border-b border-b-[#303030] px-6 py-4',
        // !isCollapsed ? 'justify-end' : 'justify-between',
      )}
    >
      {/*{isCollapsed && (
        <Button
          onClick={toggleSidebar}
          variant='link'
          className='cursor-pointer opacity-50 hover:opacity-100'
        >
          <Columns2 className='size-4' />
        </Button>
      )}*/}
      <button
        aria-label='New Chat'
        onClick={goToNewChat}
        className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition-all hover:text-black'
      >
        <PenBox className='size-4' />
        New Chat
      </button>
      <SocialMedias />
    </nav>
  );
}
