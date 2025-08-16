'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Convo } from '@/db/schemas/convo';

import { useConversation } from '@/hooks/api/useConvo';
import useAIChat, { Message } from '@/hooks/useAIChat';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatStreaming } from '@/hooks/useChatStreaming';
import { useSpecialMessageTypes } from '@/hooks/useSpecialMessageTypes';

import ChatError from '../_components/chat-error';
import ChatInput from '../_components/chat-input';
import ChatSkeleton from '../_components/chat-skeleton';
import EmptyChatState from '../_components/empty-chat-state';
import MessageList from '../_components/message-list';
import ProcessingIndicator from '../_components/processing-indicator';
import StreamingPreview from '../_components/streaming-preview';
import BubbleChat from '../_components/bubble-chat';

export default function ChatPage() {
  const { sid } = useParams<{ sid: string }>();
  const [input, setInput] = React.useState('');
  const { data, isLoading, isError, refetch } = useConversation(sid);
  const { disconnect } = useAIChat({ sid, onComplete: () => refetch() });
  const messageSectionRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    showIntroduction,
    showSkills,
    showResume,
    showSummary,
    detectAndSetMessageTypes,
    resetMessageTypes,
  } = useSpecialMessageTypes();

  const [messages, setMessages] = React.useState<Message[]>([]);

  const { isStreaming, isProcessing, streamingDraft, processLabel, sendMessage } = useChatStreaming(
    {
      sid,
      setMessages,
      refetch,
      messageSectionRef,
      inputRef,
    },
  );

  const handleSendMessage = React.useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const messageTypes = detectAndSetMessageTypes(text);
      await sendMessage(text, messageTypes);
      resetMessageTypes();
    },
    [detectAndSetMessageTypes, sendMessage, resetMessageTypes],
  );

  const { isProcessingInitialMessage, pendingInitialMessage } = useChatMessages({
    isLoading,
    messageSectionRef,
    sendMessage: handleSendMessage,
  });

  React.useEffect(() => {
    if (data) {
      const convertedMessages: Message[] = data.map((msg: Convo) => ({
        role: msg.role,
        content: msg.content,
        meta: msg.meta as Message['meta'],
        id: msg.id,
      }));
      setMessages(convertedMessages);
    }
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput('');
    await handleSendMessage(text);
  };

  React.useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        ) : (messages && messages.length > 0) || isProcessing || streamingDraft || isProcessingInitialMessage ? (
          <div className='space-y-4'>
            {pendingInitialMessage && (
              <BubbleChat message={pendingInitialMessage} role="user" />
            )}
            {messages && messages.length > 0 && <MessageList messages={messages} />}
            <ProcessingIndicator isProcessing={isProcessing || isProcessingInitialMessage} processLabel={processLabel} />
            <StreamingPreview
              streamingDraft={streamingDraft}
              showIntroduction={showIntroduction}
              showSkills={showSkills}
              showResume={showResume}
              showSummary={showSummary}
            />
          </div>
        ) : (
          <EmptyChatState />
        )}
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        isStreaming={isStreaming}
        isProcessing={isProcessing}
        inputRef={inputRef}
      />
    </div>
  );
}
