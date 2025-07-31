import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.APIKEY;
const CHAT_ID = process.env.CHATID;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const telegramURL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHAT_ID,
    text: `<b>Mensaje recibido:</b> ${message}\n<b>IP:</b> <code>${ip}</code>`,
    parse_mode: 'HTML',
  };

  try {
    await axios.post(telegramURL, payload);
    res.json({ message: 'Mensaje enviado con éxito', ip });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error enviando mensaje' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
