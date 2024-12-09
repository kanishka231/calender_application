import React, { useMemo } from 'react';
import { format, isSameDay, parseISO, startOfDay, setHours, setMinutes, addMinutes } from 'date-fns';

interface WeekViewProps {
  weekDays: Date[];
  events: any[];
  getWeekEvents: (day: Date) => any[];
  getEventColor: (tag: string) => string;
  onTimeSlotClick: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ 
  weekDays, 
  events, 
  getWeekEvents, 
  getEventColor,
  onTimeSlotClick
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create hour labels with AM/PM
  const hourLabels = useMemo(() => 
    hours.map(hour => {
      return format(setHours(new Date(), hour), 'h a');
    }), 
    []
  );

  // Determine if a day is today
  const isToday = (day: Date) => {
    return isSameDay(day, new Date());
  };

  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    const clickedDate = setMinutes(setHours(day, hour), minute);
    onTimeSlotClick(clickedDate);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with days */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-16 border-r"></div> {/* Spacer for time column */}
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={`flex-1 text-center p-2 ${isToday(day) ? 'bg-blue-100' : ''}`}
          >
            <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-600'}`}>
              {format(day, 'EEE')}
            </div>
            <div 
              className={`text-2xl font-bold ${
                isToday(day) ? 'text-blue-600 bg-blue-100' : 'text-gray-800'
              } rounded-full w-10 h-10 flex items-center justify-center mx-auto`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="flex h-full overflow-y-auto border-b">
        {/* Time column */}
        <div className="w-16 h-full bg-white z-10">
          {hourLabels.map((label, index) => (
            <div 
              key={label} 
              className="h-12 border-b border-r flex items-start justify-center text-xs text-gray-500 pt-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="flex-1 relative" style={{ minWidth: `calc(100% - 4rem)` }}>
          <div className="absolute top-0 left-0 right-0 grid grid-cols-7" style={{ minHeight: '100%' }}>
            {weekDays.map((day) => (
              <div 
                key={day.toString()} 
                className="border-r last:border-r-0"
              >
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-12 border-b last:border-b-0 relative"
                  >
                    {Array.from({ length: 4 }).map((_, quarterIndex) => (
                      <div
                        key={quarterIndex}
                        className="absolute w-full cursor-pointer hover:bg-gray-100"
                        style={{
                          height: '25%',
                          top: `${quarterIndex * 25}%`
                        }}
                        onClick={() => handleTimeSlotClick(day, hour, quarterIndex * 15)}
                      ></div>
                    ))}
                    {/* Event rendering */}
                    {getWeekEvents(day)
                      .filter(event => {
                        const eventStart = parseISO(event.datetime);
                        return (
                          isSameDay(eventStart, day) && 
                          eventStart.getHours() === hour
                        );
                      })
                      .map((event) => {
                        const eventStart = parseISO(event.datetime);
                        const eventEnd = addMinutes(eventStart, 60); // Assuming 1-hour events
                        const topPercentage = (eventStart.getMinutes() / 60) * 100;
                        const heightPercentage = ((eventEnd.getTime() - eventStart.getTime()) / (60 * 60 * 1000)) * 100;
                        
                        return (
                          <div
                            key={event._id}
                            className={`absolute left-0 right-1 rounded-sm ${getEventColor(event.tag)} text-white`}
                            style={{
                              top: `${topPercentage}%`,
                              height: `${heightPercentage}%`,
                              zIndex: 10,
                              fontSize: '0.75rem',
                              padding: '0.25rem',
                              overflow: 'hidden'
                            }}
                          >
                            <div className="font-semibold truncate">{event.name}</div>
                            <div className="text-xs truncate">
                              {format(eventStart, 'h:mm a')}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};