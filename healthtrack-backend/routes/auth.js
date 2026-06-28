import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  otpRequest, 
  otpVerify, 
  setup2FA, 
  verify2FA, 
  login2FA, 
  refresh, 
  logout 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidator, loginValidator } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// OTP routes
router.post('/otp/request', otpRequest);
router.post('/otp/verify', otpVerify);

// Two-Factor Authentication routes
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/login', login2FA);

// Session routes
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
