const express = require('express');
const {
  getMyCompany,
  upsertCompany,
  uploadCompanyLogo,
  getCompanyPublic,
  getCompanyById,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/public/:id', getCompanyPublic);
router.get('/:id', getCompanyById);
router.get('/', protect, authorize('employer', 'admin'), getMyCompany);
router.put('/', protect, authorize('employer', 'admin'), upsertCompany);
router.post('/logo', protect, authorize('employer', 'admin'), upload.single('logo'), uploadCompanyLogo);

module.exports = router;
