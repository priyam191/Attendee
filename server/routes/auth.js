const authController = require('../controllers/auth');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');


router.post('/login', authController.login);
router.get('/user', authMiddleware, authController.user);

module.exports = router;