const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { verifyToken } = require('../utils/crypto');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password', 'privateKey'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Middleware to check if user has already voted
const hasNotVoted = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user.hasVoted) {
      return res.status(400).json({ 
        message: 'You have already voted',
        hasVoted: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Has not voted middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { protect, admin, hasNotVoted };
