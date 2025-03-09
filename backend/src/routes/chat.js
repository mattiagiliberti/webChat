const express = require('express');
const { getChatById, createChat, updateChatById, deleteChatById } = require('../controllers/chatController');

const router = express.Router();

router.get('/:id', getChatById);

router.post('/', createChat);

router.put('/:id', updateChatById);

router.delete('/:id', deleteChatById);

module.exports = router;