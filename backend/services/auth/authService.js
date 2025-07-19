// Auth service logic

const User = require('@/models/users/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, cookieOptions, clearCookieOptions } = require('@/utils/CookiesUtils');

exports.getMeService = async (cookies) => {
  const token = cookies.jwt;
  if (!token) throw { status: 401, message: 'Not authenticated' };
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) throw { status: 401, message: 'User not found' };
  return {
    status: 'success',
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

exports.signupService = async ({ username, email, password }, setCookie) => {
  if (!username || !email || !password) throw { status: 400, message: 'All fields are required' };
  if (await User.findOne({ email: email.toLowerCase() })) throw { status: 400, message: 'User already exists' };
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email: email.toLowerCase(), password: hashedPassword });
  const token = generateToken(user._id);
  setCookie('jwt', token, cookieOptions);
  return {
    status: 'success',
    user: { id: user._id, username, email: user.email }
  };
};

exports.loginService = async ({ email, password }, setCookie) => {
  if (!email || !password) throw { status: 400, message: 'Email and password are required' };
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) throw { status: 401, message: 'Invalid credentials' };
  const token = generateToken(user._id);
  setCookie('jwt', token, cookieOptions);
  return {
    status: 'success',
    user: { id: user._id, username: user.username, email: user.email }
  };
};

exports.logoutService = (cookies, clearCookie) => {
  const token = cookies.jwt;
  if (!token) throw { status: 401, message: 'You are not logged in' };
  clearCookie('jwt', clearCookieOptions);
  return {
    status: 'success',
    message: 'Logged out successfully'
  };
}; 