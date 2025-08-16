import React from 'react';

import { Message, MessageType } from '@/hooks/useAIChat';

import BubbleChat from './bubble-chat';
import SpecialMessageRenderer from './special-message-renderer';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export default function MessageList({ messages, className }: MessageListProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {messages.map((message) => {
        const messageTypes = (message.meta?.type as MessageType[]) || [];
        const showIntro = messageTypes.includes('INTRODUCE');
        const showSkillsSection = messageTypes.includes('SKILLS');
        const showResume = messageTypes.includes('RESUME');
        const showSummary = messageTypes.includes('SUMMARY');

        if (messageTypes.length > 0) {
          return (
            <div key={(message.id ?? message.clientId) as React.Key} className="space-y-4">
              <SpecialMessageRenderer
                showIntro={showIntro}
                showSkills={showSkillsSection}
                showResume={showResume}
                showSummary={showSummary}
              />
              <BubbleChat
                message={message.content}
                role={message.role as 'user' | 'assistant' | 'system'}
              />
            </div>
          );
        }

        return (
          <BubbleChat
            key={(message.id ?? message.clientId) as React.Key}
            message={message.content}
            role={message.role as 'user' | 'assistant' | 'system'}
          />
        );
      })}
    </div>
  );
}