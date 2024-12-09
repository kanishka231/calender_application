import React from 'react';
import { addMonths, subMonths } from 'date-fns';
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentDate, setCurrentDate, handleLogout }) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(currentDate);

  React.useEffect(() => {
    setCalendarDate(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCalendarDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(prevDate => addMonths(prevDate, 1));
  };

  return (
    <div className="w-auto bg-white p-4 border-r lg:block hidden">
      <div className="flex items-center justify-center mb-6">
        Dizely Calender
      </div>
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={(date) => date && setCurrentDate(date)}
        month={calendarDate}
        onMonthChange={setCalendarDate}
        className="rounded-md border"
      />
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

