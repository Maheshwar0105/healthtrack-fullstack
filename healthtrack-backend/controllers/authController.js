import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendMail } from '../config/mailer.js';

// Token generation helpers
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Set cookie helper
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, heightCm, weightKg, activityLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name,
      email,
      passwordHash,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
    await sendMail({
      to: user.email,
      subject: 'Verify your HealthTrack account',
      text: `Welcome to HealthTrack! Please verify your email by clicking: ${verifyUrl}`,
      html: `<h3>Welcome to HealthTrack!</h3><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">Verify Email</a>`
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        activityLevel: user.activityLevel,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If 2FA enabled, stop here and request 2FA verification code
    if (user.twoFactorEnabled) {
      return res.json({
        require2FA: true,
        userId: user._id,
        message: 'Two-Factor Authentication is enabled. Please provide verification code.'
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        activityLevel: user.activityLevel,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'No verification token provided' });

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can close this tab.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendMail({
      to: user.email,
      subject: 'Reset Password - HealthTrack',
      text: `You requested a password reset. Reset your password by visiting: ${resetUrl}`,
      html: `<p>You requested a password reset. Click below to proceed:</p><a href="${resetUrl}">Reset Password</a>`
    });

    res.json({ message: 'Password reset instructions have been emailed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const otpRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found' });

    // Generate 6 digit numeric code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Login Verification OTP - HealthTrack',
      text: `Your temporary login code is: ${otpCode}. It will expire in 5 minutes.`,
      html: `<h2>HealthTrack Login OTP</h2><p>Use the following code to sign in to your dashboard:</p><h3>${otpCode}</h3>`
    });

    res.json({ message: 'OTP verification code has been emailed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const otpVerify = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    const user = await User.findOne({
      email,
      otpCode: code,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP code' });

    user.otpCode = undefined;
    user.otpExpires = undefined;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        activityLevel: user.activityLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId || req.user?._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'HealthTrackPro', secret);
    const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

    user.twoFactorSecret = secret;
    await user.save();

    res.json({
      secret,
      qrDataUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA token' });

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: 'Two-factor authentication enabled successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!userId || !token) return res.status(400).json({ message: 'User ID and verification token are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) return res.status(401).json({ message: 'Invalid 2FA token' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        activityLevel: user.activityLevel,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (!cookieToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(cookieToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== cookieToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user._id);
    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Token refresh failed' });
  }
};

export const logout = async (req, res) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (cookieToken) {
      const decoded = jwt.verify(cookieToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
