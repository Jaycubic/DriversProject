const pool = require('../config/database');

class Company {
  /**
   * Create company profile
   * @param {Number} userId - User ID
   * @param {Object} profileData - Company profile data
   * @returns {Object} Created company profile
   */
  static async createProfile(userId, profileData) {
    const {
      companyName,
      registrationNumber,
      address,
      subscriptionTier = 'free'
    } = profileData;

    // Set contact limits based on subscription tier
    const contactLimits = {
      free: 10,
      pro: 50,
      premium: 300
    };

    const query = `
      INSERT INTO company_profiles (
        user_id, company_name, registration_number, address,
        subscription_tier, contact_limit, contacts_used,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 0, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      userId,
      companyName,
      registrationNumber,
      address,
      subscriptionTier,
      contactLimits[subscriptionTier]
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get company profile by user ID
   * @param {Number} userId - User ID
   * @returns {Object|null} Company profile
   */
  static async getProfileByUserId(userId) {
    const query = `
      SELECT 
        cp.*,
        u.name,
        u.email,
        u.phone,
        u.is_verified,
        COUNT(j.id) as total_jobs_posted,
        COUNT(CASE WHEN j.status = 'active' THEN 1 END) as active_jobs
      FROM company_profiles cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN jobs j ON cp.id = j.company_id
      WHERE cp.user_id = $1 AND u.deleted_at IS NULL
      GROUP BY cp.id, u.name, u.email, u.phone, u.is_verified
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const profile = result.rows[0];
    profile.total_jobs_posted = parseInt(profile.total_jobs_posted);
    profile.active_jobs = parseInt(profile.active_jobs);

    return profile;
  }

