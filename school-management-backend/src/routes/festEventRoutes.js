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
} = require('../controllers/festEventController');
const { protect, authorize } = require('../middleware/auth');

// Public or Authenticated Live Leaderboard (Accessible for Projectors / Displays / Students)
router.get('/:id/leaderboard', getEventLeaderboard);
router.get('/:id/results', getEventResults);

// Authenticated Routes
router.use(protect);

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

// 4. Judges Call Sheet & Results
router.get('/:id/items/:itemId/call-sheet', getItemCallSheet);
router.post('/:id/items/:itemId/results', authorize('admin', 'staff'), recordItemResult);

module.exports = router;
