import React, { useState } from 'react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  const createAccount = () => {
    fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) setOutput(data.message);
        if (data.username && data.id) {
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('id', data.id);
          setOutput('Signed up!');
        }
      })
      .catch(() => setOutput('Signup failed'));
  };

  return (
    <div>
      <h1>Sign up</h1>
      <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={createAccount}>Sign up</button>
      <pre>{output}</pre>
    </div>
  );
}
