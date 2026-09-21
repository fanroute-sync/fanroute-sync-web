import { ChatRoomScreen } from '@/features/chat/ui/chat-room-screen';
export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) { const { roomId } = await params; return <ChatRoomScreen roomId={Number(roomId)} />; }
