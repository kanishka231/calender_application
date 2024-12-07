'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const isLoggedIn = await isAuthenticated();
      if (!isLoggedIn) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }
    checkAuth();
  }, [router]);

  return <div>Welcome to your dashboard!</div>;
}
