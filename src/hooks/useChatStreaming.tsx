import React from 'react';
import { nanoid } from 'nanoid';

import { scrollToBottom, weightedPick } from '@/lib/utils';
import { PROCESS_LABELS } from '@/constants/chat';
import { Message, MessageType } from '@/hooks/useAIChat';
import { CompanyIds } from '@/constants/company';

export interface ChatStreamingState {
  isStreaming: boolean;
  isProcessing: boolean;
  streamingDraft: string;
  processLabel: string;
}

export interface ChatStreamingOptions {
  showIntroduction?: boolean;
  showSkills?: boolean;
  showResume?: boolean;
  showSummary?: boolean;
}

export interface ChatStreamingActions {
  sendMessage: (text: string, options?: ChatStreamingOptions) => Promise<void>;
}

interface UseChatStreamingProps {
  sid: string;
  company?: CompanyIds;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  refetch: () => void;
  messageSectionRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function useChatStreaming({
  sid,
  company,
  setMessages,
  refetch,
  messageSectionRef,
  inputRef,
}: UseChatStreamingProps): ChatStreamingState & ChatStreamingActions {
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [streamingDraft, setStreamingDraft] = React.useState('');
  const [processLabel, setProcessLabel] = React.useState<string>(PROCESS_LABELS[0]);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  // Check if user is near bottom of scroll container
  const isNearBottom = React.useCallback((element: HTMLElement, threshold = 100) => {
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    return scrollHeight - scrollTop - clientHeight <= threshold;
  }, []);

  // Update auto-scroll state when user manually scrolls
  React.useEffect(() => {
    const handleScroll = () => {
      if (messageSectionRef.current) {
        setShouldAutoScroll(isNearBottom(messageSectionRef.current));
      }
    };

    const element = messageSectionRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [messageSectionRef, isNearBottom]);

  const sendMessage = React.useCallback(
    async (text: string, options: ChatStreamingOptions = {}) => {
      if (!text.trim()) return;

      const { showIntroduction, showSkills, showResume, showSummary } = options;

      // Push user message optimistically
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: text, meta: {}, clientId: String(nanoid()) } as Message,
      ]);

      setIsStreaming(true);
      setIsProcessing(true);
      setStreamingDraft('');

      // Scroll after user message is added (always scroll for new user messages)
      setTimeout(() => {
        if (messageSectionRef.current) {
          scrollToBottom(messageSectionRef.current);
          setShouldAutoScroll(true); // Reset auto-scroll when user sends a message
        }
      }, 100);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid, message: text, company }),
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

                    if (data.type === 'chunk') {
                      fullDraft += data.content;
                      setStreamingDraft(fullDraft);
                      // Auto-scroll during streaming only if user is near bottom
                      if (messageSectionRef.current && shouldAutoScroll) {
                        scrollToBottom(messageSectionRef.current);
                      }
                    } else if (data.type === 'complete') {
                      // Add the complete assistant message to the messages state
                      if (fullDraft) {
                        const types: MessageType[] = [];
                        if (showIntroduction) types.push('INTRODUCE');
                        if (showSkills) types.push('SKILLS');
                        if (showResume) types.push('RESUME');
                        if (showSummary) types.push('SUMMARY');

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
                      // Scroll after message is complete only if user is near bottom
                      setTimeout(() => {
                        if (messageSectionRef.current && shouldAutoScroll) {
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
      } catch (error) {
        console.error('Network error:', error);
        setIsStreaming(false);
        setIsProcessing(false);
      }
    },
    [sid, company, refetch, setMessages, messageSectionRef, inputRef, shouldAutoScroll],
  );

  // Handle process label animation
  React.useEffect(() => {
    let timer: number | undefined;

    if (isProcessing) {
      const tick = () => setProcessLabel(weightedPick(PROCESS_LABELS));
      tick();
      timer = window.setInterval(tick, 5000);
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isProcessing]);

  return {
    isStreaming,
    isProcessing,
    streamingDraft,
    processLabel,
    sendMessage,
  };
}