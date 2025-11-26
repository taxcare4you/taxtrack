import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient(); // now async

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const email = session.user?.email;
  const { data: invite, error } = await supabase
    .from('beta_invite')
    .select('*')
    .eq('email', email)
    .single();

  if (!invite || error) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}