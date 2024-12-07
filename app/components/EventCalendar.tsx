// Frontend (React)

'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

// Define types for Event and NewEvent
interface Event {
  _id: string;
  name: string;
  datetime: string;
  tag: string;
}

interface NewEvent {
  name: string;
  datetime: string;
  tag: string;
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]); // State for events
  const [newEvent, setNewEvent] = useState<NewEvent>({
    name: '',
    datetime: '',
    tag: 'work', // Default tag set to 'work'
  });
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message

  // Fetch events from the API using axios
  const fetchEvents = async () => {
    try {
      const res = await axios.get('./api/events'); // No need to send token
      setEvents(res.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events', error);
      alert('Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events on initial load
  }, []);

  // Handle event creation using axios
  const handleCreateEvent = async () => {
    try {
      const res = await axios.post(
        './api/events',
        newEvent, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Created event:', res.data);
      if (res.data.event) {
        // Refresh the event list from the server
        fetchEvents();
        setNewEvent({ name: '', datetime: '', tag: 'work' }); // Clear form
        setSuccessMessage('Event created successfully!'); // Show success message
        setTimeout(() => setSuccessMessage(''), 3000); // Hide success message after 3 seconds
      }
    } catch (error) {
      console.error('Error creating event', error);
      alert('Error creating event');
    }
  };

  return (
    <div>
      <h1>Event Calendar</h1>

      {/* Success Message */}
      {successMessage && <div className="alert success">{successMessage}</div>}

      {/* Display events */}
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

      {/* Event creation form */}
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
