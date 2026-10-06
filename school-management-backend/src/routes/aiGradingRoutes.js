// src/routes/aiGradingRoutes.js
const express = require('express');
const router = express.Router();
const {
  gradeExamPaperWithAI,
  gradeMultipleChoiceOMR,
  getStudentAcademicRiskPrediction
} = require('../controllers/aiGradingController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// All AI grading routes require authentication
router.use(protect);

// 1. AI Paper Grading Assistant
router.post(
  '/evaluate-paper',
  authorize('admin', 'super_admin', 'staff'),
  validateRequest({
    body: {
      studentName: { required: true, type: 'string', min: 2 },
      subjectName: { required: true, type: 'string', min: 2 }
    }
  }),
  gradeExamPaperWithAI
);

// 2. Optical Mark Recognition (OMR) Assistant
router.post(
  '/omr-evaluate',
  authorize('admin', 'super_admin', 'staff'),
  validateRequest({
    body: {
      answerKey: { required: true, type: 'array', min: 1 },
      studentResponses: { required: true, type: 'array', min: 1 }
    }
  }),
  gradeMultipleChoiceOMR
);

// 3. Early Warning Predictive Risk Model
router.get(
  '/risk-prediction/:studentId',
  authorize('admin', 'super_admin', 'staff'),
  getStudentAcademicRiskPrediction
);

module.exports = router;
