'use client';

import { useSessionGuard } from '@/hooks/useSessionGuard';

export default function HomePageClient() {
  useSessionGuard();
  return <div>Welcome!</div>;
}