const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In generateToken function
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '180d', // 6 months (180 days)
      algorithm: 'HS256'
    }
  );
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      status: 'success',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Generate token
    const token = generateToken(user._id);

    // In cookie settings (keep the same in both login and signup routes)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Since you're in production
      sameSite: 'None',
      maxAge: 180 * 24 * 60 * 60 * 1000 // 6 months in milliseconds
    });

    res.status(201).json({
      status: 'success',
      user: {
        id: user._id,
        username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating user'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // In cookie settings (keep the same in both login and signup routes)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Since you're in production
      sameSite: 'None',
      maxAge: 180 * 24 * 60 * 60 * 1000 // 6 months in milliseconds
    });

    res.json({
      status: 'success',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error logging in'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error logging out'
    });
  }
};

