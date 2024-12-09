import React from 'react';
import { format, addWeeks, startOfWeek, endOfWeek, isSameMonth, isSameYear } from 'date-fns';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"

interface HeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, setCurrentDate }) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  const formatDateRange = () => {
    if (isSameMonth(weekStart, weekEnd)) {
      // Week is within the same month
      return format(weekStart, 'MMMM yyyy');
    } else if (isSameYear(weekStart, weekEnd)) {
      // Week spans two months in the same year
      return `${format(weekStart, 'MMMM')} - ${format(weekEnd, 'MMMM yyyy')}`;
    } else {
      // Week spans two years
      return `${format(weekStart, 'MMMM yyyy')} - ${format(weekEnd, 'MMMM yyyy')}`;
    }
  };

  return (
    <header className="bg-white shadow-md flex justify-between items-center p-4 flex-wrap">
      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">
          {formatDateRange()}
        </h2>
      </div>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
    </header>
  );
};