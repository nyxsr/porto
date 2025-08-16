import { Briefcase, Code, GraduationCap, User } from 'lucide-react';

export const SUGGESTION_ITEMS = [
  {
    id: 1,
    label: 'Sahrul Ramdan',
    icon: <User />,
    prompt:
      'Can you introduce Sahrul Ramdan and give an overview of who he is? Especially his skillset and experience',
  },
  {
    id: 2,
    label: 'My Works',
    icon: <Briefcase />,
    prompt: `Could you describe Sahrul Ramdan’s work experience and notable projects?`,
  },
  {
    id: 3,
    label: 'Education',
    icon: <GraduationCap />,
    prompt: `What is Sahrul Ramdan’s educational background and academic achievements?`,
  },
  {
    id: 4,
    label: 'Skills',
    icon: <Code />,
    prompt: `What are Sahrul Ramdan’s key technical skills and areas of expertise?`,
  },
];

export const SAMPLE_QUESTIONS: string[] = [
  'Who is Sahrul Ramdan?',
  'Can you give me a short bio about Sahrul?',
  'What are Sahrul’s main technical skills?',
  'Which programming languages does Sahrul use?',
  'What is Sahrul’s expertise in backend development?',
  'Where has Sahrul worked before?',
  'Tell me about Sahrul’s role at Reacteev ID.',
  'What is Sahrul’s educational background?',
  'What kind of person is Sahrul outside of work?',
  'What are Sahrul’s hobbies and interests?',
  'How can I contact Sahrul?',
  'Does Sahrul have a LinkedIn profile or GitHub?',
  'If Sahrul was a superhero, what would his power be?',
  'Can Sahrul survive without coffee and Vim?',
  'Is Sahrul secretly a Greek god?',
  'Would Sahrul build a website for aliens if they asked?',
  'What game would Sahrul play against Zeus?',
  'Can Sahrul debug JavaScript while eating Karedok Leunca?',
];
