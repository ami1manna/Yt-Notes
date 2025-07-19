const User = require('@/models/users/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added missing import
const { generateToken, cookieOptions, clearCookieOptions } = require('@/utils/CookiesUtils');
const { signupService, loginService, logoutService, getMeService } = require('@/services/auth/authService');

// Get current user
exports.getMe = async (req, res) => {
  try {
    const result = await getMeService(req.cookies);
    res.json(result);
  } catch (error) {
    res.status(error.status || 401).json({ message: error.message || 'Invalid token' });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const result = await signupService(req.body, (name, value, options) => res.cookie(name, value, options));
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const result = await loginService(req.body, (name, value, options) => res.cookie(name, value, options));
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Error logging in'
    });
  }
};

// Logout
// Logout
exports.logout = (req, res) => {
  try {
    const result = logoutService(req.cookies, (name, options) => res.clearCookie(name, options));
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Error logging out'
    });
  }
};