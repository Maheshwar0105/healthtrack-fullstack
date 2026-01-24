import User from '../models/User.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      activityLevel: user.activityLevel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { name, age, gender, heightCm, weightKg, activityLevel } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(heightCm && { heightCm }),
        ...(weightKg && { weightKg }),
        ...(activityLevel && { activityLevel })
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      activityLevel: user.activityLevel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

