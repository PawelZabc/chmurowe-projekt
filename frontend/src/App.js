import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import keycloak from './keycloak';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Messages from './components/Messages';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' }).then(auth => {
      setAuthenticated(auth);
      if (!auth) {
        keycloak.login();
      }
    });
  }, []);

  if (!authenticated) return <div>Loading...</div>;

  return (
    <Router>
      <nav>
        <Link to="/">Main</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link> |{' '}
        <Link to="/message">Messages</Link> | <button onClick={() => keycloak.logout()}>Logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/message" element={<Messages />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
