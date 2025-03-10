const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserProfile, updatePasswordProfile } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticateToken);

router.get('/:id', getUserProfile);

router.put('/:id', updateUserProfile);

router.put('/:id/password', updatePasswordProfile);

router.delete('/:id', deleteUserProfile);

module.exports = router;