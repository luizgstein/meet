const apiKey = process.env.LIVEKIT_API_KEY;
   const apiSecret = process.env.LIVEKIT_API_SECRET;
   if (!apiKey || !apiSecret) {
     throw new Error('Missing LiveKit API_KEY or API_SECRET');
   }

   export async function POST(request) {
     try {
       const { roomId, userId, role } = await request.json();
       if (!roomId || !userId || !['host','participant'].includes(role)) {
         return NextResponse.json(
           { error: 'Invalid roomId, userId or role' },
           { status: 400 }
         );
       }

       const at = new AccessToken(apiKey, apiSecret, { identity: userId });
       const grant = new RoomGrant({ room: roomId, roomJoin: true, canSubscribe: true, canPublish: role === 'host' });
       at.addGrant(grant);
       at.ttl = 60 * 60 * 24;  // 24 horas

       const token = await at.toJwt();
       return NextResponse.json({ token });
     } catch (error) {
       console.error('get-token error:', error);
       const message = error instanceof Error ? error.message : 'Unknown error';
       return NextResponse.json({ error: message }, { status: 500 });
     }
   }
