// src/models/EventItem.js
const mongoose = require('mongoose');

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
  maxParticipantsPerGroup: {
    type: Number,
    default: 2, // e.g. 2 participants per house for individual items
  },
  minGroupMembers: {
    type: Number,
    default: 1, // for group items (e.g. 4 for relay, 6 for group dance)
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
    default: 'Main Ground / Stage',
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

module.exports = mongoose.model('EventItem', eventItemSchema);
