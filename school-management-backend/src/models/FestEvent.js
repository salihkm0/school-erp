// src/models/FestEvent.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
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
  color: {
    type: String,
    default: '#3B82F6', // Hex color for UI / charts / badges
  },
  captainStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  inChargeStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  },
  points: {
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
});

const festEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['sports', 'arts', 'cultural', 'academic', 'other'],
    default: 'sports',
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    default: 'School Campus',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'registration_open', 'ongoing', 'completed', 'archived'],
    default: 'registration_open',
  },
  groupingType: {
    type: String,
    enum: ['house', 'class', 'custom'],
    default: 'house',
  },
  groups: [groupSchema],
  categories: {
    type: [String],
    default: ['Sub-Junior', 'Junior', 'Senior', 'General'],
  },
  chestNumberConfig: {
    prefix: {
      type: String,
      default: '',
    },
    startNumber: {
      type: Number,
      default: 101,
    },
    digits: {
      type: Number,
      default: 3,
    },
    allocationStrategy: {
      type: String,
      enum: ['sequential', 'house_prefix', 'category_prefix'],
      default: 'sequential',
    },
  },
  pointSystem: {
    individualFirst: { type: Number, default: 5 },
    individualSecond: { type: Number, default: 3 },
    individualThird: { type: Number, default: 1 },
    groupFirst: { type: Number, default: 10 },
    groupSecond: { type: Number, default: 6 },
    groupThird: { type: Number, default: 2 },
    gradePoints: {
      A: { type: Number, default: 5 },
      B: { type: Number, default: 3 },
      C: { type: Number, default: 1 },
    },
  },
  titlesConfig: {
    maleChampionTitle: {
      type: String,
      default: 'Kalaprathibha', // or "Individual Champion (Boys)"
    },
    femaleChampionTitle: {
      type: String,
      default: 'Kalathilakam', // or "Individual Champion (Girls)"
    },
    generalChampionTitle: {
      type: String,
      default: 'Overall Champion',
    },
  },
  appealConfig: {
    allowed: {
      type: Boolean,
      default: true,
    },
    fee: {
      type: Number,
      default: 500, // standard appeal caution deposit
    },
    timeLimitMinutes: {
      type: Number,
      default: 60, // 60 mins from result publication
    },
  },
  certificateConfig: {
    headerTitle: {
      type: String,
      default: 'Certificate of Merit & Excellence',
    },
    templateStyle: {
      type: String,
      default: 'royal_gold', // 'royal_gold', 'modern_navy', 'classic_emerald'
    },
    signatory1: {
      type: String,
      default: 'General Convener',
    },
    signatory2: {
      type: String,
      default: 'Principal',
    },
    signatory3: {
      type: String,
      default: 'Headmaster / General Captain',
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

festEventSchema.index({ academicYear: 1, status: 1 });
festEventSchema.index({ eventType: 1 });

module.exports = mongoose.model('FestEvent', festEventSchema);
