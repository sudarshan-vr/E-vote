const { Candidate } = require('../models');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      order: [['voteCount', 'DESC']]
    });
    res.json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Public
exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a candidate
// @route   POST /api/candidates
// @access  Private/Admin
exports.createCandidate = async (req, res) => {
  try {
    const { name, party, description } = req.body;
    
    const candidate = await Candidate.create({
      name,
      party,
      description,
      voteCount: 0
    });
    
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    const { name, party, description } = req.body;
    
    candidate.name = name || candidate.name;
    candidate.party = party || candidate.party;
    candidate.description = description !== undefined ? description : candidate.description;
    
    await candidate.save();
    
    res.json(candidate);
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    await candidate.destroy();
    
    res.json({ message: 'Candidate removed' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
