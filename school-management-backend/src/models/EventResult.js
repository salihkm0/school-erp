// src/models/EventResult.js
const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  position: {
    type: Number, // 1 for 1st, 2 for 2nd, 3 for 3rd, 4 for Consolation
    required: true,
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventParticipant',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  studentName: String,
  admissionNo: String,
  chestNumber: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  groupName: String,
  groupColor: String,
  teamMembers: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    name: String,
    admissionNo: String,
    chestNumber: String,
  }],
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'None', ''],
    default: 'None',
  },
  scoreOrTime: {
    type: String,
    default: '',
  },
  pointsAwarded: {
    type: Number,
    required: true,
    default: 0,
  },
});

const eventResultSchema = new mongoose.Schema({
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
  winners: [winnerSchema],
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

eventResultSchema.index({ event: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('EventResult', eventResultSchema);
