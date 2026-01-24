import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Entry from '../models/Entry.js';
import User from '../models/User.js';

dotenv.config();

const sampleLocations = [
  { name: 'Central Park', coords: [-73.9654, 40.7829] },
  { name: 'Times Square', coords: [-73.9851, 40.7580] },
  { name: 'Brooklyn Bridge', coords: [-73.9963, 40.7061] },
  { name: 'Empire State Building', coords: [-73.9857, 40.7484] },
  { name: 'Statue of Liberty', coords: [-74.0445, 40.6892] }
];

async function seedLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get first user or create a test user
    let user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      process.exit(1);
    }

    // Clear existing entries with locations
    await Entry.deleteMany({ user: user._id, location: { $exists: true } });
    console.log('Cleared existing location entries');

    // Create sample entries with locations
    const entries = [];
    const entryTypes = ['workout', 'meal', 'workout', 'meal', 'workout'];
    const workoutTypes = ['Running', 'Cycling', 'Walking'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    for (let i = 0; i < sampleLocations.length; i++) {
      const loc = sampleLocations[i];
      const type = entryTypes[i];
      const date = new Date();
      date.setDate(date.getDate() - i);

      const entryData = {
        user: user._id,
        type,
        date,
        location: {
          type: 'Point',
          coordinates: loc.coords
        },
        placeName: loc.name
      };

      if (type === 'workout') {
        entryData.workoutType = workoutTypes[i % workoutTypes.length];
        entryData.durationMin = 30 + Math.floor(Math.random() * 60);
        entryData.caloriesBurned = 200 + Math.floor(Math.random() * 400);
      } else if (type === 'meal') {
        entryData.mealType = mealTypes[i % mealTypes.length];
        entryData.caloriesConsumed = 300 + Math.floor(Math.random() * 500);
      }

      entries.push(entryData);
    }

    await Entry.insertMany(entries);
    console.log(`Created ${entries.length} entries with locations`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding locations:', error);
    process.exit(1);
  }
}

seedLocations();

