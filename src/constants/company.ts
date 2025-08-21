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

type CompanyProject = {
  id: string;
  description: string;
  company: CompanyIds;
};

export const genexis: CompanyProject = {
  id: 'genexis',
  description: `Genexis is one of the largest enterprise projects undertaken by Feedloop AI in collaboration with Accenture Singapore.
It was built to simplify the adoption and use of **AWS IoT services**, making advanced IoT capabilities accessible to both technical and non-technical users.
The platform consolidates complex AWS components into a user-friendly application, offering seamless integration with **AWS Greengrass and non-Greengrass environments**.
By lowering the learning curve of IoT deployments, Genexis empowers businesses to accelerate digital transformation, reduce operational complexity, and maximize the value of connected devices.`,
  company: 'feedloop-ai',
};

export const digilend: CompanyProject = {
  id: 'digilend',
  description: `Digilend is a smart lending platform designed to streamline the **loan eligibility assessment process** for financial institutions.
It provides lenders with clear insights into the **optimal loan amount** by leveraging AI-driven data validation and analysis.
A key feature of Digilend is its ability to **automatically verify company information** using data from credible internet sources, ensuring accuracy and reducing manual verification time.
Developed as a collaboration between **Feedloop and Pegadaian**, the platform enhances lending decisions with **comprehensive, coherent, and data-backed insights**, ultimately reducing risk and improving customer trust.`,
  company: 'feedloop-ai',
};

export const bridev: CompanyProject = {
  id: 'bridev',
  description: `BRIDev is a vendor management and operations platform developed in partnership with **Bank Rakyat Indonesia (BRI)**, one of the nation’s largest banks.
The solution was created to modernize how BRI manages vendors supporting its digital products.
By centralizing tools and workflows that were previously distributed across individual local devices, BRIDev delivers improved **isolation, control, and security** within a unified digital workspace.
The platform streamlines vendor collaboration, enforces compliance, and reduces operational risks — enabling BRI to scale its digital ecosystem with confidence.`,
  company: 'feedloop-ai',
};

export const premiumPortal: CompanyProject = {
  id: 'premium-portal',
  description: `PremiumPortal is a subscription platform that allows users to access more than 50 popular premium apps, including Netflix, ChatGPT, Disney+, and others, with a single account. For a monthly fee starting at 49,000 rupiah, users can access a variety of services, including entertainment, productivity tools, and educational resources, all in one package.

  The objective of this project is to develop a practical and cost-effective solution through a Chrome extension that simplifies one-click access to all premium apps. The development team is prioritizing the integration of services, the implementation of subscription payment systems, enhancing account security, and ensuring a seamless user experience.

  The expected business benefits include increasing the number of subscribers at a low cost, improving user retention, and strengthening PremiumPortal's position as an affordable and user-friendly premium subscription solution.`,
  company: 'reacteev-id',
};

export const tutoria: CompanyProject = {
  id: 'tutoria',
  description: `Tutoria is an educational platform created to help students prepare for competitive exams such as **CPNS, UTBK, and SBMPTN** through realistic **tryout simulations**.
By replicating the actual exam environment, Tutoria ensures that users gain confidence, reduce test anxiety, and are better prepared when facing the real tests.

Beyond providing practice exams, Tutoria delivers **comprehensive insights and personalized feedback** that highlight users’ weaknesses and guide them toward targeted improvement.
The platform combines **AI-powered virtual mentorship** with guidance from **real mentors and experts** who have successfully passed these exams with top scores.
This blended approach ensures learners benefit from both **scalable AI-driven support** and **human expertise**, creating a holistic preparation experience.

**Key benefits of Tutoria include:**
- Increasing exam readiness through real-world practice
- Helping students identify and address weaknesses with actionable feedback
- Providing a unique mix of AI mentorship and expert-led guidance for optimal results`,
  company: 'reacteev-id',
};

export const fotolakuBusinessEnterprise: CompanyProject = {
  id: 'fotolaku-business-enterprise',
  description: `Fotolaku Business Enterprise is a comprehensive internal application built to **digitize and integrate Fotolaku’s business processes end-to-end**.
The system manages workflows starting from **lead acquisition and qualification**, through **order processing and production tracking**, all the way to **customer service and after-sales support**.
By centralizing operations into a single platform, the solution improves **efficiency, transparency, and data consistency**, enabling Fotolaku to scale its services while maintaining high-quality client interactions.`,
  company: 'fotolaku',
};

export const landingPageFotolaku: CompanyProject = {
  id: 'landing-page-fotolaku',
  description: `The Fotolaku landing page was designed with a **product-first approach** to showcase Fotolaku’s photography and videography services.
It features an **interactive service and model catalog**, complete with sample works presented in a visually appealing format to inspire trust and professionalism.
The landing page not only serves as a **marketing tool** but also as an **educational showcase**, helping potential clients easily explore offerings, evaluate quality, and engage with Fotolaku’s services in a seamless way.`,
  company: 'fotolaku',
};
