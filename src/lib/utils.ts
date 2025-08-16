import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SidebarItem, SidebarItemBase } from '@/constants/sidebar';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashSeed(input: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function seededRand(rng: () => number, min: number, max: number) {
  return rng() * (max - min) + min;
}

type WithId = { id: string };

export function flattenChildren(children?: SidebarItem[]): SidebarItemBase[] {
  if (!children) return [];
  const out: SidebarItemBase[] = [];
  const stack: SidebarItem[] = [...children];
  while (stack.length) {
    const cur = stack.pop()!;
    if (Array.isArray(cur)) stack.push(...cur);
    else out.push(cur);
  }
  return out;
}

export function dedupeById<T extends WithId>(arr: T[]): T[] {
  return Array.from(new Map(arr.map((x) => [x.id, x])).values());
}

export const scrollToBottom = (containerRef: HTMLDivElement) => {
  containerRef.scrollTop = containerRef.scrollHeight;
};

export function weightedPick<T>(items: readonly T[], decay = 0.55): T {
  // weight[i] = e^(-i * decay) gives exponentially decreasing probability by index
  const weights = items.map((_, i) => Math.exp(-i * decay));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[0];
}
