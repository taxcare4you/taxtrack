import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Create a Supabase client bound to server cookies
  const supabase = await createClient();

  // Check for a valid session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users
  if (!session) {
    redirect('/auth/login');
  }

  // Render protected layout
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f9f9f9' }}>
        <header
          style={{
            padding: '16px 24px',
            background: '#0070f3',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          TaxTrack Dashboard
        </header>

        <main style={{ padding: 24 }}>{children}</main>

        <footer
          style={{
            marginTop: 32,
            padding: 16,
            background: '#eee',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          © {new Date().getFullYear()} TaxCare4YouPC
        </footer>
      </body>
    </html>
  );
}