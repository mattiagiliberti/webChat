const express = require('express');
const { getAllMessagesByChat, createMessage, updateMessage, deleteMessage } = require('../controllers/messageController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);

router.get('/:id', getAllMessagesByChat);

router.post('/', createMessage);

router.put('/:id', updateMessage);

router.delete('/:id', deleteMessage);

module.exports = router;