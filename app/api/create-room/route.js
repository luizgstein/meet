// app/api/create-room/route.ts
import { NextResponse } from 'next/server';
import { RoomServiceClient, AccessToken, VideoGrant } from 'livekit-server-sdk';

// Extrai variáveis de ambiente
const {
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET,
  FRONTEND_URL,       // ex: https://app.seudominio.com/join
} = process.env;

if (!LIVEKIT_API_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !FRONTEND_URL) {
  throw new Error(
    'Missing configuration: LIVEKIT_API_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET or FRONTEND_URL'
  );
}

const livekitClient = new RoomServiceClient(
  LIVEKIT_API_URL,
  LIVEKIT_API_KEY,
  LIVEKIT_API_SECRET
);

export async function GET() {
  try {
    // 1) Cria a sala
    const opts = {
      name: `room-${Date.now()}`,
      recordParticipantsOnConnect: true,
      emptyTimeout: 10 * 60,
      maxParticipants: 20,
    };
    const room = await livekitClient.createRoom(opts);

    // 2) Gera o token de ingresso para essa sala
    const at = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      { identity: `user-${Date.now()}` }
    );
    at.addGrant(new VideoGrant({ room: room.name }));
    const token = at.toJwt();

    // 3) Monta o link de ingresso
    const link = `${FRONTEND_URL}?token=${encodeURIComponent(token)}`;

    // 4) Retorna roomId, roomSid e link
    return NextResponse.json({
      roomId:   room.name,
      roomSid:  room.sid,
      link, 
    });
  } catch (error) {
    console.error('create-room error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
