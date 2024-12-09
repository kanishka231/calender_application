import mongoose, { Schema, model, models } from 'mongoose';

const eventSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: false,
  },
  tag: {
    type: String,
    enum: ['work', 'personal', 'others'],
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  meetingLink: {
    type: String,
    required: false
  },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none'
  },
  location: {
    type: String,
    required: false
  },
  isAllDay: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Add an index to improve query performance
eventSchema.index({ userId: 1, startTime: 1, endTime: 1 });

// Validation to ensure end time is after start time
eventSchema.pre('validate', function(next) {
  if (this.startTime && this.endTime && this.startTime > this.endTime) {
    next(new Error('End time must be after start time'));
  }
  
  // Calculate duration if not provided
  if (this.startTime && this.endTime && !this.duration) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / 60000);
  }
  
  next();
});

const Event = models.Event || model('Event', eventSchema);

export default Event;
