const express = require('express');
const stats = require('../controllers/adminController');
const router = express.Router();

router.get('/stats', stats);

module.exports = router;