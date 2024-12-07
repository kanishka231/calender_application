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
  datetime: {
    type: Date,
    required: true,
  },
  tag: {
    type: String,
    enum: ['work', 'personal', 'others'], // You can customize this
    required: true,
  },
});

const Event = models.Event || model('Event', eventSchema);

export default Event;
