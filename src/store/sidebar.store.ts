import { create } from 'zustand';

export type SidebarStoreType = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarStoreType>((set) => ({
  isCollapsed: false,
  setIsCollapsed: (value) => set({ isCollapsed: value }),
}));
