'use client';

import React from 'react';
import { AlertCircle, RefreshCw, MessageSquareOff } from 'lucide-react';

interface ChatErrorProps {
  onRetry?: () => void;
}

export default function ChatError({ onRetry }: ChatErrorProps) {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='max-w-md space-y-6 text-center'>
        <div className='relative mx-auto w-fit'>
          <div className='absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl'></div>
          <div className='relative rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6'>
            <MessageSquareOff className='h-12 w-12 text-red-400' />
          </div>
        </div>
        
        <div className='space-y-2'>
          <h3 className='text-xl font-semibold text-white'>Unable to Load Conversation</h3>
          <p className='text-sm text-white/60'>
            Something went wrong while loading your chat history. This might be a temporary issue.
          </p>
        </div>
        
        <div className='space-y-3'>
          {onRetry && (
            <button
              onClick={onRetry}
              className='group inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20'
            >
              <RefreshCw className='h-4 w-4 transition-transform group-hover:rotate-180' />
              Try Again
            </button>
          )}
          
          <div className='flex items-center justify-center gap-2 text-xs text-white/40'>
            <AlertCircle className='h-3 w-3' />
            <span>If the problem persists, please refresh the page</span>
          </div>
        </div>
      </div>
    </div>
  );
}