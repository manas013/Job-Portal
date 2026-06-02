const express = require('express');
const { getSavedJobs, saveJob, unsaveJob } = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('jobseeker'));

router.get('/', getSavedJobs);
router.post('/:jobId', saveJob);
router.delete('/:jobId', unsaveJob);

module.exports = router;
