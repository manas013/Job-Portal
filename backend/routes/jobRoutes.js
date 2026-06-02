const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJob,
  getRecommendedJobs,
  getJobMatchScore,
  generateJobCoverLetter,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
} = require('../controllers/jobController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

router.get('/', optionalProtect, getJobs);
router.get('/recommended/list', protect, authorize('jobseeker'), getRecommendedJobs);
router.get('/:id/match-score', protect, authorize('jobseeker'), getJobMatchScore);
router.post('/:id/cover-letter', protect, authorize('jobseeker'), generateJobCoverLetter);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer', 'admin'), jobValidation, validate, createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.post('/:id/apply', protect, authorize('jobseeker'), applyJob);

module.exports = router;
