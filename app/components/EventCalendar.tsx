import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';

interface NewEvent {
  name: string;
  datetime: string;
  tag: string;
}

export default function EventCalendar() {
  const { events, fetchEvents, logout } = useAppContext();
  const [newEvent, setNewEvent] = useState<NewEvent>({
    name: '',
    datetime: '',
    tag: 'work',
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  // Handle Logout
  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('token'); // Clear token from sessionStorage
    router.push('/login'); // Redirect to login page
  };

  // Handle Event Creation
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
        // Show alert if event time is occupied
        alert('Event time is occupied. Please choose a different time.');
        return;
      }
  
      const data = await res.json();
  
      if (data.event) {
        // Refresh event list after creation
        await fetchEvents();
        setNewEvent({ name: '', datetime: '', tag: 'work' }); // Clear the form
        setSuccessMessage('Event created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Hide success message after 3 seconds
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };
  



  return (
    <div>
      <header>
        <h1>Event Calendar</h1>
        <button
          onClick={handleLogout}
          style={{
            float: 'right',
            backgroundColor: 'red',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      {/* Success Message */}
      {successMessage && <div className="alert success">{successMessage}</div>}

      {/* Display Events */}
      <div>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id}>
              <h3>{event.name}</h3>
              <p>{new Date(event.datetime).toLocaleString()}</p>
              <p>{event.tag}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>

      {/* Event Creation Form */}
      <div>
        <input
          type="text"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newEvent.datetime}
          onChange={(e) => setNewEvent({ ...newEvent, datetime: e.target.value })}
        />
        <select
          value={newEvent.tag}
          onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="others">Others</option>
        </select>
        <button onClick={handleCreateEvent}>Create Event</button>
      </div>
    </div>
  );
}
