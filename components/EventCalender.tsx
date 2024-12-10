import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  parseISO,
  isSameDay
} from 'date-fns';
import { Dialog } from "@/components/ui/dialog"
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { WeekView } from '@/components/WorkView';
import { EventDialog } from '@/components/EventDialog';

interface Event {
  id?: string;
  name: string;
  description: string;
  startTime: Date;
  duration: number;
  tag: string;
  meetingLink: string;
}

export default function EventCalendar({ fetchEvents, events, logout,user,selectedUser,setSelectedUser,other,setOther }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    name: '',
    description: '',
    startTime: new Date(),
    duration: 30,
    tag: 'work',
    meetingLink: ''
  });
  
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('token');
    router.push('/login');
  };

  const handleCreateEvent = async () => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
  
      if (res.status === 400) {
        alert('Event time is occupied. Please choose a different time.');
        return;
      }
      const data = await res.json();
      if (data.event) {
        await fetchEvents();
        setNewEvent({
          name: '',
          description: '',
          startTime: new Date(),
          duration: 30,
          tag: 'work',
          meetingLink: ''
        });
        setIsEventModalOpen(false);
        setSuccessMessage('Event created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      alert('Error creating event');
    }
  };

  const getWeekEvents = (day: Date) => {
    return events.filter((event: Event) => {
      const eventDate = parseISO(event.startTime.toString());
      return isSameDay(eventDate, day);
    });
  };

  const getEventColor = (tag: string) => {
    switch(tag) {
      case 'work': return 'bg-blue-200';
      case 'personal': return 'bg-green-200';
      default: return 'bg-gray-200';
    }
  };

  const handleTimeSlotClick = (date: Date, startTime: Date) => {
    setNewEvent(prev => ({
      ...prev,
      startTime: startTime,
    }));
    setIsEventModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          handleLogout={handleLogout}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          other={other}
          setOther={setOther}
         
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
            <Header
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            /> 
            <WeekView
              weekDays={weekDays}
              events={events}
              getWeekEvents={getWeekEvents}
              getEventColor={getEventColor}
              onTimeSlotClick={handleTimeSlotClick}
            />
         
            <EventDialog
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              handleCreateEvent={handleCreateEvent}
            />
          </Dialog>
        </div>
      </div>

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow">
          {successMessage}
        </div>
      )}
    </div>
  );
}