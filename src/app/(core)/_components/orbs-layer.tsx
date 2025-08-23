'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import { hashSeed, mulberry32, seededRand } from '@/lib/utils';

type Orb = {
  size: number; // rem
  topPct: number;
  leftPct: number;
  delay: number;
  duration: number;
  path: {
    x: number[];
    y: number[];
    scale: number[];
    rotate: number[];
  };
};

const ORB_SEED_BASE = hashSeed('orbs-v1');

export default function OrbsLayer({ colors }: { colors: string[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    checkMobile();
    checkMotion();
    
    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkMotion);
    };
  }, []);
  
  // Reduce orb count on mobile for better performance
  const [count] = useState(() => colors.length);

  // positions/sizes/speeds are deterministic and independent of palette
  const orbs: Orb[] = useMemo(() => {
    const list: Orb[] = [];
    // Render fewer orbs on mobile
    const effectiveCount = isMobile ? Math.min(3, count) : count;
    
    for (let i = 0; i < effectiveCount; i++) {
      const rng = mulberry32(ORB_SEED_BASE + i * 97);
      // Smaller orbs on mobile
      const size = isMobile ? seededRand(rng, 12, 20) : seededRand(rng, 18, 34);
      
      // Reduced motion range on mobile
      const motionScale = isMobile ? 0.5 : 1;
      
      list.push({
        size,
        topPct: seededRand(rng, 0, 60),
        leftPct: seededRand(rng, 0, 85),
        delay: seededRand(rng, 0, 5),
        duration: seededRand(rng, 15, 25), // Slower animations for better performance
        path: {
          x: [
            0,
            seededRand(rng, -140, 140) * motionScale,
            seededRand(rng, -80, 120) * motionScale,
            seededRand(rng, -160, 160) * motionScale,
            0,
          ],
          y: [
            0,
            seededRand(rng, -120, 120) * motionScale,
            seededRand(rng, -100, 140) * motionScale,
            seededRand(rng, -160, 120) * motionScale,
            0,
          ],
          scale: [
            1,
            1 + seededRand(rng, 0.05, 0.2) * motionScale,
            1 - seededRand(rng, 0.03, 0.12) * motionScale,
            1 + seededRand(rng, 0.04, 0.16) * motionScale,
            1,
          ],
          rotate: prefersReducedMotion ? [0, 0, 0, 0, 0] : [
            0,
            seededRand(rng, -18, 18) * motionScale,
            seededRand(rng, -10, 10) * motionScale,
            seededRand(rng, -22, 22) * motionScale,
            0,
          ],
        },
      });
    }
    return list;
  }, [count, isMobile, prefersReducedMotion]);

  return (
    <div className='pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto h-[60%] w-full'>
      <div className='relative h-full' style={{ contain: 'layout style paint' }}>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isMobile ? 'blur-2xl' : 'blur-3xl'}`}
            style={{
              top: `${orb.topPct}%`,
              left: `${orb.leftPct}%`,
              width: `${orb.size}rem`,
              height: `${orb.size}rem`,
              opacity: isMobile ? 0.15 : 0.25,
              willChange: prefersReducedMotion ? 'auto' : 'transform',
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
            // ✨ Smoothly tween to the current palette color
            animate={prefersReducedMotion ? {
              backgroundColor: colors[i % colors.length],
            } : {
              backgroundColor: colors[i % colors.length],
              x: orb.path.x,
              y: orb.path.y,
              scale: orb.path.scale,
              rotate: orb.path.rotate,
            }}
            transition={{
              // path animation
              duration: orb.duration,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
              times: [0, 0.25, 0.5, 0.75, 1],
              // color crossfade
              backgroundColor: { duration: 0.8, ease: 'easeInOut' },
            }}
          />
        ))}
      </div>
    </div>
  );
}
