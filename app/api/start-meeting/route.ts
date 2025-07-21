// app/api/start-meeting/route.ts
import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';
import { generateRoomId } from '@/lib/client-utils';

const { LIVEKIT_API_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
if (!LIVEKIT_API_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  throw new Error(
    'Variables LIVEKIT_API_URL, LIVEKIT_API_KEY ou LIVEKIT_API_SECRET não definidas'
  );
}
const livekitClient = new RoomServiceClient(
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

export async function POST(request: Request) {
  // lê participantName (se vier) e outras opções
  const { participantName, emptyTimeout = 10 * 60, maxParticipants = 20 } =
    (await request.json().catch(() => ({}))) as {
      participantName?: string;
      emptyTimeout?: number;
      maxParticipants?: number;
    };

  // cria a sala
  const roomId = generateRoomId();
  await livekitClient.createRoom({
    name: roomId,
    emptyTimeout,      // segundos
    maxParticipants,   // máximo de participantes
  });

  // monta a URL base
  const { origin } = new URL(request.url);
  let link = `${origin}/rooms/${roomId}`;

  // se veio participantName, adiciona à query para pre-povoar o PreJoin
  if (participantName) {
    link += `?participantName=${encodeURIComponent(participantName)}`;
  }

  return NextResponse.json({ roomId, link });
}
