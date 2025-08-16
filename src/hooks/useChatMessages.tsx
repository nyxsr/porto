import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseChatMessagesProps {
  isLoading: boolean;
  messageSectionRef: React.RefObject<HTMLDivElement | null>;
  sendMessage?: (text: string, options?: unknown) => Promise<void>;
}

export function useChatMessages({ isLoading, sendMessage }: UseChatMessagesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('initialMessage') || '';
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = React.useState(false);
  const [isProcessingInitialMessage, setIsProcessingInitialMessage] = React.useState(false);
  const [pendingInitialMessage, setPendingInitialMessage] = React.useState<string>('');

  // Handle initial message from URL params
  React.useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage && !isLoading && sendMessage) {
      setHasProcessedInitialMessage(true);
      setIsProcessingInitialMessage(true);
      setPendingInitialMessage(initialMessage);

      // Clean up URL by removing the initialMessage param
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('initialMessage');
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);

      // Send the initial message
      sendMessage(initialMessage).finally(() => {
        setIsProcessingInitialMessage(false);
        setPendingInitialMessage('');
      });
    }
  }, [initialMessage, hasProcessedInitialMessage, isLoading, searchParams, router, sendMessage]);

  return {
    initialMessage,
    hasProcessedInitialMessage,
    isProcessingInitialMessage,
    pendingInitialMessage,
  };
}
