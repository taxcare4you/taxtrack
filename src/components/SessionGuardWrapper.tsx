'use client';

import { useSessionGuard } from '@/hooks/useSessionGuard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SessionGuardWrapper({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSessionGuard();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/auth/login');
    }
  }, [loading, session, router]);

  if (loading) return <p>Loading session...</p>;
  if (!session) return null; // renders nothing while redirect occurs

  return <>{children}</>;
}