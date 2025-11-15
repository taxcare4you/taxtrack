'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/utils/getUser';
import DashboardTabs from '@/components/DashboardTabs';
import ReportDashboard from '@/components/ReportDashboard';
import TaxSummary from '@/components/TaxSummary';
import BusinessDashboard from '@/components/BusinessDashboard';
import TaxInsights from '@/components/TaxInsights';

type Business = {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

type Category = {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

type Expense = {
  id: string;
  user_id: string;
  business_id: string | null;
  category_id: string | null;
  description: string;
  amount: number;
  currency: string;
  date: string;
  is_active: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const user = await getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUserId(user.id);

    const { data: bizData, error: bizError } = await supabase
      .from('business')
      .select('*')
      .eq('user_id', user.id);
    if (bizError) console.error('business fetch error', bizError);
    if (bizData) setBusinesses(bizData as Business[]);

    const { data: catData, error: catError } = await supabase
      .from('category')
      .select('*')
      .eq('user_id', user.id);
    if (catError) console.error('category fetch error', catError);
    if (catData) setCategories(catData as Category[]);

    const { data: expData, error: expError } = await supabase
      .from('expense')
      .select('*')
      .eq('user_id', user.id);
    if (expError) console.error('expense fetch error', expError);
    if (expData) setExpenses(expData as Expense[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>🔐 Checking authentication...</p>;
  if (!userId) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to TaxTrack</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔓 Logout
        </button>
      </div>

      <p>
        <strong>User ID:</strong> {userId}
      </p>

      <DashboardTabs businesses={businesses} categories={categories} expenses={expenses} refresh={fetchData} />

      <ReportDashboard />

      <TaxSummary />

      <BusinessDashboard />

      {/* <TaxInsights /> */}
    </div>
  );
}