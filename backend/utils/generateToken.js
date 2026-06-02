const jwt = require('jsonwebtoken');

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '10m',
  });

const generateRefreshToken = () =>
  jwt.sign({ type: 'refresh' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

module.exports = { generateAccessToken, generateRefreshToken };
