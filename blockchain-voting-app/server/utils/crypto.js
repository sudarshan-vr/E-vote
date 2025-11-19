const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate a key pair for the user (simplified for demo)
function generateKeyPair() {
  // In a real blockchain app, we'd use proper asymmetric encryption
  // For this demo, we'll generate random strings to simulate keys
  return {
    publicKey: `pk_${crypto.randomBytes(16).toString('hex')}`,
    privateKey: `sk_${crypto.randomBytes(32).toString('hex')}`
  };
}

// Generate a hash for transactions
function generateHash(data) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data) + Date.now())
    .digest('hex');
}

// Verify a transaction signature (simplified for demo)
function verifySignature(transaction, publicKey, signature) {
  // In a real blockchain app, we'd verify the signature against the public key
  // For this demo, we'll just check if the signature exists
  return !!signature;
}

// Sign a transaction (simplified for demo)
function signTransaction(transaction, privateKey) {
  // In a real blockchain app, we'd sign the transaction with the private key
  // For this demo, we'll just return a random string as the signature
  return `sig_${crypto.randomBytes(32).toString('hex')}`;
}

// Generate a JWT token
function generateToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// Verify a JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateKeyPair,
  generateHash,
  verifySignature,
  signTransaction,
  generateToken,
  verifyToken
};
