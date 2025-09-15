const express = require('express');
const {loginFn, registerFn, googleSignInFn} = require('../controllers/authController');
const {getUserProfile, updateOnlineStatus} = require('../controllers/userController');
const {authenticateToken} = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerFn);
router.post('/login', loginFn);
router.post('/google-signin', googleSignInFn);
router.get('/profile', authenticateToken, getUserProfile);
router.patch('/online-status', authenticateToken, updateOnlineStatus);

module.exports = router;