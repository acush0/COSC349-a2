// login.js
import React, { useState } from 'react';
import endpoint from './key';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${endpoint}:8080/user/login`, {
        username,
        password
      });
      if (response.status === 200) {
        onLoginSuccess(response.data);
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username: </label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        <br /><br />
        <label>Password: </label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <br /><br />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
