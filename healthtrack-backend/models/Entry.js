import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['weight', 'workout', 'meal']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Weight entry fields
  weightKg: {
    type: Number,
    min: 10,
    max: 500
  },
  // Workout entry fields
  workoutType: {
    type: String
  },
  durationMin: {
    type: Number,
    min: 0
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  // Meal entry fields
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  caloriesConsumed: {
    type: Number,
    min: 0
  },
  // Location tracking fields
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // [longitude, latitude]
    }
  },
  placeName: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
entrySchema.index({ location: '2dsphere' });
entrySchema.index({ user: 1, date: -1 });

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
