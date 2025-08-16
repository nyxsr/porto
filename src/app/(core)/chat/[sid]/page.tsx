'use client';

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Self } from '@/assets';
import { Dices } from 'lucide-react';
import { nanoid } from 'nanoid';

import { detectIntroductionInquiry, detectSkillsInquiry } from '@/lib/chat-utils';
import { scrollToBottom } from '@/lib/utils';
import { useConversation } from '@/hooks/api/useConvo';
import useAIChat, { Message, MessageMeta, MessageType } from '@/hooks/useAIChat';
import { SKILLS } from '@/constants/skills';
import { SAMPLE_QUESTIONS } from '@/constants/suggestion';
import { Input } from '@/components/ui/input';

import BubbleChat from '../_components/bubble-chat';
import ChatError from '../_components/chat-error';
import ChatSkeleton from '../_components/chat-skeleton';
import SkillBadge from '../_components/skill-badge';
import { LoadingDots } from '../../_components/loading-dots';

export default function ChatPage() {
  const { sid } = useParams<{ sid: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMessage = searchParams.get('initialMessage') || '';
  const [input, setInput] = React.useState('');
  const [streamingDraft, setStreamingDraft] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = React.useState(false);
  const [showIntroduction, setShowIntroduction] = React.useState(false);
  const [showSkills, setShowSkills] = React.useState(false);
  const { data, isLoading, isError, refetch } = useConversation(sid);
  const { messages, setMessages, disconnect } = useAIChat({ sid, onComplete: () => refetch() });
  const messageSectionRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sendMessage = React.useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Check if this is an introduction inquiry
      const isIntroduction = detectIntroductionInquiry(text);
      const isSkillInquiry = detectSkillsInquiry(text);
      if (isIntroduction) {
        setShowIntroduction(true);
      }
      if (isSkillInquiry) {
        setShowSkills(true);
      }

      // push user message optimistically
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: text, meta: {}, clientId: String(nanoid()) } as Message,
      ]);

      setIsStreaming(true);
      setIsProcessing(true);
      setStreamingDraft('');

      // Scroll after user message is added
      setTimeout(() => {
        if (messageSectionRef.current) {
          scrollToBottom(messageSectionRef.current);
        }
      }, 100);

      // The POST to /api/chat handles everything:
      // 1. Saves user message
      // 2. Streams assistant response
      // 3. Saves assistant response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid, message: text }),
      });

      if (response.ok && response.body) {
        setIsProcessing(false);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullDraft = '';
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Append new chunk to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === '') continue; // Skip empty lines

              if (line.startsWith('event: ')) {
                // Handle event type (optional, for future use)
                continue;
              }

              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === 'introduction') {
                    // Server confirmed this is an introduction
                    setShowIntroduction(true);
                  } else if (data.type === 'chunk') {
                    fullDraft += data.content;
                    setStreamingDraft(fullDraft);
                    // Auto-scroll during streaming
                    if (messageSectionRef.current) {
                      scrollToBottom(messageSectionRef.current);
                    }
                  } else if (data.type === 'complete') {
                    // Add the complete assistant message to the messages state
                    if (fullDraft) {
                      const types: MessageType[] = [];
                      if (showIntroduction) types.push('INTRODUCE');
                      if (showSkills) types.push('SKILLS');

                      const assistantMessage: Message = {
                        role: 'assistant',
                        content: fullDraft,
                        meta: types.length > 0 ? { type: types } : {},
                        clientId: String(nanoid()),
                      };
                      setMessages((prev) => [...prev, assistantMessage]);
                    }
                    // Clear draft and streaming state
                    setStreamingDraft('');
                    setIsStreaming(false);
                    setShowIntroduction(false); // Reset for next message
                    setShowSkills(false); // Reset for next message
                    // Scroll after message is complete
                    setTimeout(() => {
                      if (messageSectionRef.current) {
                        scrollToBottom(messageSectionRef.current);
                      }
                    }, 100);
                    // Refetch to sync with database
                    refetch();
                  }
                } catch (e) {
                  console.error('Failed to parse SSE data:', line, e);
                }
              } else if (line.startsWith(':')) {
                // SSE comment (ping), ignore
                continue;
              }
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          setIsStreaming(false);
          setIsProcessing(false);
        } finally {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      } else {
        console.error('Failed to send message:', response.status);
        setIsStreaming(false);
        setIsProcessing(false);
      }
    },
    [sid, refetch, setMessages, showIntroduction, showSkills],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput('');
    await sendMessage(text);
  };

  const getRandomQuestion = () => {
    const questions = SAMPLE_QUESTIONS;
    const randomIndex = Math.floor(Math.random() * questions.length);
    setInput(questions[randomIndex]);
  };

  React.useEffect(() => {
    if (data) {
      // Convert database messages to Message type with proper meta typing
      const convertedMessages: Message[] = data.map((msg) => ({
        role: msg.role,
        content: msg.content,
        meta: (msg.meta as MessageMeta) || undefined,
        id: msg.id,
      }));
      setMessages(convertedMessages);
      // Scroll to bottom when messages are loaded
      setTimeout(() => {
        if (messageSectionRef.current) {
          scrollToBottom(messageSectionRef.current);
        }
      }, 100);
    }
  }, [data, setMessages]);

  React.useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  // Handle initial message from URL params
  React.useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage && !isLoading && data !== undefined) {
      setHasProcessedInitialMessage(true);

      // Clean up URL by removing the initialMessage param
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('initialMessage');
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);

      // Send the initial message
      sendMessage(initialMessage);
    }
  }, [
    initialMessage,
    hasProcessedInitialMessage,
    isLoading,
    data,
    searchParams,
    router,
    sendMessage,
  ]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className='flex h-full w-full flex-col'>
      <div
        ref={messageSectionRef}
        className='relative z-10 mx-auto mt-6 w-[calc(3.25/4_*_100%)] flex-1 overflow-y-auto px-6 pb-20'
      >
        {isLoading ? (
          <ChatSkeleton />
        ) : isError ? (
          <ChatError onRetry={() => refetch()} />
        ) : messages && messages.length > 0 ? (
          <div className='space-y-4'>
            {messages.map((message) => {
              const messageTypes = (message.meta?.type as MessageType[]) || [];
              const showIntro = messageTypes.includes('INTRODUCE');
              const showSkillsSection = messageTypes.includes('SKILLS');

              if (messageTypes.length > 0) {
                return (
                  <div key={(message.id ?? message.clientId) as React.Key} className='space-y-4'>
                    {showIntro && (
                      <div className='flex items-center justify-start gap-4'>
                        <Image
                          src={Self}
                          alt='Sahrul Ramdan'
                          width={150}
                          height={150}
                          className='rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <div className='text-2xl font-medium text-white'>Sahrul Ramdan</div>
                          <div className='text-sm text-white/60'>Fullstack Engineer</div>
                          <small>But more like into Frontend Engineer</small>
                        </div>
                      </div>
                    )}
                    {showSkillsSection && (
                      <div className='rounded-lg bg-white/5 p-4'>
                        <div className='mb-2 text-lg font-semibold text-white'>
                          Skills & Expertise
                        </div>
                        <small className='text-white/80'>
                          Maybe that&apos;s quite a lot of skills, but trust me, it will be even
                          more in the future.
                        </small>
                        <div className='mt-3 grid grid-cols-3 gap-4'>
                          {SKILLS.map((skill) => {
                            const visibleSkill = skill.stacks.slice(0, 5);
                            const hiddenSkill = skill.stacks.slice(5);
                            return (
                              <SkillBadge
                                key={skill.section}
                                skill={skill}
                                hiddenSkill={hiddenSkill}
                                visibleSkill={visibleSkill}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
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
            {isProcessing && (
              <span className='flex items-center justify-start gap-4 italic'>
                Thonking <LoadingDots />
              </span>
            )}
            {streamingDraft && (
              <div className='space-y-4'>
                {showIntroduction && (
                  <div className='flex items-center justify-start gap-4'>
                    <Image src={Self} alt='Sahrul Ramdan' width={150} height={150} />
                    <div className='flex flex-col'>
                      <div className='text-2xl font-medium text-white'>Sahrul Ramdan</div>
                      <div className='text-sm text-white/60'>Fullstack Engineer</div>
                      <small>But more like into Frontend Engineer</small>
                    </div>
                  </div>
                )}
                {showSkills && (
                  <div className='rounded-lg bg-white/5 p-4'>
                    <div className='mb-2 text-lg font-semibold text-white'>Skills & Expertise</div>
                    <small className='text-white/80'>
                      Maybe that&apos;s quite a lot of skills, but trust me, it will be even more in
                      the future.
                    </small>
                    <div className='mt-3 grid grid-cols-3 gap-4'>
                      {SKILLS.map((skill) => {
                        const visibleSkill = skill.stacks.slice(0, 5);
                        const hiddenSkill = skill.stacks.slice(5);
                        return (
                          <SkillBadge
                            key={skill.section}
                            skill={skill}
                            hiddenSkill={hiddenSkill}
                            visibleSkill={visibleSkill}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                <BubbleChat key={'__streaming_draft'} message={streamingDraft} role='assistant' />
              </div>
            )}
          </div>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4 text-4xl'>💬</div>
              <h3 className='text-lg font-medium text-white'>Start a Conversation</h3>
              <p className='mt-2 text-sm text-white/60'>
                Ask me anything about my work, skills, or experience
              </p>
            </div>
          </div>
        )}
      </div>
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
                <button onClick={getRandomQuestion} className='cursor-pointer px-4'>
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
    </div>
  );
}
