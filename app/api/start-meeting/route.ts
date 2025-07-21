// app/api/start-meeting/route.ts
import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';
import { generateRoomId } from '@/lib/client-utils';

const {
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  NEXT_PUBLIC_APP_URL
} = process.env;

if (
  !LIVEKIT_API_URL ||
  !LIVEKIT_API_KEY ||
  !LIVEKIT_API_SECRET ||
  !NEXT_PUBLIC_APP_URL
) {
  throw new Error(
    'Variables LIVEKIT_API_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET ou NEXT_PUBLIC_APP_URL não definidas'
  );
}

const livekitClient = new RoomServiceClient(
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

export async function GET(request: Request) {
  const participantName = new URL(request.url).searchParams.get('participantName');
  if (!participantName) {
    return NextResponse.json({ error: 'participantName obrigatório' }, { status: 400 });
  }
  const roomId = generateRoomId();
  const room = await livekitClient.createRoom({
    name: roomId,
    emptyTimeout: 10 * 60,   // 10 minutos
    maxParticipants: 20,     // limite de participantes
  });

  // Monta o link público da reunião
  const link = `${NEXT_PUBLIC_APP_URL}/rooms/${roomId}?participantName=${encodeURIComponent(
    participantName
  )}`;
  return NextResponse.json({ link });
}
