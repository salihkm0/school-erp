// src/routes/appConfigRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAppVersion, 
  updateAppVersion, 
  getAppUpdateHistory, 
  getSchoolContacts, 
  updateSchoolContacts,
  getSchoolProfile,
  updateSchoolProfile,
  uploadSchoolBranding
} = require('../controllers/appConfigController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public / Authenticated — version check, contacts & school profile
router.get('/version', getAppVersion);
router.get('/school-contacts', getSchoolContacts);
router.get('/school-profile', getSchoolProfile);

// Admin only — update version config, contacts & school profile
router.put('/version', protect, authorize('admin'), updateAppVersion);
router.get('/history', protect, authorize('admin'), getAppUpdateHistory);
router.put('/school-contacts', protect, authorize('admin'), updateSchoolContacts);
router.put('/school-profile', protect, authorize('admin'), updateSchoolProfile);
router.post('/upload-branding', protect, authorize('admin'), uploadSingle('file'), uploadSchoolBranding);

module.exports = router;

