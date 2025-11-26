import { supabase } from '@/lib/supabaseClient';

export async function getSessionUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) return null;
  return session.user;
}