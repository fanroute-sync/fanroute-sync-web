import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { chatMessageSchema, chatReadSchema, type ChatMessage, type ChatReadEvent } from './chat-service';

export function chatSocketUrl(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL): string {
  if (!baseUrl) throw new Error('API_BASE_URL_MISSING');
  const url = new URL(baseUrl, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${url.pathname.replace(/\/(api\/v1)?\/?$/, '')}/ws/chat`;
  url.search = '';
  return url.toString();
}

export function connectChat(roomId: number, handlers: { onMessage: (message: ChatMessage) => void; onRead: (event: ChatReadEvent) => void; onConnect: () => void; onStatus: (status: string) => void }) {
  let subscriptions: StompSubscription[] = [];
  const client = new Client({
    brokerURL: chatSocketUrl(), reconnectDelay: 5000,
    beforeConnect: () => { const token = localStorage.getItem('accessToken'); if (!token) throw new Error('AUTHENTICATION_REQUIRED'); client.connectHeaders = { Authorization: `Bearer ${token}` }; },
    onConnect: () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      subscriptions = [
        client.subscribe(`/user/queue/chat.rooms/${roomId}`, (frame: IMessage) => { const result = chatMessageSchema.safeParse(JSON.parse(frame.body)); if (result.success && result.data.roomId === roomId) handlers.onMessage(result.data); }),
        client.subscribe(`/user/queue/chat.rooms/${roomId}/reads`, (frame: IMessage) => { const result = chatReadSchema.safeParse(JSON.parse(frame.body)); if (result.success && result.data.roomId === roomId) handlers.onRead(result.data); }),
      ];
      handlers.onStatus('connected'); handlers.onConnect();
    },
    onWebSocketClose: () => handlers.onStatus('reconnecting'),
    onWebSocketError: () => handlers.onStatus('reconnecting'),
    onStompError: () => handlers.onStatus('error'),
  });
  client.activate();
  return {
    send(content: string): boolean { const trimmed = content.trim(); if (!client.connected || !trimmed || trimmed.length > 1000) return false; client.publish({ destination: `/app/chat.rooms/${roomId}/messages`, body: JSON.stringify({ content: trimmed }) }); return true; },
    disconnect() { subscriptions.forEach((subscription) => subscription.unsubscribe()); subscriptions = []; void client.deactivate(); },
  };
}
