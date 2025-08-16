import { Cloud, Code, Database, Layout, Terminal, ToolCase } from 'lucide-react';

export type Skill = {
  section: string;
  icon: React.ReactNode | null;
  stacks: Stack[];
};

export type Stack = {
  name: string;
  icon: React.ReactNode | null;
  level: number; // More expert, the higher the number
  url?: string;
};

export const SKILLS: Skill[] = [
  {
    section: 'Programming Language',
    icon: <Terminal />,
    stacks: [
      { name: 'TypeScript', icon: null, level: 5, url: 'https://www.typescriptlang.org/' },
      {
        name: 'JavaScript',
        icon: null,
        level: 5,
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      },
      { name: 'Rust', icon: null, level: 1, url: 'https://www.rust-lang.org/' },
    ],
  },
  {
    section: 'Frontend Development',
    icon: <Layout />,
    stacks: [
      { name: 'React', icon: null, level: 5, url: 'https://react.dev/' },
      { name: 'Next.js', icon: null, level: 5, url: 'https://nextjs.org/' },
      { name: 'Tailwind CSS', icon: null, level: 5, url: 'https://tailwindcss.com/' },
      { name: 'Chakra UI', icon: null, level: 4, url: 'https://chakra-ui.com/' },
      { name: 'Shadcn UI', icon: null, level: 5, url: 'https://ui.shadcn.com/' },
      {
        name: 'Motion (Framer Motion)',
        icon: null,
        level: 3,
        url: 'https://www.framer.com/motion/',
      },
      { name: 'Tanstack Query', icon: null, level: 5, url: 'https://tanstack.com/query/latest' },
      { name: 'React Router DOM', icon: null, level: 5, url: 'https://reactrouter.com/' },
    ],
  },
  {
    section: 'Backend Development',
    icon: <Code />,
    stacks: [
      { name: 'Node.js', icon: null, level: 5, url: 'https://nodejs.org/' },
      { name: 'Express', icon: null, level: 5, url: 'https://expressjs.com/' },
      { name: 'Elysia.js', icon: null, level: 4, url: 'https://elysiajs.com/' },
      { name: 'Drizzle', icon: null, level: 5, url: 'https://orm.drizzle.team/' },
      { name: 'Prisma', icon: null, level: 5, url: 'https://www.prisma.io/' },
      { name: 'Redis', icon: null, level: 3, url: 'https://redis.io/' },
      { name: 'BullMQ', icon: null, level: 3, url: 'https://docs.bullmq.io/' },
    ],
  },
  {
    section: 'Database',
    icon: <Database />,
    stacks: [
      { name: 'MongoDB', icon: null, level: 3, url: 'https://www.mongodb.com/' },
      { name: 'PostgreSQL', icon: null, level: 5, url: 'https://www.postgresql.org/' },
      { name: 'Redis', icon: null, level: 3, url: 'https://redis.io/' },
      { name: 'MySQL', icon: null, level: 3, url: 'https://www.mysql.com/' },
    ],
  },
  {
    section: 'Tools',
    icon: <ToolCase />,
    stacks: [
      { name: 'Git', icon: null, level: 4, url: 'https://git-scm.com/' },
      { name: 'GitHub', icon: null, level: 5, url: 'https://github.com/' },
      { name: 'Vim', icon: null, level: 4, url: 'https://www.vim.org/' },
      { name: 'Neovim', icon: null, level: 4, url: 'https://neovim.io/' },
    ],
  },
  {
    section: 'Deployment',
    icon: <Cloud />,
    stacks: [
      { name: 'Docker', icon: null, level: 4, url: 'https://www.docker.com/' },
      { name: 'Docker Compose', icon: null, level: 3, url: 'https://docs.docker.com/compose/' },
      { name: 'Docker Swarm', icon: null, level: 3, url: 'https://docs.docker.com/engine/swarm/' },
      { name: 'Kubernetes', icon: null, level: 2, url: 'https://kubernetes.io/' },
      { name: 'Github Actions', icon: null, level: 3, url: 'https://docs.github.com/actions' },
    ],
  },
];
