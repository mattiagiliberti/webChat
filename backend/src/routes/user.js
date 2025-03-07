const express = require('express');
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUserProfile);

router.put('/', updateUserProfile);

router.delete('/', deleteUserProfile);

module.exports = router;