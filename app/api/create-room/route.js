// app/api/create-room/route.js

import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

// Inicializa o cliente de administração usando o endpoint REST
const livekitClient = new RoomServiceClient(
  process.env.LIVEKIT_API_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

// Validação das variáveis de ambiente
if (
  !process.env.LIVEKIT_API_URL ||
  !process.env.LIVEKIT_API_KEY ||
  !process.env.LIVEKIT_API_SECRET
) {
  throw new Error(
    'Missing LiveKit configuration: LIVEKIT_API_URL, LIVEKIT_API_KEY or LIVEKIT_API_SECRET'
  );
}

// Handler para GET /api/create-room
export async function GET() {
  try {
    const room = await livekitClient.createRoom({
      name: `room-${Date.now()}`,
      recordParticipantsOnConnect: true,
    });
    return NextResponse.json({ roomId: room.name, roomSid: room.sid });
  } catch (err) {
    console.error('create-room error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
