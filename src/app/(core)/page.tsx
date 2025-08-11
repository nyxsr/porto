'use client';

import { Dices } from 'lucide-react';

import { generatePalleteOrbColors } from '@/lib/renderer';
import { CompanyIds } from '@/constants/company';
import { useCompanyStore } from '@/store/company.store';
import { Input } from '@/components/ui/input';

import BlurredMask from './_components/blurred-mask';
import CompanySelector from './_components/company-selector';
import OrbsLayer from './_components/orbs-layer';
import SocialMedias from './_components/social-medias';

export default function CorePage() {
  const company = useCompanyStore((state) => state.company);
  const colors = generatePalleteOrbColors(company as CompanyIds);

  return (
    <div className='relative h-full p-4'>
      <OrbsLayer colors={colors} />
      <BlurredMask />
      <div className='relative z-30 h-full'>
        <div className='sticky top-0 left-0 flex items-center justify-between'>
          <CompanySelector />
          <SocialMedias />
        </div>
        <div className='mx-auto flex h-full max-w-[70%] flex-col items-center justify-center gap-4'>
          <h1 className='text-4xl font-semibold'>Introducing, Sahrul Ramdan</h1>
          <p className='text-center text-gray-400'>
            Full-Stack Developer who turns tech needs into solutions and keeps teams moving in sync.
          </p>
          <div className='flex w-full items-center rounded-4xl bg-[#303030] p-3'>
            <Input
              className='border-none bg-transparent outline-none focus-visible:ring-0'
              placeholder='Ask anything about me...'
            />
            <button className='px-4'>
              <Dices />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
