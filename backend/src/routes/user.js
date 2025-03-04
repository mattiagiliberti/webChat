const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', getUserProfile);

router.put('/profile', updateUserProfile);

router.delete('/profile', deleteUserProfile);

module.exports = router;