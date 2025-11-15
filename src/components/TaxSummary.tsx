"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/utils/getUser';

export default function TaxSummary() {
  const [summary, setSummary] = useState<
    { business: string; category: string; total: number }[]
  >([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSummary = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase.rpc('get_tax_summary', {
      uid: user.id,
      from_date: startDate || null,
      to_date: endDate || null,
    });

    if (!error && data) setSummary(data);
  };

  useEffect(() => {
    fetchSummary();
  }, [startDate, endDate]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🧾 CRA-Style Tax Summary</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={fetchSummary}>Refresh</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>Business</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Category</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, i) => (
            <tr key={i}>
              <td>{row.business}</td>
              <td>{row.category}</td>
              <td>${row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}