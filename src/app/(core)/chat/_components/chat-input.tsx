import React from 'react';
import { Dices } from 'lucide-react';

import { SAMPLE_QUESTIONS } from '@/constants/suggestion';
import { Input } from '@/components/ui/input';

import { LoadingDots } from '../../_components/loading-dots';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isStreaming: boolean;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  isStreaming,
  isProcessing,
  inputRef,
}: ChatInputProps) {
  const [lastSelectedIndex, setLastSelectedIndex] = React.useState(-1);
  const getRandomQuestion = React.useCallback(() => {
    const questions = SAMPLE_QUESTIONS;
    const randomIndex = Math.floor(Math.random() * questions.length);
    if (randomIndex === lastSelectedIndex) {
      getRandomQuestion();
      return;
    }
    setInput(questions[randomIndex]);
    setLastSelectedIndex(randomIndex);
  }, [lastSelectedIndex, setInput]);

  return (
    <div className='sticky bottom-0 z-30 p-4 backdrop-blur-2xl'>
      <div className='mx-auto w-[calc(3.25/4_*_100%)]'>
        <form className='flex w-full flex-col items-center gap-2' onSubmit={onSubmit}>
          <div className='flex w-full items-center rounded-4xl bg-[#303030] p-3'>
            <Input
              ref={inputRef}
              disabled={isStreaming}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='border-none bg-transparent outline-none focus-visible:ring-0'
              placeholder='Ask anything about me...'
            />
            <div className='flex items-center gap-2'>
              {isProcessing && <LoadingDots />}
              <button type='button' onClick={getRandomQuestion} className='cursor-pointer px-4'>
                <Dices />
              </button>
            </div>
          </div>
          <small className='text-muted-foreground'>
            AI Generated, it&apos;ll be better if you ask to me directly
          </small>
        </form>
      </div>
    </div>
  );
}
