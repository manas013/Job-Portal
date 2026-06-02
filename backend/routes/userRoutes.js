const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
  getUsers,
  toggleUserActive,
  adminDeleteJob,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload/resume', protect, upload.single('resume'), uploadResume);
router.post('/upload/avatar', protect, upload.single('avatar'), uploadAvatar);

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/toggle-active', protect, authorize('admin'), toggleUserActive);
router.delete('/jobs/:id', protect, authorize('admin'), adminDeleteJob);

module.exports = router;
