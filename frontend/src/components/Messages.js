import React, { useState } from 'react';

export default function Messages() {
  const [content, setContent] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [contentFilter, setContentFilter] = useState('');
  const [messages, setMessages] = useState([]);
  const [output, setOutput] = useState('');

  const getMessages = async () => {
    const params = {};
    if (userFilter) params.userFilter = userFilter;
    if (contentFilter) params.contentFilter = contentFilter;

    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`/api/message?${queryParams}`);
    const msgs = await response.json();
    setMessages(msgs);
  };

  const sendMessage = async () => {
    const user_id = sessionStorage.getItem('id');
    if (!user_id) {
      setOutput('Error: User not logged in.');
      return;
    }
    await fetch('/api/message/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, user_id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) setOutput(data.message);
      });
  };

  return (
    <div>
      <h1>Create a message:</h1>
      <input
        placeholder="message content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={sendMessage}>Send message</button>
      <pre>{output}</pre>

      <h1>Messages</h1>
      <input
        placeholder="Filter by user"
        value={userFilter}
        onChange={e => setUserFilter(e.target.value)}
      />
      <input
        placeholder="Filter by content"
        value={contentFilter}
        onChange={e => setContentFilter(e.target.value)}
      />
      <button onClick={getMessages}>Get messages</button>

      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            [{msg.username}] {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
