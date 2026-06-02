const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('./generateToken');

const issueTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({ user: userId, token: refreshToken, expiresAt });

  return { accessToken, refreshToken };
};

const rotateRefreshToken = async (oldToken) => {
  const stored = await RefreshToken.findOne({ token: oldToken });
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await stored.deleteOne();
    return null;
  }
  await stored.deleteOne();
  return issueTokens(stored.user);
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

module.exports = { issueTokens, rotateRefreshToken, revokeRefreshToken };
