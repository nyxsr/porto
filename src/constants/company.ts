import { SidebarItem } from './sidebar';

export const COMPANIES = [
  {
    id: 'feedloop-ai',
    name: 'Feedloop AI',
    current: true,
  },
  {
    id: 'reacteev-id',
    name: 'Reacteev ID',
    current: false,
  },
  {
    id: 'fotolaku',
    name: 'Fotolaku',
    current: false,
  },
] as const;
export type CompanyIds = (typeof COMPANIES)[number]['id'];

type CompanyProjects = Record<CompanyIds, SidebarItem[]>;

export const COMPANY_PROJECTS: CompanyProjects = {
  'feedloop-ai': [
    {
      id: 'genexis',
      title: 'Genexis',
      path: '/projects/genexis',
    },
    {
      id: 'digilend',
      title: 'Digilend',
      path: '/projects/digilend',
    },
    {
      id: 'bridev',
      title: 'BRIDev',
      path: '/projects/bridev',
    },
  ],
  'reacteev-id': [
    {
      id: 'premium-portal',
      title: 'Premium Portal',
      path: '/projects/premium-portal',
    },
    {
      id: 'tutoria-id',
      title: 'Tutoria ID',
      path: '/projects/tutoria-id',
    },
  ],
  fotolaku: [
    {
      id: 'fotolaku-business-enterprise',
      title: 'Fotolaku Business Enterprise',
      path: '/projects/fotolaku-business-enterprise',
    },
    {
      id: 'siap-jadi-brand',
      title: 'Siap Jadi Brand - Fotolaku Landing Page',
      path: '/projects/landing-page-fotolaku',
    },
  ],
};
