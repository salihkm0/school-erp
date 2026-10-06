const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate, idParam, classIdParam, studentIdParam } = require('../middleware/validation');
const {
  getAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
  createAttendance,
  bulkCreateAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
  createAttendanceTemplate,
  getAttendanceTemplates,
  getAttendanceTemplateById,
  updateAttendanceTemplate,
  deleteAttendanceTemplate,
  applyTemplateToMonth,
  getTemplateByClassAndMonth,
  notifyPendingAttendance,
  // Daily Attendance Controllers
  markDailyAttendance,
  getDailyAttendanceByClass,
  getDailyAttendanceMatrix,
  getDailyAttendanceByStudent,
  getDailyAttendanceDashboardStats,
  notifyDailyAbsentees
} = require('../controllers/attendanceController');

router.use(protect);

// ── Daily Attendance Routes ──────────────────────────────────────────
router.post('/daily', authorize('staff', 'admin', 'principal'), markDailyAttendance);
router.post('/daily/notify-absent', authorize('staff', 'admin', 'principal'), notifyDailyAbsentees);
router.get('/daily/dashboard-stats', authorize('staff', 'admin', 'principal'), getDailyAttendanceDashboardStats);
router.get('/daily/class/:classId', validate([classIdParam]), getDailyAttendanceByClass);
router.get('/daily/matrix/:classId', validate([classIdParam]), getDailyAttendanceMatrix);
router.get('/daily/student/:studentId', validate([studentIdParam]), getDailyAttendanceByStudent);

// Template routes
router.post('/templates', authorize('admin'), createAttendanceTemplate);
router.get('/templates', authorize('admin'), getAttendanceTemplates);
router.get('/templates/:id', authorize('admin'), validate([idParam]), getAttendanceTemplateById);
router.put('/templates/:id', authorize('admin'), validate([idParam]), updateAttendanceTemplate);
router.delete('/templates/:id', authorize('admin'), validate([idParam]), deleteAttendanceTemplate);
router.post('/templates/apply', authorize('admin'), applyTemplateToMonth);
router.get('/templates/class/:classId/:year/:month', authorize('admin', 'staff'), getTemplateByClassAndMonth);

// Reminders & Notifications
router.post('/notify-pending', authorize('admin', 'principal'), notifyPendingAttendance);

// Monthly Attendance routes (legacy/aggregate)
router.get('/', getAttendance);
router.get('/summary', getAttendanceSummary);
router.get('/student/:studentId', validate([studentIdParam]), getAttendanceByStudent);
router.get('/class/:classId', validate([classIdParam]), getAttendanceByClass);
router.post('/', authorize('staff', 'admin'), createAttendance);
router.post('/bulk', authorize('staff', 'admin'), bulkCreateAttendance);
router.put('/:id', authorize('staff', 'admin'), validate([idParam]), updateAttendance);
router.delete('/:id', authorize('admin'), validate([idParam]), deleteAttendance);

module.exports = router;