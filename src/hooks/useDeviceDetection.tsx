import { useEffect, useState } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  isSlowDevice: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    prefersReducedMotion: false,
    isSlowDevice: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Check for slow devices (basic heuristic)
      const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
      const isSlowDevice = 
        isMobile || 
        navigator.hardwareConcurrency <= 4 ||
        (deviceMemory !== undefined && deviceMemory <= 4) ||
        navigator.connection?.effectiveType === 'slow-2g' ||
        navigator.connection?.effectiveType === '2g' ||
        navigator.connection?.effectiveType === '3g';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        prefersReducedMotion,
        isSlowDevice,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => checkDevice();
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkDevice);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return deviceInfo;
}

// Extended type for navigator.connection
interface NetworkInformation {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}