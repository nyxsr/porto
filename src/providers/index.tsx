'use client';

import * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import TransitionEffect from '@/app/(core)/transition-effect';

import { QueryProvider } from './query-provider';

type Provider = React.ComponentType<{ children: React.ReactNode }>;

/**
 * Composes multiple providers into a single provider component
 * @param providers Array of provider components
 * @returns A single provider component that combines all providers
 */
const composeProviders = (providers: Provider[]) => {
  return ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight((acc, CurrentProvider) => {
      return <CurrentProvider>{acc}</CurrentProvider>;
    }, children);
  };
};

const providers = [QueryProvider, TooltipProvider, TransitionEffect];

const AppProviders = composeProviders(providers);

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
