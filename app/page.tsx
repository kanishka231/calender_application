'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import EventCalendar from '@/app/components/EventCalendar';  // Import EventCalendar component

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

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      {/* Render the EventCalendar component */}
      <EventCalendar />
    </div>
  );
}
