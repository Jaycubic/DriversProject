const pool = require('../config/database');

class Driver {
  /**
   * Create driver profile
   * @param {Number} userId - User ID
   * @param {Object} profileData - Driver profile data
   * @returns {Object} Created driver profile
   */
  static async createProfile(userId, profileData) {
    const {
      experience,
      location,
      vehicleTypes,
      bio,
      availabilityStatus = 'available'
    } = profileData;

    const query = `
      INSERT INTO driver_profiles (
        user_id, experience, location, vehicle_types, bio, 
        availability_status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      userId,
      experience,
      location,
      JSON.stringify(vehicleTypes),
      bio,
      availabilityStatus
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get driver profile by user ID
   * @param {Number} userId - User ID
   * @returns {Object|null} Driver profile
   */
  static async getProfileByUserId(userId) {
    const query = `
      SELECT 
        dp.*,
        u.name,
        u.email,
        u.phone,
        u.is_verified,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN reviews r ON dp.id = r.driver_id
      WHERE dp.user_id = $1 AND u.deleted_at IS NULL
      GROUP BY dp.id, u.name, u.email, u.phone, u.is_verified
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const profile = result.rows[0];
    profile.vehicle_types = JSON.parse(profile.vehicle_types || '[]');
    profile.average_rating = parseFloat(profile.average_rating);
    profile.total_reviews = parseInt(profile.total_reviews);

    return profile;
  }

