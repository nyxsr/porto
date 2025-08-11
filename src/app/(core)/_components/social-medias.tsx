import Link from 'next/link';

import { SOCIAL_MEDIA } from '@/constants/social-media';

export default function SocialMedias() {
  return (
    <div className='flex items-center gap-3'>
      {SOCIAL_MEDIA.map((social) => (
        <Link key={social.id} href={social.url} className='text-gray-500 hover:text-gray-700'>
          {social.icon}
        </Link>
      ))}
    </div>
  );
}
