// src/models/EventItem.js
const mongoose = require('mongoose');

const judgingCriteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 10,
  },
});

const assignedJudgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: 'J1',
  },
  pin: {
    type: String,
    default: '1234',
  },
  designation: {
    type: String,
    default: 'Judge / Evaluator',
  },
});

const lotOrderSchema = new mongoose.Schema({
  chestNumber: {
    type: String,
    required: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  called: {
    type: Boolean,
    default: false,
  },
  absent: {
    type: Boolean,
    default: false,
  },
});

const eventItemSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FestEvent',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  itemType: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual',
  },
  gender: {
    type: String,
    enum: ['boys', 'girls', 'mixed', 'open'],
    default: 'open',
  },
  judgingFormat: {
    type: String,
    enum: ['direct_podium', 'criteria_based', 'time_distance'],
    default: 'criteria_based',
  },
  criteria: [judgingCriteriaSchema],
  assignedJudges: [assignedJudgeSchema],
  timeLimitMinutes: {
    type: Number,
    default: 5, // 5 minutes standard
  },
  warningBellMinutes: {
    type: Number,
    default: 4, // warning bell at 4 mins
  },
  stageStatus: {
    type: String,
    enum: ['scheduled', 'call_ready', 'in_progress', 'paused', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  currentPerformingChest: {
    type: String,
    default: '',
  },
  callQueue: [{
    type: String,
  }],
  lotOrder: [lotOrderSchema],
  stageStartTime: {
    type: Date,
  },
  maxParticipantsPerGroup: {
    type: Number,
    default: 2, // e.g. 2 participants per house for individual items
  },
  minGroupMembers: {
    type: Number,
    default: 1,
  },
  maxGroupMembers: {
    type: Number,
    default: 10,
  },
  pointsOverride: {
    first: { type: Number },
    second: { type: Number },
    third: { type: Number },
  },
  stageVenue: {
    type: String,
    default: 'Main Stage',
  },
  scheduledDate: {
    type: Date,
  },
  scheduledTime: {
    type: String, // e.g. "10:30 AM"
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'judging', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  rules: {
    type: String,
    default: '',
  },
  judges: [{
    type: String,
  }],
}, {
  timestamps: true,
});

eventItemSchema.index({ event: 1, category: 1, status: 1 });
eventItemSchema.index({ event: 1, stageVenue: 1, stageStatus: 1 });

module.exports = mongoose.model('EventItem', eventItemSchema);
