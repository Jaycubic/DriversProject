const User = require('../models/User');
const Driver = require('../models/Driver');
const Company = require('../models/Company');
const JWTUtils = require('../utils/jwt');

class AuthController {
  /**
   * Register new user
   */
  static async register(req, res) {
    try {
      const { email, password, name, role, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists',
          code: 'USER_EXISTS'
        });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        role,
        phone
      });

      // Create role-specific profile
      let profile = null;
      if (role === 'driver') {
        // Create basic driver profile - will be completed later
        profile = await Driver.createProfile(user.id, {
          experience: 0,
          location: '',
          vehicleTypes: [],
          bio: ''
        });
      } else if (role === 'company') {
        // Create basic company profile - will be completed later
        profile = await Company.createProfile(user.id, {
          companyName: name,
          registrationNumber: '',
          address: ''
        });
      }

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Set HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, JWTUtils.getCookieOptions(false));
      res.cookie('refreshToken', tokens.refreshToken, JWTUtils.getCookieOptions(true));

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isVerified: user.is_verified
          },
          profile,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        code: 'REGISTRATION_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user with password
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Get role-specific profile
      let profile = null;
      if (user.role === 'driver') {
        profile = await Driver.getProfileByUserId(user.id);
      } else if (user.role === 'company') {
        profile = await Company.getProfileByUserId(user.id);
      }

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Set HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, JWTUtils.getCookieOptions(false));
      res.cookie('refreshToken', tokens.refreshToken, JWTUtils.getCookieOptions(true));

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isVerified: user.is_verified
          },
          profile,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        code: 'LOGIN_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req, res) {
    try {
      let refreshToken = null;

      // Get refresh token from cookie or body
      if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
      } else if (req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
      }

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required',
          code: 'REFRESH_TOKEN_MISSING'
        });
      }

      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // Get fresh user data
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Generate new tokens
      const tokens = JWTUtils.generateTokenPair(user);

      // Set new HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, JWTUtils.getCookieOptions(false));
      res.cookie('refreshToken', tokens.refreshToken, JWTUtils.getCookieOptions(true));

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req, res) {
    try {
      // Clear HTTP-only cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/'
      });
      
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/'
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        code: 'LOGOUT_ERROR'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res) {
    try {
      const user = req.user;

      // Get role-specific profile
      let profile = null;
      let stats = null;

      if (user.role === 'driver') {
        profile = await Driver.getProfileByUserId(user.id);
        stats = await Driver.getStats(user.id);
      } else if (user.role === 'company') {
        profile = await Company.getProfileByUserId(user.id);
        stats = await Company.getDashboardStats(user.id);
      }

      res.json({
        success: true,
        data: {
          user,
          profile,
          stats
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        code: 'PROFILE_ERROR'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req, res) {
    try {
      const user = req.user;
      const updateData = req.body;

      // Update user basic info
      const userFields = ['name', 'phone'];
      const userUpdateData = {};
      userFields.forEach(field => {
        if (updateData[field] !== undefined) {
          userUpdateData[field] = updateData[field];
        }
      });

      let updatedUser = user;
      if (Object.keys(userUpdateData).length > 0) {
        updatedUser = await User.update(user.id, userUpdateData);
      }

      // Update role-specific profile
      let updatedProfile = null;
      if (user.role === 'driver') {
        const driverFields = ['experience', 'location', 'vehicleTypes', 'bio', 'availabilityStatus'];
        const driverUpdateData = {};
        driverFields.forEach(field => {
          if (updateData[field] !== undefined) {
            driverUpdateData[field === 'vehicleTypes' ? 'vehicle_types' : field === 'availabilityStatus' ? 'availability_status' : field] = updateData[field];
          }
        });

        if (Object.keys(driverUpdateData).length > 0) {
          updatedProfile = await Driver.updateProfile(user.id, driverUpdateData);
        }
      } else if (user.role === 'company') {
        const companyFields = ['companyName', 'registrationNumber', 'address'];
        const companyUpdateData = {};
        companyFields.forEach(field => {
          if (updateData[field] !== undefined) {
            companyUpdateData[field === 'companyName' ? 'company_name' : field === 'registrationNumber' ? 'registration_number' : field] = updateData[field];
          }
        });

        if (Object.keys(companyUpdateData).length > 0) {
          updatedProfile = await Company.updateProfile(user.id, companyUpdateData);
        }
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser,
          profile: updatedProfile
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Change password
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Get user with password
      const userWithPassword = await User.findByEmail(user.email);
      if (!userWithPassword) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verify current password
      const isValidPassword = await User.verifyPassword(currentPassword, userWithPassword.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Update password
      const success = await User.changePassword(user.id, newPassword);
      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to change password',
          code: 'PASSWORD_CHANGE_FAILED'
        });
      }

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        code: 'PASSWORD_CHANGE_ERROR'
      });
    }
  }

  /**
   * Verify token (for frontend to check auth status)
   */
  static async verifyToken(req, res) {
    try {
      // If we reach here, the authenticate middleware has already verified the token
      const user = req.user;

      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user,
          isAuthenticated: true
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Token verification failed',
        code: 'TOKEN_VERIFICATION_FAILED'
      });
    }
  }
}

module.exports = AuthController;
