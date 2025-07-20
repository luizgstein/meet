import express from 'express';
import { RoomServiceClient } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const livekitClient = new RoomServiceClient(
  process.env.LIVEKIT_WS_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

// Usamos GET pois não há payload necessário
app.get('/api/create-room', async (_req, res) => {
  try {
    const room = await livekitClient.createRoom({
      name: `room-${Date.now()}`,
      recordParticipantsOnConnect: true,
    });
    res.json({ roomId: room.name, roomSid: room.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));