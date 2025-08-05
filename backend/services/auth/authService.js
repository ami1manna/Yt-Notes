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
  if (!username || !email || !password)
    throw { status: 400, message: 'All fields are required' };

  const cleanedEmail = validateEmail(email);
  const cleanedUsername = cleanUsername(username);

  const existingEmail = await User.findOne({ email: cleanedEmail });
  if (existingEmail)
    throw { status: 409, message: 'An account with this email already exists' };

  const existingUsername = await User.findOne({ username: cleanedUsername });
  if (existingUsername)
    throw { status: 409, message: 'This username is already taken' };

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: cleanedUsername,
    email: cleanedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id);
  setCookie('jwt', token, cookieOptions);

  return {
    status: 'success',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
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


const validateEmail = (email) => {
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (cleaned.includes(' '))
    throw { status: 400, message: 'Email must not contain spaces' };

  if (!emailRegex.test(cleaned))
    throw { status: 400, message: 'Invalid email format' };

  return cleaned;
};

const cleanUsername = (username) => {
  const cleaned = username.trim().replace(/\s+/g, ' '); // normalize spaces

  if (cleaned.length > 30)
    throw { status: 400, message: 'Username must be 30 characters or less' };

  // Optional: reject usernames with special characters (except space)
  const usernameRegex = /^[a-zA-Z0-9 ]+$/;
  if (!usernameRegex.test(cleaned))
    throw { status: 400, message: 'Username must contain only letters, numbers, and single spaces' };

  return cleaned;
};
