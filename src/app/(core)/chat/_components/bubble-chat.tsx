import Markdown from 'react-markdown';

import { cn } from '@/lib/utils';

export type BubbleChatProps = {
  message: string;
  role: 'user' | 'assistant' | 'system';
  className?: string;
  rootClassName?: string;
  systemCategory?: string;
};

export default function BubbleChat({
  message,
  role,
  className,
  rootClassName,
  systemCategory,
}: BubbleChatProps) {
  const contentClass =
    role === 'user'
      ? `bg-[#252628] rounded-2xl text-white border border-[#323335]`
      : role === 'assistant'
        ? 'bg-transparent text-white'
        : `${systemCategory === 'error' ? 'bg-red-500' : 'bg-yellow-600 rounded-2xl border border-yellow-800 shadow-lg **:text-black!'}`;

  const roleStyles = () => {
    switch (role) {
      case 'user':
        return 'justify-end';
      case 'assistant':
        return 'justify-start';
      case 'system':
        return 'justify-center';
      default:
        return 'justify-center';
    }
  };

  return (
    <div className={cn('mx-4 flex items-center md:mx-0', roleStyles(), rootClassName)}>
      <div className={cn('prose p-6 **:text-white md:max-w-2/3', contentClass, className)}>
        <Markdown>{message}</Markdown>
      </div>
    </div>
  );
}
