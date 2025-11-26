"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getSessionUser } from '@/utils/getSession';

export default function BusinessDashboard() {
  const [summary, setSummary] = useState<
    { business: string; total: number; currency: string }[]
  >([]);

  const fetchSummary = async () => {
    const user = await getSessionUser();

    if (!user) return;

    const { data, error } = await supabase.rpc('get_business_summary', {
      uid: user.id,
    });

    if (!error && data) setSummary(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Business-Level Summary</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>Business</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Total</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Currency</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, i) => (
            <tr key={i}>
              <td>{row.business}</td>
              <td>${row.total.toFixed(2)}</td>
              <td>{row.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}