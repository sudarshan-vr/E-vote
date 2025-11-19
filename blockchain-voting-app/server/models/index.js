const User = require('./User');
const Candidate = require('./Candidate');
const Vote = require('./Vote');

// Define associations
User.hasMany(Vote, { foreignKey: 'userId' });
Vote.belongsTo(User, { foreignKey: 'userId' });

Candidate.hasMany(Vote, { foreignKey: 'candidateId' });
Vote.belongsTo(Candidate, { foreignKey: 'candidateId' });

module.exports = {
  User,
  Candidate,
  Vote
};
