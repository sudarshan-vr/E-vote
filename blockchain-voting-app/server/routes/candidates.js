const express = require('express');
const router = express.Router();
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getCandidates);
router.get('/:id', getCandidate);

// Protected admin routes
router.post('/', protect, admin, createCandidate);
router.put('/:id', protect, admin, updateCandidate);
router.delete('/:id', protect, admin, deleteCandidate);

module.exports = router;
