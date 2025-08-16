'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/assets';
import { ChevronRight, Columns2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { COMPANY_PROJECTS, CompanyIds } from '@/constants/company';
import { SIDEBAR_ITEMS, SidebarItem, SidebarItemBase } from '@/constants/sidebar';
import { useCompanyStore } from '@/store/company.store';
import { useSidebarStore } from '@/store/sidebar.store';
import { Button } from '@/components/ui/button';

function isSingleItem(item: SidebarItem): item is SidebarItemBase {
  return !Array.isArray(item);
}

function SidebarMenuItem({ item, level = 0 }: { item: SidebarItemBase; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = item.icon ? (Icons[item.icon] as React.ComponentType<{ className?: string }>) : null;
  const MotionIcon = Icon ? motion.create(Icon) : null;
  const hasChildren = item.children && item.children.length > 0;
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && !item.isDisabled) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Link
        aria-disabled={item.isDisabled}
        href={item.isDisabled || hasChildren ? '#' : item.path}
        onClick={handleClick}
        className={cn(
          'hover:bg-primary/10 mx-3 flex items-center rounded-md p-2 text-sm',
          level > 0 && 'ml-5',
          item.isDisabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <div className='flex flex-1 items-center'>
          {MotionIcon && (
            <MotionIcon
              initial={{ width: 18, height: 18 }}
              animate={{ width: 18, height: 18 }}
              exit={{ width: 18, height: 18 }}
            />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                className='ml-2'
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {hasChildren && !isCollapsed && (
          <motion.div
            className='ml-auto'
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className='size-4' />
          </motion.div>
        )}
      </Link>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            className='mt-1 overflow-hidden'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.2 },
            }}
          >
            {item.children!.map((child) => {
              if (Array.isArray(child)) {
                return child.map((subChild) => (
                  <SidebarMenuItem key={subChild.id} item={subChild} level={level + 1} />
                ));
              }
              return <SidebarMenuItem key={child.id} item={child} level={level + 1} />;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const company = useCompanyStore((state) => state.company);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed);

  const companyProjects = React.useMemo<SidebarItem[]>(
    () => (company ? (COMPANY_PROJECTS[company as CompanyIds] ?? []) : []),
    [company],
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      className='sidebar'
      initial={{ width: '4rem' }}
      animate={{ width: isCollapsed ? '4rem' : '15rem' }}
    >
      <span className='mb-4 flex items-center justify-between'>
        <Image alt='logo' src={Logo} height={60} width={60} />
        {!isCollapsed && (
          <Button
            onClick={toggleSidebar}
            variant='link'
            className='cursor-pointer opacity-50 hover:opacity-100'
          >
            <Columns2 className='size-5' />
          </Button>
        )}
      </span>

      {SIDEBAR_ITEMS.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <div key={`group-${index}`} className='mb-3'>
              {item.map((subItem) => {
                if (subItem.id === 'sahrul-project') {
                  const customSub: SidebarItemBase = {
                    id: 'sahrul-project',
                    title: 'My Project',
                    path: '/chat',
                    children: companyProjects,
                  };
                  return <SidebarMenuItem key={subItem.id} item={customSub} />;
                }
                return <SidebarMenuItem key={subItem.id} item={subItem} />;
              })}
            </div>
          );
        }

        if (isSingleItem(item)) {
          return (
            <div key={item.id} className='mb-3'>
              <SidebarMenuItem item={item} />
            </div>
          );
        }

        return null;
      })}
    </motion.aside>
  );
}
