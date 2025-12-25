'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  // Initialize Supabase client using the new SSR package
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  }

  return (
    <section>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Welcome to TaxTrack Dashboard
      </h1>
      <p style={{ marginBottom: 24 }}>
        You’re logged in and your session is valid. Explore your expense tracking and reports here.
      </p>

      <button
        onClick={handleLogout}
        style={{
          padding: '10px 16px',
          background: '#e00',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </section>
  );
}