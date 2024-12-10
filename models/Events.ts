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
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: [1, 'Duration must be at least 1 minute'],
  },
  endTime: {
    type: Date,
    required: false, // Will be computed automatically
  },
  tag: {
    type: String,
    enum: ['work', 'personal', 'others'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  meetingLink: {
    type: String,
    required: false,
  },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'none',
  },
  location: {
    type: String,
    required: false,
  },
  isAllDay: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Add an index to improve query performance
eventSchema.index({ userId: 1, startTime: 1 });

// Middleware to calculate endTime based on startTime and duration
eventSchema.pre('validate', function(next) {
  if (this.startTime && this.duration) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60000);
  }
  
  next();
});

const Event = models.Event || model('Event', eventSchema);

export default Event;
