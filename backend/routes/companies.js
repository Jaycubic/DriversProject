const express = require('express');
const CompanyController = require('../controllers/companyController');
const { validate, validationRules, contactLimiter } = require('../middleware/security');
const { requireCompany, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/companies/profile
 * @desc    Get company profile
 * @access  Private (Company only)
 */
router.get('/profile', requireCompany, CompanyController.getProfile);

/**
 * @route   PUT /api/companies/profile
 * @desc    Update company profile
 * @access  Private (Company only)
 */
router.put('/profile',
  requireCompany,
  validate(validationRules.companyProfile),
  CompanyController.updateProfile
);

/**
 * @route   GET /api/companies/dashboard
 * @desc    Get company dashboard data
 * @access  Private (Company only)
 */
router.get('/dashboard', requireCompany, CompanyController.getDashboard);

/**
 * @route   GET /api/companies/subscription
 * @desc    Get subscription statistics
 * @access  Private (Company only)
 */
router.get('/subscription', requireCompany, CompanyController.getSubscriptionStats);

/**
 * @route   PUT /api/companies/subscription/upgrade
 * @desc    Upgrade subscription
 * @access  Private (Company only)
 */
router.put('/subscription/upgrade',
  requireCompany,
  validate([
    require('express-validator').body('tier')
      .isIn(['free', 'pro', 'premium'])
      .withMessage('Tier must be free, pro, or premium')
  ]),
  CompanyController.upgradeSubscription
);

/**
 * @route   GET /api/companies/contacts
 * @desc    Get contact history
 * @access  Private (Company only)
 */
router.get('/contacts', requireCompany, CompanyController.getContactHistory);

/**
 * @route   POST /api/companies/contact-driver
 * @desc    Contact driver (record contact and check subscription)
 * @access  Private (Company only)
 */
router.post('/contact-driver',
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
  CompanyController.contactDriver
);

/**
 * @route   GET /api/companies/contact-availability
 * @desc    Check contact availability
 * @access  Private (Company only)
 */
router.get('/contact-availability', requireCompany, CompanyController.checkContactAvailability);

/**
 * @route   GET /api/companies/search-drivers
 * @desc    Search drivers with subscription-based access
 * @access  Private (Company only)
 */
router.get('/search-drivers', requireCompany, CompanyController.searchDrivers);

/**
 * @route   GET /api/companies/driver/:driverId
 * @desc    Get driver details
 * @access  Private (Company only)
 */
router.get('/driver/:driverId', requireCompany, CompanyController.getDriverDetails);

/**
 * @route   GET /api/companies/analytics
 * @desc    Get company analytics
 * @access  Private (Company only)
 */
router.get('/analytics', requireCompany, CompanyController.getAnalytics);

/**
 * @route   GET /api/companies/search
 * @desc    Search companies (admin only)
 * @access  Private (Admin only)
 */
router.get('/search', requireAdmin, async (req, res) => {
  try {
    const {
      subscriptionTier,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {
      subscriptionTier,
      search
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const Company = require('../models/Company');
    const result = await Company.search(filters, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search companies',
      code: 'SEARCH_COMPANIES_ERROR'
    });
  }
});

module.exports = router;
