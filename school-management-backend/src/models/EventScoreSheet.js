// src/models/EventScoreSheet.js
const mongoose = require('mongoose');

const criteriaScoreSchema = new mongoose.Schema({
  criteriaName: {
    type: String,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 10,
  },
  marksGiven: {
    type: Number,
    required: true,
    default: 0,
  },
});

const eventScoreSheetSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FestEvent',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventItem',
    required: true,
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventParticipant',
    required: true,
  },
  chestNumber: {
    type: String,
    required: true,
    trim: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  judgeName: {
    type: String,
    required: true,
    trim: true,
  },
  judgeCode: {
    type: String,
    default: 'J1',
    trim: true,
  },
  criteriaScores: [criteriaScoreSchema],
  totalMarks: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0, // e.g. time limit overrun penalty
  },
  finalMarks: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: '',
  },
  isFinalized: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

eventScoreSheetSchema.index({ event: 1, item: 1, chestNumber: 1, judgeCode: 1 }, { unique: true });
eventScoreSheetSchema.index({ item: 1 });

module.exports = mongoose.model('EventScoreSheet', eventScoreSheetSchema);
