"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/utils/getUser';

type Business = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

export default function CreateExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('CAD');
  const [date, setDate] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      const user = await getUser();
      if (!user) return;

      const { data: bizData } = await supabase
        .from('business')
        .select('id, name')
        .eq('user_id', user.id);
      setBusinesses(bizData || []);

      const { data: catData } = await supabase
        .from('category')
        .select('id, name')
        .eq('user_id', user.id);
      setCategories(catData || []);
    };

    fetchOptions();
  }, []);

  const handleCreate = async () => {
    setMessage('');
    setError('');
    const user = await getUser();
    if (!user) {
      setError('User not logged in');
      return;
    }

    const { error: insertError } = await supabase
      .from('expense')
      .insert([{
        user_id: user.id,
        business_id: businessId,
        category_id: categoryId,
        description,
        amount,
        currency,
        date,
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setMessage('Expense created successfully!');
      setDescription('');
      setAmount(0);
      setCurrency('CAD');
      setDate('');
      setBusinessId(null);
      setCategoryId(null);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Create New Expense</h3>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(parseFloat(e.target.value))}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <input
        type="text"
        placeholder="Currency (e.g. CAD)"
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      />

      <select
        value={businessId || ''}
        onChange={e => setBusinessId(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        <option value="">Select Business</option>
        {businesses.map(biz => (
          <option key={biz.id} value={biz.id}>{biz.name}</option>
        ))}
      </select>

      <select
        value={categoryId || ''}
        onChange={e => setCategoryId(e.target.value)}
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <button onClick={handleCreate}>Create Expense</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}