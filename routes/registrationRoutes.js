const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Student only routes
router.get('/list', verifyToken, requireRole('student'), registrationController.getAvailableEvents);
router.get('/cancel/:id', verifyToken, requireRole('student'), registrationController.getCancelPage);
router.post('/register', verifyToken, requireRole('student'), registrationController.registerEvent);
router.post('/unregister/:id', verifyToken, requireRole('student'), registrationController.unregisterEvent);

module.exports = router;