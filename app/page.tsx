'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import EventCalendar from '@/components/EventCalender';  // Import EventCalendar component
import { useAppContext } from './context/AppContext';

export default function DashboardPage() {
  const router = useRouter();
  
  const { events, fetchEvents, logout } = useAppContext();

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
      <EventCalendar 
      events = {events}
      logout={logout} 
      fetchEvents={fetchEvents}/>
    </div>
  );
}
