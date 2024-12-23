import { useState, useEffect, useCallback, useRef } from 'react';
import { SSEClient } from '@/utils/SSEClient';

interface SSEMessage {
  type: string;
  data: any;
}

interface UseSSEClientOptions {
  url: string;
  token: string;
  reconnectInterval?: number;
  maxRetries?: number;
}

export const useSSEClient = ({ url, token, reconnectInterval, maxRetries }: UseSSEClientOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const clientRef = useRef<SSEClient | null>(null);

  const connect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current?.close();
    }

    clientRef.current = new SSEClient(url, token, { reconnectInterval, maxRetries });

    clientRef.current?.addEventListener('open', () => {
      setIsConnected(true);
      setError(null);
    });

    clientRef.current?.addEventListener('error', (event: CustomEvent) => {
      setIsConnected(false);
      setError(event.detail || 'Connection error');
    });

    clientRef.current?.addEventListener('message', (event: CustomEvent) => {
      setMessages((prevMessages) => [...prevMessages, { type: 'message', data: event.detail }]);
    });

    // 可以添加更多的事件监听器

    clientRef.current?.connect();
  }, [url, token, reconnectInterval, maxRetries]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current?.close();
      setIsConnected(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (clientRef.current) {
        clientRef.current?.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    error,
    messages,
    connect,
    disconnect,
    clearMessages,
  };
};