  /**
   * Update company profile
   * @param {Number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated profile
   */
  static async updateProfile(userId, updateData) {
    const allowedFields = [
      'company_name', 'registration_number', 'address',
      'subscription_tier', 'contact_limit'
    ];
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE company_profiles 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Record driver contact (for subscription tracking)
   * @param {Number} companyId - Company profile ID
   * @param {Number} driverId - Driver profile ID
   * @param {String} contactMethod - Contact method used
   * @returns {Object} Contact record
   */
  static async recordContact(companyId, driverId, contactMethod = 'platform') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if company has remaining contacts
      const companyQuery = `
        SELECT contacts_used, contact_limit, subscription_tier
        FROM company_profiles 
        WHERE id = $1
      `;
      const companyResult = await client.query(companyQuery, [companyId]);
      
      if (companyResult.rows.length === 0) {
        throw new Error('Company not found');
      }

      const company = companyResult.rows[0];
      
      if (company.contacts_used >= company.contact_limit) {
        throw new Error('Contact limit exceeded. Please upgrade your subscription.');
      }

      // Record the contact
      const contactQuery = `
        INSERT INTO contact_history (company_id, driver_id, contact_method, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      const contactResult = await client.query(contactQuery, [companyId, driverId, contactMethod]);

      // Update company contacts used
      const updateQuery = `
        UPDATE company_profiles 
        SET contacts_used = contacts_used + 1, updated_at = NOW()
        WHERE id = $1
        RETURNING contacts_used, contact_limit
      `;
      const updateResult = await client.query(updateQuery, [companyId]);

      await client.query('COMMIT');

      return {
        contact: contactResult.rows[0],
        remainingContacts: updateResult.rows[0].contact_limit - updateResult.rows[0].contacts_used
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get contact history for company
   * @param {Number} userId - User ID
   * @param {Object} pagination - Pagination options
   * @returns {Object} Contact history with pagination
   */
  static async getContactHistory(userId, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Get company profile ID first
    const profileQuery = `SELECT id FROM company_profiles WHERE user_id = $1`;
    const profileResult = await pool.query(profileQuery, [userId]);
    
    if (profileResult.rows.length === 0) {
      return { contacts: [], pagination: { page, limit, total: 0, pages: 0 } };
    }

    const companyId = profileResult.rows[0].id;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM contact_history ch
      WHERE ch.company_id = $1
    `;
    const countResult = await pool.query(countQuery, [companyId]);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated contact history
    const query = `
      SELECT 
        ch.*,
        u.name as driver_name,
        u.phone as driver_phone,
        dp.location as driver_location,
        dp.experience as driver_experience
      FROM contact_history ch
      JOIN driver_profiles dp ON ch.driver_id = dp.id
      JOIN users u ON dp.user_id = u.id
      WHERE ch.company_id = $1
      ORDER BY ch.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [companyId, limit, offset]);

    return {
      contacts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Upgrade subscription
   * @param {Number} userId - User ID
   * @param {String} newTier - New subscription tier
   * @returns {Object} Updated profile
   */
  static async upgradeSubscription(userId, newTier) {
    const validTiers = ['free', 'pro', 'premium'];
    if (!validTiers.includes(newTier)) {
      throw new Error('Invalid subscription tier');
    }

    const contactLimits = {
      free: 10,
      pro: 50,
      premium: 300
    };

    const query = `
      UPDATE company_profiles 
      SET 
        subscription_tier = $1,
        contact_limit = $2,
        updated_at = NOW()
      WHERE user_id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [newTier, contactLimits[newTier], userId]);
    return result.rows[0];
  }

  /**
   * Get subscription statistics
   * @param {Number} userId - User ID
   * @returns {Object} Subscription stats
   */
  static async getSubscriptionStats(userId) {
    const query = `
      SELECT 
        cp.subscription_tier,
        cp.contacts_used,
        cp.contact_limit,
        cp.created_at as subscription_start,
        COUNT(ch.id) as total_contacts_made,
        COUNT(CASE WHEN ch.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as contacts_this_month
      FROM company_profiles cp
      LEFT JOIN contact_history ch ON cp.id = ch.company_id
      WHERE cp.user_id = $1
      GROUP BY cp.id, cp.subscription_tier, cp.contacts_used, cp.contact_limit, cp.created_at
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const stats = result.rows[0];
    return {
      ...stats,
      total_contacts_made: parseInt(stats.total_contacts_made),
      contacts_this_month: parseInt(stats.contacts_this_month),
      remaining_contacts: stats.contact_limit - stats.contacts_used,
      usage_percentage: ((stats.contacts_used / stats.contact_limit) * 100).toFixed(1)
    };
  }

  /**
   * Search companies (admin function)
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Object} Search results
   */
  static async search(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { subscriptionTier, search } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let whereConditions = ['u.deleted_at IS NULL'];
    let values = [];
    let paramCount = 1;

    if (subscriptionTier) {
      whereConditions.push(`cp.subscription_tier = $${paramCount}`);
      values.push(subscriptionTier);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(cp.company_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM company_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
      SELECT 
        cp.*,
        u.name,
        u.email,
        u.phone,
        u.is_verified,
        COUNT(j.id) as total_jobs_posted
      FROM company_profiles cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN jobs j ON cp.id = j.company_id
      WHERE ${whereClause}
      GROUP BY cp.id, u.name, u.email, u.phone, u.is_verified
      ORDER BY cp.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);

    const companies = result.rows.map(company => ({
      ...company,
      total_jobs_posted: parseInt(company.total_jobs_posted)
    }));

    return {
      companies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get company dashboard stats
   * @param {Number} userId - User ID
   * @returns {Object} Dashboard statistics
   */
  static async getDashboardStats(userId) {
    const query = `
      SELECT 
        cp.subscription_tier,
        cp.contacts_used,
        cp.contact_limit,
        COUNT(j.id) as total_jobs,
        COUNT(CASE WHEN j.status = 'active' THEN 1 END) as active_jobs,
        COUNT(CASE WHEN j.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as jobs_this_month,
        COUNT(ch.id) as total_contacts,
        COUNT(CASE WHEN ch.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as contacts_this_week
      FROM company_profiles cp
      LEFT JOIN jobs j ON cp.id = j.company_id
      LEFT JOIN contact_history ch ON cp.id = ch.company_id
      WHERE cp.user_id = $1
      GROUP BY cp.id, cp.subscription_tier, cp.contacts_used, cp.contact_limit
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const stats = result.rows[0];
    return {
      subscription: {
        tier: stats.subscription_tier,
        contacts_used: stats.contacts_used,
        contact_limit: stats.contact_limit,
        remaining_contacts: stats.contact_limit - stats.contacts_used
      },
      jobs: {
        total: parseInt(stats.total_jobs),
        active: parseInt(stats.active_jobs),
        this_month: parseInt(stats.jobs_this_month)
      },
      contacts: {
        total: parseInt(stats.total_contacts),
        this_week: parseInt(stats.contacts_this_week)
      }
    };
  }

  /**
   * Check if company can contact driver (subscription limits)
   * @param {Number} userId - User ID
   * @returns {Object} Contact availability status
   */
  static async canContactDriver(userId) {
    const query = `
      SELECT 
        contacts_used,
        contact_limit,
        subscription_tier
      FROM company_profiles
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return { canContact: false, reason: 'Company profile not found' };
    }

    const { contacts_used, contact_limit, subscription_tier } = result.rows[0];
    
    if (contacts_used >= contact_limit) {
      return {
        canContact: false,
        reason: 'Contact limit exceeded',
        subscription_tier,
        contacts_used,
        contact_limit
      };
    }

    return {
      canContact: true,
      remaining_contacts: contact_limit - contacts_used,
      subscription_tier,
      contacts_used,
      contact_limit
    };
  }
}

module.exports = Company;
