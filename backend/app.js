import express from 'express';
import db from './database.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

// app.use(cors({
//   origin: "*"
// }))

app.use(cors());
app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT messages.id, messages.content, messages.created_at, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.id DESC
      LIMIT 20;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'You need to enter a username and a password' });
  }
  const result = await db.query(
    'SELECT id, username FROM users WHERE username = $1 AND password = $2',
    [username, password]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({ id: result.rows[0].id, username: result.rows[0].username ,message: "Logged in"});
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'You need to enter a username and a password' });
  }
  const result = await db.query(
    'SELECT username FROM users WHERE username = $1',
    [username]
  );
  if (result.rows.length > 0) {
    return res.status(400).json({ message: 'Account with that username exists' });
  }
  else {
    const result = await db.query(
          'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
          [username, password]
        );
    return res.json({ id: result.rows[0].id, username: result.rows[0].username ,message:"Account created"});
    }
  });

  
// app.post('/api/message', async (req, res) => {
//   const { userId, content } = req.body;

//   if (!userId || !content) {
//     return res.status(400).json({ error: 'Missing userId or content' });
//   }

//   try {
//     const result = await db.query(
//       'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING id, content, created_at',
//       [userId, content]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error adding message:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/api/message/', async (req,res)=>{
  const {userFilter,contentFilter} = req.query;
  let baseQuery = 'SELECT messages.content, messages.created_at, users.username FROM messages JOIN users ON messages.user_id = users.id';
  const conditions = [];
  const params = [];


  if (userFilter) {
    params.push(userFilter);
    conditions.push(`username = $${params.length}`);
  }

  if (contentFilter) {
    params.push(`%${contentFilter}%`);
    conditions.push(`content ILIKE $${params.length}`);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  baseQuery += ' ORDER BY created_at DESC LIMIT 20';

  const result = await db.query(baseQuery, params);

  res.json(result.rows);

});

app.post('/api/message/', async (req,res)=>{
  const { user_id, content} = req.body;
  console.log(user_id,content)
  if (!user_id) {
    return res.status(401).json({ message: 'You need to be logged in' });
  }
  if (!content){
    return res.status(400).json({ message: 'The message cant be empty' });
  }
  const result = await db.query(
          'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING id',
          [user_id, content]
        );
  res.status(200).json({message:"Message added"});

});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
