import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  goalType: {
    type: String,
    required: true,
    enum: ['targetWeight', 'weeklyWorkouts']
  },
  value: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  achieved: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

