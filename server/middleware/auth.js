const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

// Attaches req.user when a valid token is present; never blocks the request.
exports.optionalAuth = async (req, _res, next) => {
  const token = getToken(req);
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch (_err) {
    /* invalid token -> treat as guest */
  }
  next();
};

// Requires a valid token.
exports.protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Please log in to continue' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'This account no longer exists' });
    req.user = user;
    next();
  } catch (_err) {
    res.status(401).json({ message: 'Your session has expired. Please log in again' });
  }
};

// Role-based access control.
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    next();
  };
