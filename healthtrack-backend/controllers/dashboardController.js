import Entry from '../models/Entry.js';
import Goal from '../models/Goal.js';

export const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntries = await Entry.find({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    const caloriesConsumed = todayEntries
      .filter(e => e.type === 'meal')
      .reduce((sum, e) => sum + (e.caloriesConsumed || 0), 0);

    const caloriesBurned = todayEntries
      .filter(e => e.type === 'workout')
      .reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);

    const workoutCount = todayEntries.filter(e => e.type === 'workout').length;

    const latestWeight = await Entry.findOne({
      user: req.user._id,
      type: 'weight'
    }).sort({ date: -1 });

    res.json({
      caloriesConsumed,
      caloriesBurned,
      netCalories: caloriesConsumed - caloriesBurned,
      workoutCount,
      latestWeight: latestWeight?.weightKg || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { metric, from, to } = req.query;
    
    if (!metric) {
      return res.status(400).json({ message: 'Metric parameter is required' });
    }

    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    if (metric === 'weight') {
      const entries = await Entry.find({
        user: req.user._id,
        type: 'weight',
        date: { $gte: fromDate, $lte: toDate }
      }).sort({ date: 1 });

      const data = entries.map(e => ({
        date: e.date.toISOString().split('T')[0],
        value: e.weightKg
      }));

      res.json({ metric: 'weight', data });
    } else if (metric === 'calories') {
      const entries = await Entry.find({
        user: req.user._id,
        type: { $in: ['meal', 'workout'] },
        date: { $gte: fromDate, $lte: toDate }
      }).sort({ date: 1 });

      const dailyData = {};
      entries.forEach(e => {
        const date = e.date.toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = { consumed: 0, burned: 0 };
        }
        if (e.type === 'meal') {
          dailyData[date].consumed += e.caloriesConsumed || 0;
        } else if (e.type === 'workout') {
          dailyData[date].burned += e.caloriesBurned || 0;
        }
      });

      const data = Object.entries(dailyData).map(([date, values]) => ({
        date,
        consumed: values.consumed,
        burned: values.burned,
        net: values.consumed - values.burned
      }));

      res.json({ metric: 'calories', data });
    } else {
      res.status(400).json({ message: 'Invalid metric. Use "weight" or "calories"' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMapData = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const entries = await Entry.find({
      user: req.user._id,
      location: { $exists: true, $ne: null },
      date: { $gte: fromDate, $lte: toDate }
    }).select('location placeName type date').sort({ date: -1 });

    const mapPoints = entries.map(e => ({
      coordinates: e.location.coordinates,
      placeName: e.placeName,
      type: e.type,
      date: e.date
    }));

    res.json({ points: mapPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
