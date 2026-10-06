// src/routes/schoolCalendarRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCalendarEvents,
  getCalendarEventById,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  importStandardHolidays,
  getUpcomingHolidays
} = require('../controllers/schoolCalendarController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Public/Authenticated read for upcoming holidays (Students/Parents/Staff)
router.get('/upcoming', getUpcomingHolidays);
router.get('/events', getCalendarEvents);
router.get('/events/:id', getCalendarEventById);

// Protected routes
router.use(protect);

// Admin & Staff creation
router.post(
  '/events',
  authorize('admin', 'super_admin', 'staff'),
  validateRequest({
    body: {
      title: { required: true, type: 'string', min: 2 },
      startDate: { required: true }
    }
  }),
  createCalendarEvent
);

router.put(
  '/events/:id',
  authorize('admin', 'super_admin'),
  updateCalendarEvent
);

router.delete(
  '/events/:id',
  authorize('admin', 'super_admin'),
  deleteCalendarEvent
);

router.post(
  '/import-standard',
  authorize('admin', 'super_admin'),
  importStandardHolidays
);

module.exports = router;
