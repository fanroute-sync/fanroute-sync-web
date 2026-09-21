import { beforeEach, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({ clients: [] as Array<{ options: Record<string, unknown>; connectHeaders: Record<string, string>; connected: boolean; subscriptions: Array<{ destination: string; callback: (frame: { body: string }) => void; unsubscribe: ReturnType<typeof vi.fn> }>; publish: ReturnType<typeof vi.fn>; deactivate: ReturnType<typeof vi.fn>; activate: ReturnType<typeof vi.fn> }> }));
vi.mock('@stomp/stompjs', () => ({ Client: class {
  options: Record<string, unknown>; connectHeaders: Record<string, string> = {}; connected = true;
  subscriptions: Array<{ destination: string; callback: (frame: { body: string }) => void; unsubscribe: ReturnType<typeof vi.fn> }> = [];
  publish = vi.fn(); deactivate = vi.fn(); activate = vi.fn();
  constructor(options: Record<string, unknown>) { this.options = options; mock.clients.push(this); }
  subscribe(destination: string, callback: (frame: { body: string }) => void) { const subscription = { destination, callback, unsubscribe: vi.fn() }; this.subscriptions.push(subscription); return subscription; }
} }));
import { connectChat } from './chat-socket';

beforeEach(() => { mock.clients.length = 0; localStorage.setItem('accessToken', 'access'); vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com/api/v1'); });
it('authenticates STOMP CONNECT, subscribes, sends, and resubscribes after reconnect', async () => {
  const onMessage = vi.fn(); const onRead = vi.fn(); const onConnect = vi.fn();
  const socket = connectChat(10, { onMessage, onRead, onConnect, onStatus: vi.fn() });
  const client = mock.clients[0];
  await (client.options.beforeConnect as () => Promise<void>)();
  expect(client.connectHeaders).toEqual({ Authorization: 'Bearer access' });
  expect(client.options.brokerURL).toBe('wss://api.example.com/ws/chat');
  (client.options.onConnect as () => void)();
  expect(client.subscriptions.map((item) => item.destination)).toEqual(['/user/queue/chat.rooms/10', '/user/queue/chat.rooms/10/reads']);
  expect(socket.send('  안녕  ')).toBe(true);
  expect(client.publish).toHaveBeenCalledWith({ destination: '/app/chat.rooms/10/messages', body: JSON.stringify({ content: '안녕' }) });
  expect(socket.send('   ')).toBe(false); expect(socket.send('a'.repeat(1001))).toBe(false);
  client.subscriptions[0].callback({ body: JSON.stringify({ id: 1, roomId: 10, senderId: 1, senderNickname: '팬', content: '안녕', createdAt: '2026-09-21T10:00:00', readCount: 0 }) });
  client.subscriptions[1].callback({ body: JSON.stringify({ roomId: 10, userId: 2, lastReadMessageId: 1 }) });
  expect(onMessage).toHaveBeenCalledTimes(1); expect(onRead).toHaveBeenCalledTimes(1);
  localStorage.setItem('accessToken', 'renewed'); await (client.options.beforeConnect as () => Promise<void>)();
  (client.options.onConnect as () => void)();
  expect(client.connectHeaders.Authorization).toBe('Bearer renewed'); expect(client.subscriptions[0].unsubscribe).toHaveBeenCalled(); expect(onConnect).toHaveBeenCalledTimes(2);
  socket.disconnect(); expect(client.subscriptions[2].unsubscribe).toHaveBeenCalled(); expect(client.deactivate).toHaveBeenCalled();
});
