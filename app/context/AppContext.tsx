"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";

// Define types for User and Event
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  datetime: string;
  tag: string;
  meetingLink: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  fetchUserDetails: () => Promise<void>;
  fetchEvents: (userId?: string) => Promise<void>;
  logout: () => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Context Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("/api/user");
      console.log(res,"res user")
      if (res.data.user) {
        setUser(res.data.user);
        fetchEvents(res.data.user._id);
      }
    } catch (error) {
    }
  };

  // Fetch events
  const fetchEvents = async (userId?: string) => {
    try {
      const id = userId || user?._id;
      if (!id) {
        console.warn("No user ID available to fetch events");
        return;
      }
      const res = await axios.get(`/api/events?userId=${id}`);
      console.log(res, "events response");
      setEvents(res.data.events || []);
    } catch (error) {
      setEvents([]);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setEvents([]);
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        fetchUserDetails,
        fetchEvents,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};