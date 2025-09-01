const Driver = require('../models/Driver');
const Company = require('../models/Company');

class DriverController {
  /**
   * Get driver profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await Driver.getProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Driver profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: { profile }
      });
    } catch (error) {
      console.error('Get driver profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get driver profile',
        code: 'GET_PROFILE_ERROR'
      });
    }
  }

  /**
   * Update driver profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const updatedProfile = await Driver.updateProfile(userId, updateData);

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Driver profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile: updatedProfile }
      });
    } catch (error) {
      console.error('Update driver profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update driver profile',
        code: 'UPDATE_PROFILE_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Search drivers (for companies)
   */
  static async searchDrivers(req, res) {
    try {
      const {
        location,
        vehicleType,
        minExperience,
        maxExperience,
        minRating,
        search,
        page = 1,
        limit = 10
      } = req.query;

      const filters = {
        location,
        vehicleType,
        minExperience: minExperience ? parseInt(minExperience) : undefined,
        maxExperience: maxExperience ? parseInt(maxExperience) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        search,
        availabilityStatus: 'available'
      };

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await Driver.search(filters, pagination);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Search drivers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search drivers',
        code: 'SEARCH_DRIVERS_ERROR'
      });
    }
  }

  /**
   * Get driver statistics
   */
  static async getStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await Driver.getStats(userId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Driver profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Get driver stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get driver statistics',
        code: 'GET_STATS_ERROR'
      });
    }
  }

  /**
   * Toggle driver availability
   */
  static async toggleAvailability(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.body;

      const updatedProfile = await Driver.toggleAvailability(userId, status);

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Driver profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'Availability status updated successfully',
        data: { 
          profile: updatedProfile,
          availabilityStatus: updatedProfile.availability_status
        }
      });
    } catch (error) {
      console.error('Toggle availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update availability status',
        code: 'TOGGLE_AVAILABILITY_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get driver reviews
   */
  static async getReviews(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await Driver.getReviews(userId, pagination);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get driver reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get driver reviews',
        code: 'GET_REVIEWS_ERROR'
      });
    }
  }

  /**
   * Get nearby drivers (public endpoint with optional auth)
   */
  static async getNearbyDrivers(req, res) {
    try {
      const { location, radius = 50, limit = 10 } = req.query;

      if (!location) {
        return res.status(400).json({
          success: false,
          message: 'Location parameter is required',
          code: 'LOCATION_REQUIRED'
        });
      }

      const drivers = await Driver.getNearby(location, parseInt(radius), parseInt(limit));

      res.json({
        success: true,
        data: { drivers }
      });
    } catch (error) {
      console.error('Get nearby drivers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get nearby drivers',
        code: 'GET_NEARBY_DRIVERS_ERROR'
      });
    }
  }

  /**
   * Contact driver (for companies - records contact and checks subscription)
   */
  static async contactDriver(req, res) {
    try {
      const companyUserId = req.user.id;
      const { driverId, contactMethod = 'platform' } = req.body;

      // Get company profile
      const companyProfile = await Company.getProfileByUserId(companyUserId);
      if (!companyProfile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'COMPANY_PROFILE_NOT_FOUND'
        });
      }

      // Check if company can contact driver
      const contactCheck = await Company.canContactDriver(companyUserId);
      if (!contactCheck.canContact) {
        return res.status(403).json({
          success: false,
          message: contactCheck.reason,
          code: 'CONTACT_LIMIT_EXCEEDED',
          data: {
            subscription_tier: contactCheck.subscription_tier,
            contacts_used: contactCheck.contacts_used,
            contact_limit: contactCheck.contact_limit
          }
        });
      }

      // Get driver profile to validate driver exists
      const driverProfile = await Driver.getProfileByUserId(driverId);
      if (!driverProfile) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found',
          code: 'DRIVER_NOT_FOUND'
        });
      }

      // Record the contact
      const contactResult = await Company.recordContact(
        companyProfile.id,
        driverProfile.id,
        contactMethod
      );

      res.json({
        success: true,
        message: 'Contact recorded successfully',
        data: {
          contact: contactResult.contact,
          remainingContacts: contactResult.remainingContacts,
          driver: {
            id: driverProfile.user_id,
            name: driverProfile.name,
            phone: driverProfile.phone,
            location: driverProfile.location
          }
        }
      });
    } catch (error) {
      console.error('Contact driver error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to contact driver',
        code: 'CONTACT_DRIVER_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get driver by ID (for companies to view driver details)
   */
  static async getDriverById(req, res) {
    try {
      const { driverId } = req.params;
      const profile = await Driver.getProfileByUserId(parseInt(driverId));

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found',
          code: 'DRIVER_NOT_FOUND'
        });
      }

      // Get driver reviews
      const reviews = await Driver.getReviews(parseInt(driverId), { page: 1, limit: 5 });

      res.json({
        success: true,
        data: {
          profile,
          recentReviews: reviews.reviews
        }
      });
    } catch (error) {
      console.error('Get driver by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get driver details',
        code: 'GET_DRIVER_ERROR'
      });
    }
  }

  /**
   * Get driver dashboard data
   */
  static async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      // Get profile and stats
      const [profile, stats, recentReviews] = await Promise.all([
        Driver.getProfileByUserId(userId),
        Driver.getStats(userId),
        Driver.getReviews(userId, { page: 1, limit: 3 })
      ]);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Driver profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: {
          profile,
          stats,
          recentReviews: recentReviews.reviews
        }
      });
    } catch (error) {
      console.error('Get driver dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data',
        code: 'GET_DASHBOARD_ERROR'
      });
    }
  }
}

module.exports = DriverController;
