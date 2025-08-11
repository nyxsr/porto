'use client';

import { useMemo, useState } from 'react';
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
  // lock in how many blobs we render (prevents remounts on palette changes)
  const [count] = useState(() => colors.length);

  // positions/sizes/speeds are deterministic and independent of palette
  const orbs: Orb[] = useMemo(() => {
    const list: Orb[] = [];
    for (let i = 0; i < count; i++) {
      const rng = mulberry32(ORB_SEED_BASE + i * 97);
      const size = seededRand(rng, 18, 34);
      list.push({
        size,
        topPct: seededRand(rng, 0, 60),
        leftPct: seededRand(rng, 0, 85),
        delay: seededRand(rng, 0, 5),
        duration: seededRand(rng, 10, 20),
        path: {
          x: [
            0,
            seededRand(rng, -140, 140),
            seededRand(rng, -80, 120),
            seededRand(rng, -160, 160),
            0,
          ],
          y: [
            0,
            seededRand(rng, -120, 120),
            seededRand(rng, -100, 140),
            seededRand(rng, -160, 120),
            0,
          ],
          scale: [
            1,
            1 + seededRand(rng, 0.05, 0.2),
            1 - seededRand(rng, 0.03, 0.12),
            1 + seededRand(rng, 0.04, 0.16),
            1,
          ],
          rotate: [
            0,
            seededRand(rng, -18, 18),
            seededRand(rng, -10, 10),
            seededRand(rng, -22, 22),
            0,
          ],
        },
      });
    }
    return list;
  }, [count]);

  return (
    <div className='pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto h-[60%] w-full'>
      <div className='relative h-full'>
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className='absolute rounded-full blur-3xl'
            style={{
              top: `${orb.topPct}%`,
              left: `${orb.leftPct}%`,
              width: `${orb.size}rem`,
              height: `${orb.size}rem`,
              opacity: 0.25,
            }}
            // ✨ Smoothly tween to the current palette color
            animate={{
              backgroundColor: colors[i % colors.length],
              x: orb.path.x,
              y: orb.path.y,
              scale: orb.path.scale,
              rotate: orb.path.rotate,
            }}
            transition={{
              // path animation
              duration: orb.duration,
              repeat: Infinity,
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
