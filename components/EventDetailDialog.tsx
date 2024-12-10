import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface EventDetailsDialogProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>
            {format(new Date(event.startTime), 'MMMM d, yyyy h:mm a')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">{event.description}</p>
          {event.meetingLink && (
            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
              Join meeting
            </a>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

