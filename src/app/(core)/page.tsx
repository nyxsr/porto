'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, Dices } from 'lucide-react';
import { motion } from 'motion/react';
import { v4 } from 'uuid';

import { generatePalleteOrbColors } from '@/lib/renderer';
import { cn } from '@/lib/utils';
import { CompanyIds } from '@/constants/company';
import { SAMPLE_QUESTIONS, SUGGESTION_ITEMS } from '@/constants/suggestion';
import { useCompanyStore } from '@/store/company.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import BlurredMask from './_components/blurred-mask';
// import CompanySelector from './_components/company-selector';
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
    const newSid = v4();
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
    <div className='relative h-full md:p-4'>
      <OrbsLayer colors={colors} />
      <BlurredMask />
      <div className='relative z-30 h-[80%] md:h-full'>
        <div className='sticky top-0 left-0 flex items-center justify-end px-10 pt-10 md:p-0'>
          {/*<CompanySelector />*/}
          <SocialMedias />
        </div>
        <div className='mx-auto flex h-full max-w-screen flex-col items-center justify-center gap-4 md:max-w-[70%]'>
          <motion.h1
            className='text-center text-4xl font-semibold'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Introducing, Sahrul Ramdan
          </motion.h1>
          <motion.p
            className='text-center text-gray-400'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Full-Stack Developer who turns tech needs into solutions and keeps teams moving in sync.
          </motion.p>
          <motion.div
            className='fixed bottom-10 flex w-[85%] items-center rounded-4xl bg-[#303030] p-3 md:static md:w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={(e) => handleSubmit(e)} className='w-full'>
              <Input
                aria-label='Ask anything about me...'
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
              <button
                aria-label='Random Question'
                onClick={getRandomQuestion}
                className='cursor-pointer px-2'
              >
                <Dices />
              </button>
              <Button
                aria-label='Submit'
                type='submit'
                disabled={isProcessing}
                className={cn('rounded-full text-black', isProcessing && 'bg-gray-500')}
              >
                <ArrowUp />
              </Button>
            </div>
          </motion.div>
          <motion.div
            className='flex max-w-[80%] flex-wrap items-center justify-center gap-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {SUGGESTION_ITEMS.map((suggest, index) => (
              <motion.div
                key={suggest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <Button
                  disabled={isProcessing}
                  onClick={() => {
                    setInput(suggest.prompt);
                    inputRef.current?.focus();
                  }}
                  variant={'outline'}
                  className='inline-flex cursor-pointer rounded-2xl bg-transparent shadow'
                >
                  {suggest.icon}
                  {suggest.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
