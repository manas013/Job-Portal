const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { issueTokens, rotateRefreshToken, revokeRefreshToken } = require('../utils/authTokens');
const sendEmail = require('../utils/sendEmail');

const authResponse = async (user, res, status = 200) => {
  const tokens = await issueTokens(user._id);
  res.status(status).json({
    user,
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role });
    await authResponse(user, res, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });
    await authResponse(user, res);
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokens = await rotateRefreshToken(refreshToken);
    if (!tokens) return res.status(401).json({ message: 'Invalid refresh token' });

    res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await revokeRefreshToken(refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link was sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordReset.deleteMany({ user: user._id });
    await PasswordReset.create({ user: user._id, token, expiresAt });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Expires in 1 hour.</p>`,
    });

    res.json({ message: 'If that email exists, a reset link was sent', resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const reset = await PasswordReset.findOne({ token });
    if (!reset || reset.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(reset.user);
    user.password = password;
    await user.save();
    await reset.deleteOne();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('company');
  res.json(user);
};

const googleCallback = async (req, res, next) => {
  try {
    const tokens = await issueTokens(req.user._id);
    const client = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(
      `${client}/auth/callback?token=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
};
