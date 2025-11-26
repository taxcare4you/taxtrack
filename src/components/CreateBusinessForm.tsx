'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CreateBusinessForm() {
  const supabase = createClient();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setMessage('');
    setError('');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      setError('User not logged in');
      return;
    }

    const { error: insertError } = await supabase
      .from('business')
      .insert([{ name, user_id: userId }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setMessage('Business created successfully!');
      setName('');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Create New Business</h3>
      <input
        type="text"
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />
      <button onClick={handleCreate}>Create</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}