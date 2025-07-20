import express from 'express';
import { RoomServiceClient } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const livekitClient = new RoomServiceClient(
  process.env.LIVEKIT_WS_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

app.post('/api/create-room', async (req, res) => {
  try {
    // Cria sala com gravação automática
    const room = await livekitClient.createRoom({
      name: `room-${Date.now()}`,
      recordParticipantsOnConnect: true,
    });
    // Retorna informações da sala
    res.json({ roomId: room.name, roomSid: room.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));