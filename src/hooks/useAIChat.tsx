import React from 'react';
import { Convo } from '@/db/schemas/convo';

export type MessageType = 'INTRODUCE' | 'SKILLS';

export type MessageMeta = {
  type?: MessageType[];
  model?: string;
  sources?: Array<{
    slug: string;
    title: string;
    score: number;
  }>;
  timestamp?: string;
  tokenEstimate?: number;
  allowGeneralFallback?: boolean;
  source?: string;
};

export type Message = Omit<Convo, 'id' | 'createdAt' | 'updatedAt' | 'sid'> & {
  id?: number;
  clientId?: string;
  meta?: MessageMeta;
};

export default function useAIChat({ sid, onComplete }: { sid: string; onComplete?: () => void }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [draft, setDraft] = React.useState<string>('');
  const eventSourceRef = React.useRef<EventSource | null>(null);

  const isStreamingRef = React.useRef(false);

  const connect = React.useCallback(() => {
    if (!sid) return;
    if (eventSourceRef.current) eventSourceRef.current.close();

    const url = new URL('/api/chat/stream', window.location.origin);
    url.searchParams.set('sessionId', sid);

    const es = new EventSource(url.toString(), { withCredentials: false });
    eventSourceRef.current = es;

    const cleanup = () => {
      es.close();
      eventSourceRef.current = null;
      isStreamingRef.current = false;
      setIsConnected(false);
      setDraft('');
    };

    // session
    es.addEventListener('session', () => setIsConnected(true));

    // chunk
    es.addEventListener('chunk', (ev: MessageEvent) => {
      try {
        const { content } = JSON.parse(ev.data);
        setDraft((prev) => prev + content);
      } catch {}
    });

    // complete
    es.addEventListener('complete', () => {
      try {
        // Message is already saved in the database by the stream endpoint
        // No need to add it here - it will be fetched with the next conversation load
        onComplete?.();
      } finally {
        cleanup();
      }
    });

    // error
    es.addEventListener('error', () => {
      cleanup();
    });

    es.onopen = () => setIsConnected(true);

    return () => {
      es.close();
      setIsConnected(false);
      setDraft('');
    };
  }, [sid, onComplete]);

  const disconnect = React.useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsConnected(false);
    setDraft('');
  }, []);

  return { messages, setMessages, isConnected, connect, disconnect, draft };
}
