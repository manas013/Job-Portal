const express = require('express');
const { getAlerts, createAlert, deleteAlert } = require('../controllers/jobAlertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
