import React from 'react';
import { format, addHours } from 'date-fns';
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
  endTime: Date;
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
  handleCreateEvent 
}) => {
  // Automatically set end time to 1 hour after start time if not set
  const handleStartTimeChange = (newStartTime: Date) => {
    setNewEvent(prev => ({
      ...prev,
      startTime: newStartTime,
      endTime: addHours(newStartTime, 1)
    }));
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogDescription>
          Fill in the details for your new event here.
        </DialogDescription> </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startDateTime" className="text-right">
            Start
          </Label>
          <Input
            id="startDateTime"
            type="datetime-local"
            value={format(newEvent.startTime, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => handleStartTimeChange(new Date(e.target.value))}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endDateTime" className="text-right">
            End
          </Label>
          <Input
            id="endDateTime"
            type="datetime-local"
            value={format(newEvent.endTime, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => setNewEvent({ ...newEvent, endTime: new Date(e.target.value) })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="meetingLink" className="text-right">
            Meeting Link
          </Label>
          <Input
            id="meetingLink"
            value={newEvent.meetingLink}
            onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tag" className="text-right">
            Tag
          </Label>
          <Select
            value={newEvent.tag}
            onValueChange={(value) => setNewEvent({ ...newEvent, tag: value })}
          >
            <SelectTrigger className="col-span-3">
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
        <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
      </DialogFooter>
    </DialogContent>
  );
};