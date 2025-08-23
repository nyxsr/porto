'use client';

import { useEffect, useState } from 'react';

export default function BlurredMask() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`absolute top-0 left-0 z-20 h-screen w-screen ${
        isMobile ? 'backdrop-blur-md' : 'backdrop-blur-3xl'
      }`}
      style={{
        willChange: 'backdrop-filter',
        transform: 'translateZ(0)',
      }}
    />
  );
}
