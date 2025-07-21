
import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_API_KEY;
   const apiSecret = process.env.LIVEKIT_API_SECRET;
   if (!apiKey || !apiSecret) {
     throw new Error('Missing LiveKit API_KEY or API_SECRET');
   }

 export async function POST(request) {
  const { roomId, userId, role } = await request.json();

  const at = new AccessToken(apiKey, apiSecret, { identity: userId });
  // Passamos as permissões direto como objeto:
  at.addGrant({
    room: roomId,
    roomJoin: true,
    canSubscribe: true,
    canPublish: role === 'host',
  });
  at.ttl = 60 * 60 * 24;

  const token = await at.toJwt();
  return NextResponse.json({ token });
}
