import express from 'express';
import db from './database.js';

const app = express();
const PORT = 3000;

app.get('/api/data', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error('Querry error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
