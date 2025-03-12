const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserProfile, updatePasswordProfile, searchUserByUsername } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);

router.get('/:id', getUserProfile);

router.get('/search/:query', searchUserByUsername);

router.put('/:id', updateUserProfile);

router.put('/:id/password', updatePasswordProfile);

router.delete('/:id', deleteUserProfile);

module.exports = router;