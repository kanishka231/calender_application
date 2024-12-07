"use client";

// context/AppContext.tsx
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
  datetime: string;
  tag: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  fetchUserDetails: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  logout: () => void;
}

// Create Context with default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode; // Define children prop as ReactNode
}

// Context Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("/api/user"); // Assuming you have an endpoint for user details
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      console.log(res,"res")
      setEvents(res.data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setEvents([]);
    sessionStorage.removeItem("token"); // Clear session storage
    // Optionally clear cookies if you use them
  };

  // Automatically fetch data if user is logged in
  useEffect(() => {
   
    fetchUserDetails();
    fetchEvents();
   
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
