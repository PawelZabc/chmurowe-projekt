import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  const Login = () => {
    fetch('/api/login', {
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
          setOutput('Logged in!');
        }
      })
      .catch(() => setOutput('Login failed'));
  };

  return (
    <div>
      <h1>Log in</h1>
      <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={Login}>Log in</button>
      <pre>{output}</pre>
    </div>
  );
}
