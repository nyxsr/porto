import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

type SocialMedia = {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
};

export const SOCIAL_MEDIA: SocialMedia[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/nyxsr',
    icon: <FaGithub />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/sahrul-ramdan-2012',
    icon: <FaLinkedin />,
  },
];
