const JWTUtils = require('../utils/jwt');
const pool = require('../config/database');

/**
 * Authentication middleware - verifies JWT token from cookies or headers
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Try to get token from HTTP-only cookie first (preferred)
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback to Authorization header
    else if (req.headers.authorization) {
      token = JWTUtils.extractTokenFromHeader(req.headers.authorization);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify token
    const decoded = JWTUtils.verifyAccessToken(token);
    
    // Fetch fresh user data from database
    const userQuery = `
      SELECT id, email, name, role, phone, is_verified, created_at
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await pool.query(userQuery, [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = result.rows[0];
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      isVerified: user.is_verified,
      createdAt: user.created_at
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific JWT errors
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.message.includes('invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

/**
 * Role-based authorization middleware factory
 * @param {Array|String} allowedRoles - Roles that can access the route
 * @returns {Function} Middleware function
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Convenience middleware for admin-only routes
 */
const requireAdmin = [authenticate, authorize('admin')];

/**
 * Convenience middleware for company-only routes
 */
const requireCompany = [authenticate, authorize('company')];

/**
 * Convenience middleware for driver-only routes
 */
const requireDriver = [authenticate, authorize('driver')];

/**
 * Convenience middleware for company or admin routes
 */
const requireCompanyOrAdmin = [authenticate, authorize(['company', 'admin'])];

/**
 * Convenience middleware for driver or admin routes
 */
const requireDriverOrAdmin = [authenticate, authorize(['driver', 'admin'])];

/**
 * Convenience middleware for any authenticated user
 */
const requireAuth = authenticate;

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization) {
      token = JWTUtils.extractTokenFromHeader(req.headers.authorization);
    }

    if (token) {
      const decoded = JWTUtils.verifyAccessToken(token);
      const userQuery = `
        SELECT id, email, name, role, phone, is_verified, created_at
        FROM users 
        WHERE id = $1 AND deleted_at IS NULL
      `;
      
      const result = await pool.query(userQuery, [decoded.id]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          isVerified: user.is_verified,
          createdAt: user.created_at
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireCompany,
  requireDriver,
  requireCompanyOrAdmin,
  requireDriverOrAdmin,
  requireAuth,
  optionalAuth
};
