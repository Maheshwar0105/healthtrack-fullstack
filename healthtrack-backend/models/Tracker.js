import mongoose from 'mongoose';

const trackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  points: [{
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true // [lng, lat]
      }
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    altitude: Number,
    accuracy: Number,
    speed: Number
  }],
  totalDistance: {
    type: Number,
    default: 0 // in meters
  },
  duration: {
    type: Number,
    default: 0 // in seconds
  }
}, {
  timestamps: true
});

trackerSchema.index({ location: '2dsphere' });
trackerSchema.index({ user: 1, startTime: -1 });
trackerSchema.index({ sessionId: 1 });

const Tracker = mongoose.model('Tracker', trackerSchema);

export default Tracker;

