const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    const { email, password, name, role, phone } = userData;
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password, name, role, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, name, role, phone, is_verified, created_at
    `;
    
    const values = [email.toLowerCase(), hashedPassword, name, role, phone];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Object|null} User or null
   */
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password, name, role, phone, is_verified, created_at, updated_at
      FROM users 
      WHERE email = $1 AND deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {Number} id - User ID
   * @returns {Object|null} User or null
   */
  static async findById(id) {
    const query = `
      SELECT id, email, name, role, phone, is_verified, created_at, updated_at
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Verify user password
   * @param {String} plainPassword - Plain text password
   * @param {String} hashedPassword - Hashed password from database
   * @returns {Boolean} Password match result
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user profile
   * @param {Number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async update(id, updateData) {
    const allowedFields = ['name', 'phone', 'is_verified'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
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
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING id, email, name, role, phone, is_verified, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Change user password
   * @param {Number} id - User ID
   * @param {String} newPassword - New password
   * @returns {Boolean} Success status
   */
  static async changePassword(id, newPassword) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE users 
      SET password = $1, updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rowCount > 0;
  }

  /**
   * Soft delete user
   * @param {Number} id - User ID
   * @returns {Boolean} Success status
   */
  static async softDelete(id) {
    const query = `
      UPDATE users 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get user statistics
   * @param {Number} id - User ID
   * @returns {Object} User statistics
   */
  static async getStats(id) {
    const user = await this.findById(id);
    if (!user) return null;

    if (user.role === 'driver') {
      const query = `
        SELECT 
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(r.id) as total_reviews,
          COALESCE(dp.total_jobs, 0) as total_jobs,
          dp.availability_status,
          dp.created_at as profile_created
        FROM users u
        LEFT JOIN driver_profiles dp ON u.id = dp.user_id
        LEFT JOIN reviews r ON dp.id = r.driver_id
        WHERE u.id = $1
        GROUP BY dp.total_jobs, dp.availability_status, dp.created_at
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || {};
    } else if (user.role === 'company') {
      const query = `
        SELECT 
          cp.subscription_tier,
          cp.contacts_used,
          cp.contact_limit,
          COUNT(j.id) as total_jobs_posted,
          COUNT(CASE WHEN j.status = 'active' THEN 1 END) as active_jobs
        FROM users u
        LEFT JOIN company_profiles cp ON u.id = cp.user_id
        LEFT JOIN jobs j ON cp.id = j.company_id
        WHERE u.id = $1
        GROUP BY cp.subscription_tier, cp.contacts_used, cp.contact_limit
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || {};
    }

    return {};
  }

  /**
   * Search users with filters
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Object} Search results
   */
  static async search(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { role, isVerified, search } = filters;
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let whereConditions = ['deleted_at IS NULL'];
    let values = [];
    let paramCount = 1;

    if (role) {
      whereConditions.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (isVerified !== undefined) {
      whereConditions.push(`is_verified = $${paramCount}`);
      values.push(isVerified);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
      SELECT id, email, name, role, phone, is_verified, created_at
      FROM users
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    values.push(limit, offset);
    const result = await pool.query(query, values);

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user activity log
   * @param {Number} id - User ID
   * @param {Number} limit - Number of activities to fetch
   * @returns {Array} Activity log
   */
  static async getActivityLog(id, limit = 10) {
    // This would typically come from an activity_logs table
    // For now, we'll return recent activities from related tables
    const query = `
      SELECT 
        'profile_update' as activity_type,
        'Profile updated' as description,
        updated_at as created_at
      FROM users 
      WHERE id = $1 AND updated_at > created_at
      
      UNION ALL
      
      SELECT 
        'review_received' as activity_type,
        'Received a review' as description,
        r.created_at
      FROM reviews r
      JOIN driver_profiles dp ON r.driver_id = dp.id
      WHERE dp.user_id = $1
      
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [id, limit]);
    return result.rows;
  }
}

module.exports = User;
