import { supabase } from '@/lib/supabaseClient';

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Optional: enforce invite-only beta access
  const { data: invite, error: inviteError } = await supabase
    .from('beta_invite')
    .select('email')
    .eq('email', user.email)
    .single();

  if (inviteError || !invite) {
    console.warn('User not in beta_invite list:', user.email);
    await supabase.auth.signOut();
    return null;
  }

  return user;
};