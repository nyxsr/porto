import { create } from 'zustand';

import { CompanyIds } from '@/constants/company';

export type CompanyStore = {
  company: CompanyIds | undefined;
  setCompany: (company: CompanyIds | undefined) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  company: 'feedloop-ai',
  setCompany: (company) => set({ company }),
}));
