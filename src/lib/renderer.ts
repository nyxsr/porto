import { CompanyIds } from '@/constants/company';

export const generatePalleteOrbColors = (company: CompanyIds) => {
  switch (company) {
    case 'feedloop-ai':
      return ['#68d1b9', '#3577df', '#171717'];
    case 'reacteev-id':
      return ['#65d3cb', '#3477ba', '#141d45'];
    case 'fotolaku':
      return ['#ec6f33', '#ffffff', '#080808'];
    default:
      return [];
  }
};
