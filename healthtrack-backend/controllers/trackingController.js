import Tracker from '../models/Tracker.js';
import crypto from 'crypto';
import { emitLocationUpdate } from '../socket.js';

export const createSession = async (req, res) => {
  try {
    const sessionId = crypto.randomUUID();
    const tracker = await Tracker.create({
      user: req.user._id,
      sessionId,
      startTime: new Date(),
      isActive: true
    });

    res.status(201).json({
      sessionId: tracker.sessionId,
      startTime: tracker.startTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPoint = async (req, res) => {
  try {
    const { sessionId, location, altitude, accuracy, speed } = req.body;

    if (!sessionId || !location || !location.coordinates) {
      return res.status(400).json({ message: 'Session ID and location coordinates are required' });
    }

    const [lng, lat] = location.coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number' ||
        lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const tracker = await Tracker.findOne({
      sessionId,
      user: req.user._id,
      isActive: true
    });

    if (!tracker) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    const point = {
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      timestamp: new Date(),
      ...(altitude && { altitude }),
      ...(accuracy && { accuracy }),
      ...(speed && { speed })
    };

    tracker.points.push(point);

    // Calculate distance if we have previous point
    if (tracker.points.length > 1) {
      const prevPoint = tracker.points[tracker.points.length - 2];
      const distance = calculateDistance(
        prevPoint.location.coordinates[1],
        prevPoint.location.coordinates[0],
        lat,
        lng
      );
      tracker.totalDistance += distance;
    }

    tracker.duration = Math.floor((new Date() - tracker.startTime) / 1000);
    await tracker.save();

    // Emit real-time location update to Socket.io subscribers
    emitLocationUpdate(sessionId, {
      point,
      pointCount: tracker.points.length,
      totalDistance: tracker.totalDistance,
      duration: tracker.duration
    });

    res.json({
      pointCount: tracker.points.length,
      totalDistance: tracker.totalDistance,
      duration: tracker.duration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const tracker = await Tracker.findOne({
      sessionId,
      user: req.user._id,
      isActive: true
    });

    if (!tracker) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    tracker.isActive = false;
    tracker.endTime = new Date();
    tracker.duration = Math.floor((tracker.endTime - tracker.startTime) / 1000);
    await tracker.save();

    res.json({
      sessionId: tracker.sessionId,
      totalPoints: tracker.points.length,
      totalDistance: tracker.totalDistance,
      duration: tracker.duration,
      endTime: tracker.endTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const tracker = await Tracker.findOne({
      sessionId,
      user: req.user._id
    });

    if (!tracker) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(tracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

