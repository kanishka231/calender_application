import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  handleLogout: () => void;
  selectedUser: any;
  setSelectedUser: (user: User) => void;
  other: any;
  setOther: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDate,
  setCurrentDate,
  handleLogout,
  selectedUser,
  setSelectedUser,
  other,
  setOther,
}) => {
  const { fetchUsers, searchResults, isSearching } = useAppContext();
  const [calendarDate, setCalendarDate] = useState<Date>(currentDate);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memoized and debounced fetch users function
  const debouncedFetchUsers = useCallback(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchUsers(searchQuery);
      }
    }, 500); // 500ms delay to reduce unnecessary calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchUsers]); // Add fetchUsers to dependency array

  // Use useEffect with the memoized function
  useEffect(() => {
    const cleanup = debouncedFetchUsers();
    return cleanup;
  }, [debouncedFetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    clearSearch();
    setOther(true);
  };

  return (
    <div className="w-auto bg-white p-4 border-r lg:block hidden">
      {/* Search Box */}.
      
      <div className="relative mb-4">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder={selectedUser ? selectedUser.name : "Search users"}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-full"
          />
          {searchQuery && (
            <X
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
              size={20}
              onClick={clearSearch}
            />
          )}
        </div> */}

        {/* Search Results Dropdown */}
        {/* {(searchQuery && searchResults.length > 0) || isSearching ? (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-2 text-sm text-gray-500">Searching...</div>
            ) : (
              searchResults.map((user: any) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              ))
            )}

            {!isSearching && searchResults.length === 0 && (
              <div className="p-2 text-sm text-gray-500">No users found</div>
            )}
          </div>
        ) : null} */}
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={(date) => date && setCurrentDate(date)}
        month={calendarDate}
        onMonthChange={setCalendarDate}
        className="rounded-md border"
      />

      {/* Logout Button */}
      <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};