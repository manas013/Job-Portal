const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  resetPassword
);

router.get('/me', protect, getMe);

if (process.env.GOOGLE_CLIENT_ID) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
  );
}

module.exports = router;
