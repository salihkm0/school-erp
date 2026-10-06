// src/routes/timetableRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTimetableStructure,
  updateTimetableStructure,
  getMasterTimetable,
  getClassTimetable,
  updateClassTimetable,
  checkClashes,
  getTeacherTimetable,
  getMySchedule,
  getRoomTimetable,
  getSubstitutions,
  getFreeTeachersForPeriod,
  createSubstitution,
  updateSubstitution,
  deleteSubstitution,
  autoGenerateTimetable
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

// All timetable operations require authentication
router.use(protect);

// 1. Structure / Settings (Admin / Staff)
router.get('/structure', getTimetableStructure);
router.put('/structure', authorize('admin'), updateTimetableStructure);

// 2. Master Timetable
router.get('/master', getMasterTimetable);

// 3. Class Timetable
router.get('/class/:classId', getClassTimetable);
router.put('/class/:classId', authorize('admin', 'staff'), updateClassTimetable);
router.post('/check-clash', checkClashes);
router.post('/auto-generate', authorize('admin'), autoGenerateTimetable);

// 4. Teacher Timetable & My Schedule
router.get('/teacher/:teacherId', getTeacherTimetable);
router.get('/my-schedule', getMySchedule);

// 5. Room & Lab Timetable
router.get('/room/:roomName', getRoomTimetable);

// 6. Substitutions & Daily Teacher Absence Manager
router.get('/substitutions', getSubstitutions);
router.get('/substitutions/free-teachers', getFreeTeachersForPeriod);
router.post('/substitutions', authorize('admin', 'staff'), createSubstitution);
router.put('/substitutions/:id', authorize('admin', 'staff'), updateSubstitution);
router.delete('/substitutions/:id', authorize('admin'), deleteSubstitution);

module.exports = router;
