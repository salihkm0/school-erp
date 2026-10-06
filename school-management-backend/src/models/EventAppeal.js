// src/models/EventAppeal.js
const mongoose = require('mongoose');

const eventAppealSchema = new mongoose.Schema({
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
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  studentName: {
    type: String,
    required: true,
  },
  chestNumber: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  appellantName: {
    type: String,
    required: true, // Teacher / House Master / Parent name
  },
  appellantRole: {
    type: String,
    default: 'House Master / Teacher',
  },
  phone: {
    type: String,
    default: '',
  },
  reason: {
    type: String,
    required: true,
  },
  feePaid: {
    type: Boolean,
    default: false,
  },
  feeAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'accepted', 'rejected'],
    default: 'submitted',
  },
  reviewNotes: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

eventAppealSchema.index({ event: 1, item: 1, status: 1 });

module.exports = mongoose.model('EventAppeal', eventAppealSchema);
