"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/utils/getUser';

export default function TaxInsights() {
  const [topCategories, setTopCategories] = useState<
    { category: string; total: number }[]
  >([]);

  const fetchInsights = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase.rpc('get_top_categories', {
      uid: user.id,
    });

    if (error) {
      console.error('Error fetching insights:', error.message);
      return;
    }

    if (data) setTopCategories(data);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🧠 Tax Insights</h2>
      <p>Here are your top spending categories:</p>
      <ul>
        {topCategories.map((row, i) => (
          <li key={i}>
            {row.category}: ${row.total.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}