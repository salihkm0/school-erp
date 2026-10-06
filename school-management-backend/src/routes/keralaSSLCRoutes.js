// src/routes/keralaSSLCRoutes.js
const express = require('express');
const router = express.Router();
const {
  searchIndividualResult,
  getSchoolSSLCAnalytics,
  getAllSchoolResults,
  bulkImportSSLCResults,
  seedSampleSSLCResults,
  broadcastSSLCToParents
} = require('../controllers/keralaSSLCController');
const { protect, authorize } = require('../middleware/auth');

// Public / In-App search & analytics
router.get('/search', searchIndividualResult);
router.get('/analytics', getSchoolSSLCAnalytics);

// Protected routes (Admin / Super Admin / Staff)
router.use(protect);

router.get('/results', authorize('admin', 'super_admin', 'staff'), getAllSchoolResults);
router.post('/bulk-import', authorize('admin', 'super_admin'), bulkImportSSLCResults);
router.post('/seed-sample', authorize('admin', 'super_admin'), seedSampleSSLCResults);
router.post('/broadcast', authorize('admin', 'super_admin'), broadcastSSLCToParents);

module.exports = router;
