import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 1,
    max: 150
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  heightCm: {
    type: Number,
    min: 50,
    max: 300
  },
  weightKg: {
    type: Number,
    min: 10,
    max: 500
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']
  },
  locationSharingEnabled: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  otpCode: String,
  otpExpires: Date,
  refreshToken: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  healthScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
