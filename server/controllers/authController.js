const bcrypt = require("bcryptjs");
const User = require("../models/users");
const { generateToken } = require("../utils/authUtils");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the pwds and if its not matching, throw error
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token on successful login
    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    // console.log("error in loginUser", error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


//Sample user
// {
//   "email": "testuser@example.com",
//   "password": "yourSecurePassword"
// }
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const minPasswordLength = 6; // Min length
  if (password.length < minPasswordLength) {
    return res.status(400).json({ message: 'Password is too weak' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hashing the pwd
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    // Generate JWT token
    const token = generateToken(newUser._id);
    return res.status(201).json({ token });
  } catch (error) {
    // console.error("Error during user registration", error);
    return res.status(500).json({ message: 'Error during user registration' });
  }
};

module.exports = {
  loginUser,
  registerUser
};