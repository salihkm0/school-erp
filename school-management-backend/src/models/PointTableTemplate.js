// src/models/PointTableTemplate.js
const mongoose = require('mongoose');

const pointTableTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  eventType: {
    type: String,
    enum: ['sports', 'arts', 'cultural', 'academic', 'general'],
    default: 'general',
  },
  individualFirst: {
    type: Number,
    default: 5,
  },
  individualSecond: {
    type: Number,
    default: 3,
  },
  individualThird: {
    type: Number,
    default: 1,
  },
  groupFirst: {
    type: Number,
    default: 10,
  },
  groupSecond: {
    type: Number,
    default: 6,
  },
  groupThird: {
    type: Number,
    default: 2,
  },
  fourthPlacePoints: {
    type: Number,
    default: 0,
  },
  consolationPoints: {
    type: Number,
    default: 0,
  },
  participationPoints: {
    type: Number,
    default: 0,
  },
  gradePoints: {
    APlus: { type: Number, default: 7 },
    A: { type: Number, default: 5 },
    B: { type: Number, default: 3 },
    C: { type: Number, default: 1 },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PointTableTemplate', pointTableTemplateSchema);
