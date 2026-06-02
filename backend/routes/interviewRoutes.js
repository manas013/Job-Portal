const express = require('express');
const {
  getMyInterviews,
  proposeInterview,
  selectInterviewSlot,
  cancelInterview,
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getMyInterviews);
router.post('/', authorize('employer', 'admin'), proposeInterview);
router.put('/:id/select', authorize('jobseeker'), selectInterviewSlot);
router.put('/:id/cancel', cancelInterview);

module.exports = router;
