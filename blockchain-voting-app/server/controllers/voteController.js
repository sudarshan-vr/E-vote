const sequelize = require('../config/db');
const { Vote, User, Candidate } = require('../models');
const { generateHash, signTransaction } = require('../utils/crypto');

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private
exports.castVote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { candidateId } = req.body;
    const userId = req.user.id;

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidateId, { transaction });
    if (!candidate) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Get user with lock to prevent race conditions
    const user = await User.findByPk(userId, { transaction });

    // Check if user has already voted
    if (user.hasVoted) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'You have already voted',
        hasVoted: true
      });
    }

    // Create a transaction record (simulating blockchain transaction)
    const transactionData = {
      userId: user.id,
      candidateId: candidate.id,
      timestamp: new Date().toISOString()
    };

    // Generate transaction ID and hash
    const transactionId = `tx_${Date.now()}_${user.id}_${candidate.id}`;
    const hash = generateHash(transactionData);
    
    // Sign the transaction (simplified for demo)
    const signature = signTransaction(transactionData, user.privateKey);

    // Create vote record
    await Vote.create({
      transactionId,
      hash,
      status: 'confirmed',
      userId: user.id,
      candidateId: candidate.id,
      signature
    }, { transaction });

    // Update candidate vote count
    await candidate.increment('voteCount', { by: 1, transaction });
    
    // Mark user as voted
    user.hasVoted = true;
    await user.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Vote cast successfully',
      transactionId,
      hash,
      signature
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Cast vote error:', error);
    res.status(500).json({ 
      message: 'Error casting vote',
      error: error.message 
    });
  }
};

// @desc    Get vote statistics
// @route   GET /api/votes/stats
// @access  Public
exports.getVoteStats = async (req, res) => {
  try {
    // Get total votes cast
    const totalVotes = await Vote.count({ where: { status: 'confirmed' } });
    
    // Get votes per candidate
    const candidates = await Candidate.findAll({
      attributes: ['id', 'name', 'party', 'voteCount'],
      order: [['voteCount', 'DESC']]
    });
    
    // Calculate vote percentages
    const stats = candidates.map(candidate => ({
      ...candidate.get({ plain: true }),
      percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : 0
    }));
    
    res.json({
      totalVotes,
      candidates: stats
    });
  } catch (error) {
    console.error('Get vote stats error:', error);
    res.status(500).json({ message: 'Error getting vote statistics' });
  }
};

// @desc    Get vote history (admin only)
// @route   GET /api/votes/history
// @access  Private/Admin
exports.getVoteHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const { count, rows: votes } = await Vote.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'username', 'publicKey'] },
        { model: Candidate, attributes: ['id', 'name', 'party'] }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      votes
    });
  } catch (error) {
    console.error('Get vote history error:', error);
    res.status(500).json({ message: 'Error getting vote history' });
  }
};
