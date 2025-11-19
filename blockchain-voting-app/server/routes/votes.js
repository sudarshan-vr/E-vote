const express = require('express');
const router = express.Router();
const { castVote, getVoteStats, getVoteHistory } = require('../controllers/voteController');
const { protect, admin, hasNotVoted } = require('../middleware/auth');

// Public route
router.get('/stats', getVoteStats);

// Protected routes
router.post('/', protect, hasNotVoted, castVote);
router.get('/history', protect, admin, getVoteHistory);

module.exports = router;
