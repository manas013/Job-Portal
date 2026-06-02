const express = require('express');
const {
  getMyApplications,
  getEmployerPipeline,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, authorize('jobseeker'), getMyApplications);
router.post('/:id/withdraw', protect, authorize('jobseeker'), withdrawApplication);
router.get('/pipeline', protect, authorize('employer', 'admin'), getEmployerPipeline);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplicants);
router.put('/:id', protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;
