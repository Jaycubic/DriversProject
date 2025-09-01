const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

/**
 * Rate limiting configurations
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General API rate limiter
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later'
);

// Strict rate limiter for auth endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later'
);

// Contact rate limiter for driver contact endpoints
const contactLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  50, // limit each IP to 50 contacts per hour
  'Too many contact requests, please try again later'
);

/**
 * Helmet security configuration
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * Validation middleware factory
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ 
      field: err.path || err.param, 
      message: err.msg,
      value: err.value 
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: extractedErrors
    });
  };
};

/**
 * Common validation rules
 */
const validationRules = {
  // User registration validation
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('role')
      .isIn(['driver', 'company'])
      .withMessage('Role must be either driver or company'),
    body('phone')
      .optional()
      .isMobilePhone('en-IN')
      .withMessage('Please provide a valid Indian phone number')
  ],

  // User login validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Driver profile validation
  driverProfile: [
    body('experience')
      .isInt({ min: 0, max: 50 })
      .withMessage('Experience must be between 0 and 50 years'),
    body('location')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters'),
    body('vehicleTypes')
      .isArray({ min: 1 })
      .withMessage('At least one vehicle type must be selected'),
    body('vehicleTypes.*')
      .isIn(['bus', 'cargo_truck', 'delivery_van', 'heavy_vehicle', 'container_truck', 'tourist_bus'])
      .withMessage('Invalid vehicle type'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters')
  ],

  // Company profile validation
  companyProfile: [
    body('companyName')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Company name must be between 2 and 200 characters'),
    body('registrationNumber')
      .optional()
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage('Registration number must be between 5 and 50 characters'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Address must not exceed 500 characters')
  ],

  // Job posting validation
  jobPosting: [
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Job title must be between 5 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Job description must be between 20 and 2000 characters'),
    body('route')
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Route must be between 5 and 500 characters'),
    body('salary')
      .isFloat({ min: 0 })
      .withMessage('Salary must be a positive number'),
    body('requirements')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Requirements must not exceed 1000 characters')
  ],

  // Review validation
  review: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Comment must not exceed 1000 characters')
  ]
};

/**
 * Error handling middleware for validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  contactLimiter,
  securityHeaders,
  validate,
  validationRules,
  handleValidationErrors
};
