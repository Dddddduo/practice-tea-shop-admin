interface SSEClientOptions {
  reconnectInterval?: number;
  maxRetries?: number;
}

export class SSEClient {
  private url: string;
  private token: string;
  private options: Required<SSEClientOptions>;
  private listeners: Map<string, Set<(event: CustomEvent) => void>>;
  private reconnectAttempts: number;
  private controller: AbortController | null;

  constructor(url: string, token: string, options: SSEClientOptions = {}) {
    this.url = url;
    this.token = token;
    this.options = {
      reconnectInterval: 1000,
      maxRetries: 5,
      ...options
    };
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.controller = null;
  }

  addEventListener(type: string, callback: (event: CustomEvent) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
  }

  removeEventListener(type: string, callback: (event: CustomEvent) => void): void {
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.delete(callback);
    }
  }

  private dispatchEvent(event: CustomEvent): void {
    if (this.listeners.has(event.type)) {
      for (const callback of this.listeners.get(event.type)!) {
        callback(event);
      }
    }
  }

  async connect(): Promise<void> {
    try {
      this.controller = new AbortController();
      const response = await fetch(this.url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'text/event-stream'
        },
        signal: this.controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n');

        for (const event of events) {
          if (event.trim() === '') continue;
          const [, type, data] = event.match(/^event: (.+)\ndata: (.+)$/m) || [, 'message', event];
          this.dispatchEvent(new CustomEvent(type, { detail: JSON.parse(data) }));
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      console.error('SSE connection failed:', error);
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.options.maxRetries) {
      console.error('Max reconnection attempts reached');
      this.dispatchEvent(new CustomEvent('error', { detail: 'Max reconnection attempts reached' }));
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting in ${this.options.reconnectInterval}ms... (Attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval);
  }

  close(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }
}

// 使用Demo
// const headers = new Headers({
//   'Authorization': 'Bearer your_token',
//   'Custom-Header': 'SomeValue'
// });
//
// fetch('/sse-endpoint', { headers })
//   .then(response => {
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//
//     function read() {
//       reader.read().then(({ done, value }) => {
//         if (done) return;
//
//         const chunk = decoder.decode(value);
//         // 处理接收到的 SSE 数据
//         console.log(chunk);
//
//         read(); // 继续读取
//       });
//     }
//
//     read();
//   });
