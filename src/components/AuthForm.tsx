"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Logged in successfully!');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Signup successful! Check your email to confirm.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h2>Login / Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <button onClick={handleLogin} disabled={loading} style={{ marginRight: '1rem' }}>
        Login
      </button>
      <button onClick={handleSignup} disabled={loading}>
        Sign Up
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}