import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return standard error message structure matching client expects
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('age').optional({ checkFalsy: true }).isInt({ min: 1, max: 120 }).withMessage('Age must be a valid integer between 1 and 120'),
  body('gender').optional({ checkFalsy: true }).isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('heightCm').optional({ checkFalsy: true }).isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weightKg').optional({ checkFalsy: true }).isFloat({ min: 10, max: 500 }).withMessage('Weight must be between 10 and 500 kg'),
  body('activityLevel').optional({ checkFalsy: true }).isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']).withMessage('Invalid activity level'),
  handleValidationErrors
];

export const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];
