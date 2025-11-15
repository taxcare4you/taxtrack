"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      } else {
        console.error('No session found');
      }
    };
    handleRedirect();
  }, [router]);

  return <p>Redirecting...</p>;
}