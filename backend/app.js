import express from 'express';
import db from './database.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({
  origin:"http://localhost:8080"
}))

app.get('/api/data', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT messages.id, messages.content, messages.created_at, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC
      LIMIT 20;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
