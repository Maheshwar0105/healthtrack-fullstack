import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Entry from '../models/Entry.js';
import User from '../models/User.js';

dotenv.config();

describe('Entry Location Features', () => {
  let testUser;
  let testEntry;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthtrack-test');
    
    // Create or get test user
    testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashedpassword'
      });
    }
  });

  afterAll(async () => {
    await Entry.deleteMany({ user: testUser._id });
    await mongoose.connection.close();
  });

  test('should create entry with location', async () => {
    const entryData = {
      user: testUser._id,
      type: 'workout',
      workoutType: 'Running',
      durationMin: 30,
      caloriesBurned: 300,
      location: {
        type: 'Point',
        coordinates: [-73.9851, 40.7580] // Times Square
      },
      placeName: 'Times Square'
    };

    const entry = await Entry.create(entryData);
    expect(entry.location).toBeDefined();
    expect(entry.location.coordinates).toEqual([-73.9851, 40.7580]);
    expect(entry.placeName).toBe('Times Square');
    testEntry = entry;
  });

  test('should find nearby entries', async () => {
    // Create another entry nearby
    await Entry.create({
      user: testUser._id,
      type: 'meal',
      mealType: 'lunch',
      caloriesConsumed: 500,
      location: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484] // Empire State Building (close to Times Square)
      },
      placeName: 'Empire State Building'
    });

    // Find entries within 5km of Times Square
    const nearby = await Entry.find({
      user: testUser._id,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-73.9851, 40.7580]
          },
          $maxDistance: 5000
        }
      }
    });

    expect(nearby.length).toBeGreaterThan(0);
  });

  test('should validate location coordinates', async () => {
    const invalidEntry = {
      user: testUser._id,
      type: 'workout',
      location: {
        type: 'Point',
        coordinates: [200, 100] // Invalid coordinates
      }
    };

    await expect(Entry.create(invalidEntry)).rejects.toThrow();
  });
});

