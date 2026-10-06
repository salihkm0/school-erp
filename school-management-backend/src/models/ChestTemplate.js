// src/models/ChestTemplate.js
const mongoose = require('mongoose');

const chestTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  layout: {
    type: String,
    enum: ['4_per_page', '6_per_page', '8_per_page', 'single_jersey'],
    default: '6_per_page',
  },
  theme: {
    type: String,
    enum: ['classic_white', 'royal_gold', 'modern_neon', 'sport_bold', 'minimal_clean'],
    default: 'classic_white',
  },
  showPhoto: {
    type: Boolean,
    default: false,
  },
  showQr: {
    type: Boolean,
    default: true,
  },
  showBarcode: {
    type: Boolean,
    default: false,
  },
  showItemsList: {
    type: Boolean,
    default: true,
  },
  showSchoolLogo: {
    type: Boolean,
    default: true,
  },
  showHouseBanner: {
    type: Boolean,
    default: true,
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra_large'],
    default: 'large',
  },
  customHeader: {
    type: String,
    default: '',
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

module.exports = mongoose.model('ChestTemplate', chestTemplateSchema);
