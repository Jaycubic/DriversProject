const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWTUtils {
  /**
   * Generate access token
   * @param {Object} payload - User data to encode
   * @returns {String} JWT token
   */
  static generateAccessToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'driverconnect-api',
        audience: 'driverconnect-client'
      }
    );
  }

  /**
   * Generate refresh token
   * @param {Object} payload - User data to encode
   * @returns {String} JWT refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
        issuer: 'driverconnect-api',
        audience: 'driverconnect-client'
      }
    );
  }

  /**
   * Verify access token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded payload
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'driverconnect-api',
        audience: 'driverconnect-client'
      });
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   * @param {String} token - JWT refresh token to verify
   * @returns {Object} Decoded payload
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        issuer: 'driverconnect-api',
        audience: 'driverconnect-client'
      });
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Generate token pair (access + refresh)
   * @param {Object} user - User object
   * @returns {Object} Token pair
   */
  static generateTokenPair(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken({ id: user.id, email: user.email })
    };
  }

  /**
   * Extract token from Authorization header
   * @param {String} authHeader - Authorization header value
   * @returns {String|null} Token or null
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Get cookie options for secure HTTP-only cookies
   * @param {Boolean} isRefreshToken - Whether this is for refresh token
   * @returns {Object} Cookie options
   */
  static getCookieOptions(isRefreshToken = false) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: isRefreshToken 
        ? 30 * 24 * 60 * 60 * 1000 // 30 days for refresh token
        : 7 * 24 * 60 * 60 * 1000,  // 7 days for access token
      path: '/',
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined
    };
  }
}

module.exports = JWTUtils;
