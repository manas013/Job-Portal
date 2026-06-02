const express = require('express');
const { getNotifications, markRead, markOneRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getNotifications);
router.put('/read-all', markRead);
router.put('/:id/read', markOneRead);

module.exports = router;
