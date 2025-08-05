// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/users/userModel');

exports.protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.jwt;
     
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};