import { supabase } from '@/lib/supabaseClient';

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }

  return user;
};