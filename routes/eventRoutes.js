const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Admin routes
router.get('/list', verifyToken, requireRole('admin'), eventController.listEvents);
router.get('/search', verifyToken, requireRole('admin'), eventController.getEventsPage);

module.exports = router;