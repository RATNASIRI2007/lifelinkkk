const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

// POST /api/auth/register  -> always creates a normal "user"; admins are promoted by another admin
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'user' });
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Enter your email and password' });
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    res.json({ token: signToken(user._id), user: publicUser(user) });
  })
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
