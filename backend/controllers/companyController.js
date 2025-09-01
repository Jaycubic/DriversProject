const Company = require('../models/Company');
const Driver = require('../models/Driver');

class CompanyController {
  /**
   * Get company profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await Company.getProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: { profile }
      });
    } catch (error) {
      console.error('Get company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get company profile',
        code: 'GET_PROFILE_ERROR'
      });
    }
  }

  /**
   * Update company profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const updatedProfile = await Company.updateProfile(userId, updateData);

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile: updatedProfile }
      });
    } catch (error) {
      console.error('Update company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update company profile',
        code: 'UPDATE_PROFILE_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get company dashboard statistics
   */
  static async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const [profile, stats, contactHistory] = await Promise.all([
        Company.getProfileByUserId(userId),
        Company.getDashboardStats(userId),
        Company.getContactHistory(userId, { page: 1, limit: 5 })
      ]);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: {
          profile,
          stats,
          recentContacts: contactHistory.contacts
        }
      });
    } catch (error) {
      console.error('Get company dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data',
        code: 'GET_DASHBOARD_ERROR'
      });
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await Company.getSubscriptionStats(userId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Get subscription stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription statistics',
        code: 'GET_SUBSCRIPTION_STATS_ERROR'
      });
    }
  }

  /**
   * Upgrade subscription
   */
  static async upgradeSubscription(req, res) {
    try {
      const userId = req.user.id;
      const { tier } = req.body;

      const updatedProfile = await Company.upgradeSubscription(userId, tier);

      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'Subscription upgraded successfully',
        data: { profile: updatedProfile }
      });
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade subscription',
        code: 'UPGRADE_SUBSCRIPTION_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get contact history
   */
  static async getContactHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await Company.getContactHistory(userId, pagination);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get contact history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contact history',
        code: 'GET_CONTACT_HISTORY_ERROR'
      });
    }
  }

  /**
   * Contact driver (record contact and check subscription limits)
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
            location: driverProfile.location,
            experience: driverProfile.experience
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
   * Check contact availability (before showing contact button)
   */
  static async checkContactAvailability(req, res) {
    try {
      const userId = req.user.id;
      const contactCheck = await Company.canContactDriver(userId);

      res.json({
        success: true,
        data: contactCheck
      });
    } catch (error) {
      console.error('Check contact availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check contact availability',
        code: 'CHECK_CONTACT_AVAILABILITY_ERROR'
      });
    }
  }

  /**
   * Search drivers (with subscription-based access)
   */
  static async searchDrivers(req, res) {
    try {
      const userId = req.user.id;
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

      // Check if company has access to search (basic subscription check)
      const companyProfile = await Company.getProfileByUserId(userId);
      if (!companyProfile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'COMPANY_PROFILE_NOT_FOUND'
        });
      }

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

      // Add subscription info to response
      const subscriptionInfo = {
        tier: companyProfile.subscription_tier,
        contacts_used: companyProfile.contacts_used,
        contact_limit: companyProfile.contact_limit,
        remaining_contacts: companyProfile.contact_limit - companyProfile.contacts_used
      };

      res.json({
        success: true,
        data: {
          ...result,
          subscription: subscriptionInfo
        }
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
   * Get driver details (for company to view before contacting)
   */
  static async getDriverDetails(req, res) {
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
      const reviews = await Driver.getReviews(parseInt(driverId), { page: 1, limit: 10 });

      res.json({
        success: true,
        data: {
          profile,
          reviews: reviews.reviews,
          reviewsPagination: reviews.pagination
        }
      });
    } catch (error) {
      console.error('Get driver details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get driver details',
        code: 'GET_DRIVER_DETAILS_ERROR'
      });
    }
  }

  /**
   * Get company analytics/insights
   */
  static async getAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const { period = '30' } = req.query; // days

      // This would typically involve more complex analytics queries
      // For now, we'll return basic stats
      const stats = await Company.getDashboardStats(userId);
      const subscriptionStats = await Company.getSubscriptionStats(userId);

      if (!stats || !subscriptionStats) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: {
          period: parseInt(period),
          subscription: subscriptionStats,
          activity: {
            jobs_posted: stats.jobs.total,
            active_jobs: stats.jobs.active,
            contacts_made: stats.contacts.total,
            recent_contacts: stats.contacts.this_week
          },
          trends: {
            // Placeholder for trend data - would be calculated from historical data
            contact_growth: 0,
            job_completion_rate: 0
          }
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics data',
        code: 'GET_ANALYTICS_ERROR'
      });
    }
  }
}

module.exports = CompanyController;
