const express = require('express');
const { getChatById, createChat, updateChatById, deleteChatById } = require('../controllers/chatController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);

router.get('/:id', getChatById);

router.post('/', createChat);

router.put('/:id', updateChatById);

router.delete('/:id', deleteChatById);

module.exports = router;