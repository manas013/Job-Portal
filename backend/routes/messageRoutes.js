const express = require('express');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/', sendMessage);

module.exports = router;
