'use client';

import React from 'react';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = React.useContext(LayoutRouterContext ?? {});
  const frozen = React.useRef(context).current;

  if (!frozen) {
    return <>{children}</>;
  }

  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function TransitionEffect({ children }: { children: React.ReactNode }) {
  const key = usePathname();
  return (
    <AnimatePresence mode='popLayout'>
      <motion.div
        key={key}
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
