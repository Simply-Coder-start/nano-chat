const bcrypt = require('bcryptjs');
const User = require('./models/User');

// User authentication functions
async function registerUser(username, password) {
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  return { id: newUser._id, username: newUser.username };
}

async function authenticateUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  return { id: user._id, username: user.username };
}

module.exports = { registerUser, authenticateUser };