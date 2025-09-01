const express = require('express');
const DriverController = require('../controllers/driverController');
const { validate, validationRules, contactLimiter } = require('../middleware/security');
const { requireDriver, requireCompany, requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/drivers/profile
 * @desc    Get driver profile
 * @access  Private (Driver only)
 */
router.get('/profile', requireDriver, DriverController.getProfile);

/**
 * @route   PUT /api/drivers/profile
 * @desc    Update driver profile
 * @access  Private (Driver only)
 */
router.put('/profile',
  requireDriver,
  validate(validationRules.driverProfile),
  DriverController.updateProfile
);

/**
 * @route   GET /api/drivers/dashboard
 * @desc    Get driver dashboard data
 * @access  Private (Driver only)
 */
router.get('/dashboard', requireDriver, DriverController.getDashboard);

/**
 * @route   GET /api/drivers/stats
 * @desc    Get driver statistics
 * @access  Private (Driver only)
 */
router.get('/stats', requireDriver, DriverController.getStats);

/**
 * @route   PUT /api/drivers/availability
 * @desc    Toggle driver availability status
 * @access  Private (Driver only)
 */
router.put('/availability',
  requireDriver,
  validate([
    require('express-validator').body('status')
      .isIn(['available', 'busy', 'offline'])
      .withMessage('Status must be available, busy, or offline')
  ]),
  DriverController.toggleAvailability
);

/**
 * @route   GET /api/drivers/reviews
 * @desc    Get driver reviews
 * @access  Private (Driver only)
 */
router.get('/reviews', requireDriver, DriverController.getReviews);

/**
 * @route   GET /api/drivers/search
 * @desc    Search drivers (for companies)
 * @access  Private (Company only)
 */
router.get('/search', requireCompany, DriverController.searchDrivers);

/**
 * @route   GET /api/drivers/nearby
 * @desc    Get nearby drivers
 * @access  Public (with optional auth)
 */
router.get('/nearby', optionalAuth, DriverController.getNearbyDrivers);

/**
 * @route   GET /api/drivers/:driverId
 * @desc    Get driver details by ID
 * @access  Private (Company only)
 */
router.get('/:driverId', requireCompany, DriverController.getDriverById);

/**
 * @route   POST /api/drivers/contact
 * @desc    Contact driver (for companies)
 * @access  Private (Company only)
 */
router.post('/contact',
  requireCompany,
  contactLimiter,
  validate([
    require('express-validator').body('driverId')
      .isInt({ min: 1 })
      .withMessage('Valid driver ID is required'),
    require('express-validator').body('contactMethod')
      .optional()
      .isIn(['platform', 'whatsapp', 'phone', 'email'])
      .withMessage('Invalid contact method')
  ]),
  DriverController.contactDriver
);

module.exports = router;
