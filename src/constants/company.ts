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
      path: '/chat/genexis',
    },
    {
      id: 'digilend',
      title: 'Digilend',
      path: '/chat/digilend',
    },
    {
      id: 'bridev',
      title: 'BRIDev',
      path: '/chat/bridev',
    },
  ],
  'reacteev-id': [
    {
      id: 'premium-portal',
      title: 'Premium Portal',
      path: '/chat/premium-portal',
    },
    {
      id: 'tutoria-id',
      title: 'Tutoria ID',
      path: '/chat/tutoria-id',
    },
  ],
  fotolaku: [
    {
      id: 'fotolaku-business-enterprise',
      title: 'Fotolaku Business Enterprise',
      path: '/chat/fotolaku-business-enterprise',
    },
    {
      id: 'siap-jadi-brand',
      title: 'Siap Jadi Brand - Fotolaku Landing Page',
      path: '/chat/landing-page-fotolaku',
    },
  ],
};

export const companyBg: Record<CompanyIds, string> = {
  'feedloop-ai': 'bg-feedloop-primary text-black',
  'reacteev-id': 'bg-reacteev-primary text-black',
  fotolaku: 'bg-fotolaku-primary text-black',
};
