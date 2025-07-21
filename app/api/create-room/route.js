// app/api/create-room/route.ts
import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

// Extrai variáveis de ambiente
const { LIVEKIT_API_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

// Verifica configuração
if (!LIVEKIT_API_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  throw new Error(
    'Missing LiveKit configuration: LIVEKIT_API_URL, LIVEKIT_API_KEY or LIVEKIT_API_SECRET'
  );
}

// Inicializa cliente REST do LiveKit
const livekitClient = new RoomServiceClient(
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

// Handler GET /api/create-room
export async function GET() {
  try {
    const opts = {
      name: `room-${Date.now()}`,
      recordParticipantsOnConnect: true,
      emptyTimeout: 10 * 60,   // 10 minutos
      maxParticipants: 20,     // limite de participantes
    };
    const room = await livekitClient.createRoom(opts);
    return NextResponse.json({ roomId: room.name, roomSid: room.sid });
  } catch (error) {
    console.error('create-room error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}