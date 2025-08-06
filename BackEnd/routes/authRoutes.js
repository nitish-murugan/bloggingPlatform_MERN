const express = require('express');
const {loginFn, registerFn} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerFn);
router.post('/login', loginFn);

module.exports = router;