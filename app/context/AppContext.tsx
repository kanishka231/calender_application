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
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  other: boolean;
  setOther: (state: boolean) => void;
  logout: () => void;
  fetchUsers: (query: string) => Promise<void>;
  searchResults: User[];
  isSearching: boolean;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// Context Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedUser , setSelectedUser ] = useState<User | null>(null);
  const [other,setOther]=useState<boolean>(false) 
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("/api/user");
      console.log(res,"res user")
      if (res.data.user) {
       // console.log(res,"res")
        setUser(res.data.user);
        fetchEvents();
      }
    } catch (error) {
    }
  };
  const fetchUsers = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`/api/user?q=${encodeURIComponent(query)}`);
      const data = response.data;
  
      if (response.status === 200) {
        setSearchResults(data.users || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events"); // Replace with your actual API route
      if (res.status === 200) {
        setEvents(res.data.events || []);
      } else {
        console.warn("Failed to fetch events:", res.data.error);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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
    fetchEvents()
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        fetchUserDetails,
        fetchEvents,
        logout,
        selectedUser,
        setSelectedUser,
        other,
        setOther,
        fetchUsers,
        searchResults,
        isSearching,
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