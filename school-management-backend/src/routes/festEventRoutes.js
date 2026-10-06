// src/routes/festEventRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventItems,
  createEventItem,
  updateEventItem,
  deleteEventItem,
  getParticipants,
  registerParticipant,
  bulkRegisterParticipants,
  generateChestNumbers,
  getItemCallSheet,
  recordItemResult,
  getEventResults,
  getEventLeaderboard,
  submitJudgeScoreSheet,
  getItemScoreSheets,
  tabulateAndPublishItem,
  updateStageLiveStatus,
  getStageLiveStatus,
  generateLotOrder,
  getIndividualChampionships,
  getPrintableBadges,
  getPrintableCertificates,
  submitAppeal,
  getAppeals,
  reviewAppeal,
  getChestTemplates,
  createChestTemplate,
  updateChestTemplate,
  deleteChestTemplate,
  applyChestTemplate,
  getPointTemplates,
  createPointTemplate,
  updatePointTemplate,
  deletePointTemplate,
  applyPointTemplate,
  getDetailedPointTable,
} = require('../controllers/festEventController');
const { protect, authorize } = require('../middleware/auth');

// Public or Authenticated Live Leaderboard / Stage Monitors / Point Tables (Accessible for Displays & Web)
router.get('/:id/leaderboard', getEventLeaderboard);
router.get('/:id/detailed-point-table', getDetailedPointTable);
router.get('/:id/results', getEventResults);
router.get('/:id/stage-status', getStageLiveStatus);
router.get('/:id/championships', getIndividualChampionships);

// Template lists (Public / Authenticated read)
router.get('/templates/chest', getChestTemplates);
router.get('/templates/points', getPointTemplates);

// Authenticated Routes
router.use(protect);

// Template Management (Admin / Staff)
router.post('/templates/chest', authorize('admin', 'staff'), createChestTemplate);
router.put('/templates/chest/:id', authorize('admin', 'staff'), updateChestTemplate);
router.delete('/templates/chest/:id', authorize('admin'), deleteChestTemplate);
router.put('/:id/apply-chest-template/:templateId', authorize('admin', 'staff'), applyChestTemplate);

router.post('/templates/points', authorize('admin', 'staff'), createPointTemplate);
router.put('/templates/points/:id', authorize('admin', 'staff'), updatePointTemplate);
router.delete('/templates/points/:id', authorize('admin'), deletePointTemplate);
router.put('/:id/apply-point-template/:templateId', authorize('admin', 'staff'), applyPointTemplate);

// 1. Events CRUD
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', authorize('admin'), createEvent);
router.put('/:id', authorize('admin'), updateEvent);
router.delete('/:id', authorize('admin'), deleteEvent);

// 2. Items & Competitions
router.get('/:id/items', getEventItems);
router.post('/:id/items', authorize('admin', 'staff'), createEventItem);
router.put('/:id/items/:itemId', authorize('admin', 'staff'), updateEventItem);
router.delete('/:id/items/:itemId', authorize('admin'), deleteEventItem);

// 3. Registrations & Chest Numbers
router.get('/:id/participants', getParticipants);
router.post('/:id/participants/register', authorize('admin', 'staff'), registerParticipant);
router.post('/:id/participants/bulk-register', authorize('admin', 'staff'), bulkRegisterParticipants);
router.post('/:id/generate-chest-numbers', authorize('admin', 'staff'), generateChestNumbers);

// 4. Judges Call Sheet, Multi-Judge Scoring & Tabulation
router.get('/:id/items/:itemId/call-sheet', getItemCallSheet);
router.post('/:id/items/:itemId/results', authorize('admin', 'staff'), recordItemResult);
router.get('/:id/items/:itemId/judge-scores', getItemScoreSheets);
router.post('/:id/items/:itemId/judge-scores', authorize('admin', 'staff'), submitJudgeScoreSheet);
router.post('/:id/items/:itemId/tabulate', authorize('admin', 'staff'), tabulateAndPublishItem);

// 5. Stage Manager & Lot Order
router.put('/:id/items/:itemId/stage-status', authorize('admin', 'staff'), updateStageLiveStatus);
router.post('/:id/items/:itemId/generate-lot-order', authorize('admin', 'staff'), generateLotOrder);

// 6. Printables (Badges & Certificates)
router.get('/:id/badges', getPrintableBadges);
router.get('/:id/certificates', getPrintableCertificates);

// 7. Appeals & Grievances
router.get('/:id/appeals', getAppeals);
router.post('/:id/appeals', submitAppeal);
router.put('/:id/appeals/:appealId/review', authorize('admin', 'staff'), reviewAppeal);

module.exports = router;
