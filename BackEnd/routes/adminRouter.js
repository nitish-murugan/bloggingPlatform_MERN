const express = require('express');
const stats = require('../controllers/adminController');
const {getLoginStats, getAllUsers} = require('../controllers/userController');
const {authenticateToken, requireAdmin} = require('../middleware/auth');
const router = express.Router();

router.get('/stats', stats);
router.get('/login-stats', authenticateToken, requireAdmin, getLoginStats);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

module.exports = router;