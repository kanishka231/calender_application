import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NewEvent {
  name: string;
  description: string;
  startTime: Date;
  duration: number;
  tag: string;
  meetingLink: string;
}

interface EventDialogProps {
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  handleCreateEvent: () => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  newEvent,
  setNewEvent,
  handleCreateEvent,
}) => {
  // State for separate date and time
  const [date, setDate] = useState(format(newEvent.startTime, 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(newEvent.startTime, 'hh:mm'));
  const [meridiem, setMeridiem] = useState(format(newEvent.startTime, 'a'));

  // Update state when newEvent changes
  useEffect(() => {
    setDate(format(newEvent.startTime, 'yyyy-MM-dd'));
    setTime(format(newEvent.startTime, 'hh:mm'));
    setMeridiem(format(newEvent.startTime, 'a'));
  }, [newEvent.startTime]);

  // Update start time when date, time, or meridiem changes
  const updateStartTime = (newDate?: string, newTime?: string, newMeridiem?: string) => {
    const currentDate = newDate || date;
    const currentTime = newTime || time;
    const currentMeridiem = newMeridiem || meridiem;

    // Combine date and time with AM/PM
    const combinedDateTime = parse(
      `${currentDate} ${currentTime} ${currentMeridiem}`, 
      'yyyy-MM-dd hh:mm a', 
      new Date()
    );

    setNewEvent((prev) => ({
      ...prev,
      startTime: combinedDateTime,
    }));

    // Update state
    setDate(currentDate);
    setTime(currentTime);
    setMeridiem(currentMeridiem);
  };

  const handleDurationChange = (newDuration: string) => {
    setNewEvent((prev) => ({
      ...prev,
      duration: parseInt(newDuration, 10) || 0,
    }));
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-blue-50">
      <DialogHeader>
        <DialogTitle className="text-blue-900 font-bold">Create New Event</DialogTitle>
        <DialogDescription className="text-blue-700">
          Fill in the details for your new event here.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Name Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-blue-900 font-semibold">
            Name
          </Label>
          <Input
            id="name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Event Name"
          />
        </div>

        {/* Description Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right text-blue-900 font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Event Description"
          />
        </div>

        {/* Date Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDate" className="text-right text-blue-900 font-semibold">
            Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={date}
            onChange={(e) => updateStartTime(e.target.value)}
            className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Input with AM/PM */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startTime" className="text-right text-blue-900 font-semibold">
            Time
          </Label>
          <div className="col-span-3 flex space-x-2">
            <Input
              id="startTime"
              type="time"
              value={time}
              onChange={(e) => updateStartTime(undefined, e.target.value)}
              className="flex-grow border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Select 
              value={meridiem}
              onValueChange={(value) => updateStartTime(undefined, undefined, value)}
            >
              <SelectTrigger className="w-[100px] border-blue-300 text-blue-900">
                <SelectValue>{meridiem}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duration" className="text-right text-blue-900 font-semibold">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            value={newEvent.duration}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            placeholder="Event Duration"
          />
        </div>

        {/* Meeting Link Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="meetingLink" className="text-right text-blue-900 font-semibold">
            Meeting Link
          </Label>
          <Input
            id="meetingLink"
            value={newEvent.meetingLink}
            onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
            className="col-span-3 border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional Meeting URL"
          />
        </div>

        {/* Tag Selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tag" className="text-right text-blue-900 font-semibold">
            Tag
          </Label>
          <Select
            value={newEvent.tag}
            onValueChange={(value) => setNewEvent({ ...newEvent, tag: value })}
          >
            <Select/>
<SelectTrigger className="col-span-3 border-blue-300 text-blue-900">
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit" 
          onClick={handleCreateEvent}
          className="bg-blue-900 hover:bg-blue-800 focus:ring-blue-500"
        >
          Create Event
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};