  /**
   * Update driver profile
   * @param {Number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated profile
   */
  static async updateProfile(userId, updateData) {
    const allowedFields = [
      'experience', 'location', 'vehicle_types', 'bio', 
      'availability_status', 'documents_verified'
    ];
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        if (key === 'vehicle_types') {
          values.push(JSON.stringify(updateData[key]));
        } else {
          values.push(updateData[key]);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE driver_profiles 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;

    const profile = result.rows[0];
    profile.vehicle_types = JSON.parse(profile.vehicle_types || '[]');
    return profile;
  }

  /**
   * Search drivers with filters
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Object} Search results
   */
  static async search(filters = {}, pagination = { page: 1, limit: 10 }) {
    const {
      location,
      vehicleType,
      minExperience,
      maxExperience,
      minRating,
      availabilityStatus = 'available',
      search
    } = filters;
    
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let whereConditions = [
      'u.deleted_at IS NULL',
      'dp.availability_status = $1'
    ];
    let values = [availabilityStatus];
    let paramCount = 2;

    if (location) {
      whereConditions.push(`dp.location ILIKE $${paramCount}`);
      values.push(`%${location}%`);
      paramCount++;
    }

    if (vehicleType) {
      whereConditions.push(`dp.vehicle_types::text ILIKE $${paramCount}`);
      values.push(`%${vehicleType}%`);
      paramCount++;
    }

    if (minExperience !== undefined) {
      whereConditions.push(`dp.experience >= $${paramCount}`);
      values.push(minExperience);
      paramCount++;
    }

    if (maxExperience !== undefined) {
      whereConditions.push(`dp.experience <= $${paramCount}`);
      values.push(maxExperience);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(u.name ILIKE $${paramCount} OR dp.location ILIKE $${paramCount} OR dp.bio ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT dp.id) as total
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN reviews r ON dp.id = r.driver_id
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results with ratings
    const query = `
      SELECT 
        dp.*,
        u.name,
        u.email,
        u.phone,
        u.is_verified,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN reviews r ON dp.id = r.driver_id
      WHERE ${whereClause}
      GROUP BY dp.id, u.name, u.email, u.phone, u.is_verified
      ${minRating ? `HAVING COALESCE(AVG(r.rating), 0) >= ${minRating}` : ''}
      ORDER BY average_rating DESC, dp.total_jobs DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    values.push(limit, offset);
    const result = await pool.query(query, values);

    // Parse JSON fields and format data
    const drivers = result.rows.map(driver => ({
      ...driver,
      vehicle_types: JSON.parse(driver.vehicle_types || '[]'),
      average_rating: parseFloat(driver.average_rating),
      total_reviews: parseInt(driver.total_reviews)
    }));

    return {
      drivers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get driver statistics
   * @param {Number} userId - User ID
   * @returns {Object} Driver statistics
   */
  static async getStats(userId) {
    const query = `
      SELECT 
        dp.total_jobs,
        dp.availability_status,
        dp.documents_verified,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews,
        COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_reviews,
        dp.created_at as profile_created
      FROM driver_profiles dp
      LEFT JOIN reviews r ON dp.id = r.driver_id
      WHERE dp.user_id = $1
      GROUP BY dp.id, dp.total_jobs, dp.availability_status, dp.documents_verified, dp.created_at
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return null;

    const stats = result.rows[0];
    const totalReviews = parseInt(stats.total_reviews);
    const positiveReviews = parseInt(stats.positive_reviews);

    return {
      ...stats,
      average_rating: parseFloat(stats.average_rating),
      total_reviews: totalReviews,
      positive_reviews: positiveReviews,
      success_rate: totalReviews > 0 ? ((positiveReviews / totalReviews) * 100).toFixed(1) : 0
    };
  }

  /**
   * Toggle driver availability
   * @param {Number} userId - User ID
   * @param {String} status - New availability status
   * @returns {Object} Updated profile
   */
  static async toggleAvailability(userId, status) {
    const validStatuses = ['available', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid availability status');
    }

    const query = `
      UPDATE driver_profiles 
      SET availability_status = $1, updated_at = NOW()
      WHERE user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, userId]);
    if (result.rows.length === 0) return null;

    const profile = result.rows[0];
    profile.vehicle_types = JSON.parse(profile.vehicle_types || '[]');
    return profile;
  }

  /**
   * Get driver reviews
   * @param {Number} userId - User ID
   * @param {Object} pagination - Pagination options
   * @returns {Object} Reviews with pagination
   */
  static async getReviews(userId, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Get driver profile ID first
    const profileQuery = `SELECT id FROM driver_profiles WHERE user_id = $1`;
    const profileResult = await pool.query(profileQuery, [userId]);
    
    if (profileResult.rows.length === 0) {
      return { reviews: [], pagination: { page, limit, total: 0, pages: 0 } };
    }

    const driverId = profileResult.rows[0].id;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      WHERE r.driver_id = $1
    `;
    const countResult = await pool.query(countQuery, [driverId]);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated reviews
    const query = `
      SELECT 
        r.*,
        cp.company_name,
        u.name as reviewer_name
      FROM reviews r
      LEFT JOIN company_profiles cp ON r.company_id = cp.id
      LEFT JOIN users u ON cp.user_id = u.id
      WHERE r.driver_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [driverId, limit, offset]);

    return {
      reviews: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get nearby drivers
   * @param {String} location - Location to search near
   * @param {Number} radius - Search radius (not implemented - placeholder)
   * @param {Number} limit - Number of drivers to return
   * @returns {Array} Nearby drivers
   */
  static async getNearby(location, radius = 50, limit = 10) {
    // This is a simplified version - in production you'd use PostGIS for proper geospatial queries
    const query = `
      SELECT 
        dp.*,
        u.name,
        u.phone,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM driver_profiles dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN reviews r ON dp.id = r.driver_id
      WHERE dp.availability_status = 'available' 
        AND dp.location ILIKE $1
        AND u.deleted_at IS NULL
      GROUP BY dp.id, u.name, u.phone
      ORDER BY average_rating DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [`%${location}%`, limit]);
    
    return result.rows.map(driver => ({
      ...driver,
      vehicle_types: JSON.parse(driver.vehicle_types || '[]'),
      average_rating: parseFloat(driver.average_rating),
      total_reviews: parseInt(driver.total_reviews)
    }));
  }
}

module.exports = Driver;
