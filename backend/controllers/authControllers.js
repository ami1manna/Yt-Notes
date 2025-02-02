const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = generateToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, secure: true });

    res.status(201).json({ message: 'User created', user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) 
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, secure: true });

    res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};
