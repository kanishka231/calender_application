import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { EventDetailsDialog } from '@/components/EventDetailDialog';

interface WeekViewProps {
  weekDays: Date[];
  events: any[];
  getWeekEvents: (day: Date) => any[];
  getEventColor: (tag: string) => string;
  onTimeSlotClick: (date: Date, time: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ 
  weekDays, 
  events, 
  getWeekEvents, 
  getEventColor, 
  onTimeSlotClick 
}) => {
  // Create an array of time slots (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return new Date(0, 0, 0, i, 0);
  });
  
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Helper function to generate unique keys
  const generateUniqueKey = (day: Date, timeSlot: Date, index: number) => {
    return `week-view-${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${timeSlot.getHours()}-${index}`;
  };

  // Check if a given date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Handle event click
  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col w-full h-full bg-grey-100 ">
      {/* Header with dates */}
      <div className="flex border sticky top-0 bg-white z-10">
        <div className="w-16  " /> {/* Time gutter spacer */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={`header-day-${day.toISOString()}-${dayIndex}`}
            className={`flex-1 text-center py-2 px-1  ${
              isToday(day) ? 'text-blue-600' : 'text-gray-900'
            }`}
          >
            <div className="text-sm font-medium">
              {format(day, 'EEE')}
            </div>
            <div className={`
              text-2xl font-bold w-10 h-10 flex items-center justify-center mx-auto rounded-full
              ${isToday(day) ? 'bg-blue-600 text-white' : ''}
            `}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto mb-20">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0  ">
          {timeSlots.map((timeSlot, timeSlotIndex) => (
            <div 
              key={`time-label-${timeSlot.getHours()}-${timeSlotIndex}`}
              className="h-20 border-b border-r text-right pr-2"
            >
              <span className="text-xs text-gray-500">
                {format(timeSlot, 'h a')}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIndex) => (
            <div 
              key={`day-column-${day.toISOString()}-${dayIndex}`}
              className="border-r last:border-r-0"
            >
              {timeSlots.map((timeSlot, timeSlotIndex) => {
                // Generate a unique key for each time slot
                const uniqueKey = generateUniqueKey(day, timeSlot, timeSlotIndex);

                // Create a combined date and time
                const combinedDateTime = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate(),
                  timeSlot.getHours(),
                  0
                );

                // Filter events for this specific time slot
                const eventsAtTimeSlot = getWeekEvents(day).filter((event: any) => {
                  const eventStart = new Date(event.startTime);
                  return eventStart.getHours() === timeSlot.getHours();
                });

                return (
                  <div 
                    key={uniqueKey}
                    className={`
                      h-20 border-b relative group
                      ${eventsAtTimeSlot.length === 0 ? 'hover:bg-gray-50' : ''}
                    `}
                    onClick={() => onTimeSlotClick(day, combinedDateTime)}
                  >
                    {/* Half-hour marker */}
                    <div className="absolute w-full h-px bg-gray-100 top-1/2" />
                    
                    {/* Events */}
                    {eventsAtTimeSlot.map((event: any, eventIndex: number) => (
                      <div
                        key={`${uniqueKey}-event-${event.id || eventIndex}`}
                        className={`
                          absolute inset-x-0 mx-1 rounded-sm shadow-sm
                          ${getEventColor(event.tag)} z-10 cursor-pointer
                        `}
                        style={{
                          top: '2px',
                          minHeight: '24px'
                        }}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        <div className="px-2 py-1 text-xs truncate">
                          <span className="font-medium">{format(new Date(event.startTime), 'h:mm a')}</span>
                          <span className="ml-1">{event.name}</span>
                        </div>
                      </div>
                    ))}

                    {/* Click target overlay */}
                    <div className="absolute inset-0 cursor-pointer" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};