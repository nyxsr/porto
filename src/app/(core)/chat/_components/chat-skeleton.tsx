'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='space-y-4'>
          <div className='flex justify-end'>
            <div className='max-w-[70%] space-y-2'>
              <Skeleton className='h-4 w-32 bg-white/10' />
              <div className='rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4'>
                <Skeleton className='h-4 w-48 bg-white/20' />
                <Skeleton className='mt-2 h-4 w-40 bg-white/20' />
              </div>
            </div>
          </div>
          
          <div className='flex justify-start'>
            <div className='max-w-[70%] space-y-2'>
              <Skeleton className='h-4 w-24 bg-white/10' />
              <div className='rounded-2xl bg-white/5 p-4'>
                <Skeleton className='h-4 w-64 bg-white/10' />
                <Skeleton className='mt-2 h-4 w-56 bg-white/10' />
                <Skeleton className='mt-2 h-4 w-48 bg-white/10' />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className='flex items-center justify-center pt-8'>
        <div className='flex space-x-2'>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]'></div>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]'></div>
          <div className='h-2 w-2 animate-bounce rounded-full bg-white/40'></div>
        </div>
      </div>
    </div>
  );
}