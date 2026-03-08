const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // production mein true karna
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered hai!' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token, // frontend ke liye bhi bhejo
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed!', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email ya password galat hai!' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Account ban ho gaya hai!' });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token, // frontend ke liye bhi bhejo
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed!', error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout ho gaya! 👋' });
});

// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;