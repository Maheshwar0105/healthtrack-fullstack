import Entry from '../models/Entry.js';
import { body, validationResult } from 'express-validator';

// Validation rules
export const validateEntry = [
  body('type').isIn(['weight', 'workout', 'meal']).withMessage('Invalid entry type'),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [lng, lat]'),
  body('location.coordinates.*').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid coordinate value'),
  body('weightKg').optional().isFloat({ min: 10, max: 500 }).withMessage('Weight must be between 10 and 500 kg'),
  body('caloriesBurned').optional().isInt({ min: 0 }).withMessage('Calories burned must be non-negative'),
  body('caloriesConsumed').optional().isInt({ min: 0 }).withMessage('Calories consumed must be non-negative')
];

export const getEntries = async (req, res) => {
  try {
    const { type, lat, lng, radiusMeters } = req.query;
    const query = { user: req.user._id };
    
    if (type) {
      query.type = type;
    }

    // If location query params provided, add geospatial filter
    if (lat && lng && radiusMeters) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radius = parseFloat(radiusMeters) || 5000; // default 5km

      if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }

      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lngNum, latNum]
          },
          $maxDistance: radius
        }
      };
    }
    
    const entries = await Entry.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNearbyEntries = async (req, res) => {
  try {
    const { lat, lng, radiusMeters = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radius = parseFloat(radiusMeters);

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const entries = await Entry.find({
      user: req.user._id,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lngNum, latNum]
          },
          $maxDistance: radius
        }
      }
    }).sort({ date: -1 }).limit(50);

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entryData = {
      ...req.body,
      user: req.user._id
    };

    // Normalize location coordinates if provided
    if (entryData.location && entryData.location.coordinates) {
      const [lng, lat] = entryData.location.coordinates;
      if (typeof lng === 'number' && typeof lat === 'number' && 
          lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
        entryData.location = {
          type: 'Point',
          coordinates: [lng, lat]
        };
      } else {
        return res.status(400).json({ message: 'Invalid location coordinates' });
      }
    }
    
    const entry = await Entry.create(entryData);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await Entry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Handle location update
    if (req.body.location && req.body.location.coordinates) {
      const [lng, lat] = req.body.location.coordinates;
      if (typeof lng === 'number' && typeof lat === 'number' && 
          lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
        req.body.location = {
          type: 'Point',
          coordinates: [lng, lat]
        };
      } else {
        return res.status(400).json({ message: 'Invalid location coordinates' });
      }
    }
    
    const updatedEntry = await Entry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
