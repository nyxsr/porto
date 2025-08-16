'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dices } from 'lucide-react';
import { motion } from 'motion/react';

import { generatePalleteOrbColors } from '@/lib/renderer';
import { CompanyIds } from '@/constants/company';
import { SAMPLE_QUESTIONS, SUGGESTION_ITEMS } from '@/constants/suggestion';
import { useCompanyStore } from '@/store/company.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import BlurredMask from './_components/blurred-mask';
import CompanySelector from './_components/company-selector';
import { LoadingDots } from './_components/loading-dots';
import OrbsLayer from './_components/orbs-layer';
import SocialMedias from './_components/social-medias';

export default function CorePage() {
  const company = useCompanyStore((state) => state.company);
  const colors = generatePalleteOrbColors(company as CompanyIds);
  const router = useRouter();
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);

    // Generate a new session ID and navigate with the message as a query param
    const newSid = crypto.randomUUID();
    router.push(`/chat/${newSid}?initialMessage=${encodeURIComponent(input)}`);
    setInput('');
    setIsProcessing(false);
  };

  const getRandomQuestion = () => {
    const questions = SAMPLE_QUESTIONS;
    const randomIndex = Math.floor(Math.random() * questions.length);
    setInput(questions[randomIndex]);
  };

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
          <motion.div className='flex w-full items-center rounded-4xl bg-[#303030] p-3'>
            <form onSubmit={(e) => handleSubmit(e)} className='w-full'>
              <Input
                ref={inputRef}
                disabled={isProcessing}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='border-none bg-transparent outline-none focus-visible:ring-0'
                placeholder='Ask anything about me...'
              />
            </form>
            <div className='flex items-center gap-2'>
              {isProcessing && <LoadingDots />}
              <button onClick={getRandomQuestion} className='cursor-pointer px-4'>
                <Dices />
              </button>
            </div>
          </motion.div>
          <div className='flex items-center gap-3'>
            {SUGGESTION_ITEMS.map((suggest) => (
              <Button
                disabled={isProcessing}
                onClick={() => {
                  setInput(suggest.prompt);
                  inputRef.current?.focus();
                }}
                key={suggest.id}
                variant={'outline'}
                className='inline-flex cursor-pointer rounded-2xl bg-transparent shadow'
              >
                {suggest.icon}
                {suggest.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
