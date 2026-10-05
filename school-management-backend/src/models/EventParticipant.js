// src/models/EventParticipant.js
const mongoose = require('mongoose');

const eventParticipantSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FestEvent',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // References a group in FestEvent.groups
  },
  groupName: {
    type: String,
    required: true,
  },
  groupColor: {
    type: String,
    default: '#3B82F6',
  },
  chestNumber: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  registeredItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventItem',
  }],
  totalPoints: {
    type: Number,
    default: 0,
  },
  goldCount: {
    type: Number,
    default: 0,
  },
  silverCount: {
    type: Number,
    default: 0,
  },
  bronzeCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

eventParticipantSchema.index({ event: 1, student: 1 }, { unique: true });
eventParticipantSchema.index({ event: 1, chestNumber: 1 }, { unique: true });
eventParticipantSchema.index({ event: 1, group: 1 });

module.exports = mongoose.model('EventParticipant', eventParticipantSchema);
