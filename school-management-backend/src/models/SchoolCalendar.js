// src/models/SchoolCalendar.js
const mongoose = require('mongoose');

const SchoolCalendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'public_holiday',       // National / State Gazetted Holidays (e.g. Independence Day, Gandhi Jayanti)
      'vacation',             // Multi-day term vacations (e.g. Summer Vacation, Onam Holidays, Winter Break)
      'school_event',          // Annual Day, Sports Meet, Arts Fest / Kalolsavam, Science Exhibition
      'examination_period',   // Term / Board Examination Schedules
      'restricted_holiday',   // Optional / Restricted Holidays
      'special_working_day'   // Compensatory working day on a weekend
    ],
    default: 'public_holiday'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear'
  },
  description: {
    type: String,
    default: ''
  },
  applicableTo: {
    type: String,
    enum: ['all', 'students_only', 'staff_only', 'specific_classes'],
    default: 'all'
  },
  classIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  color: {
    type: String,
    default: ''
  },
  isNationalHoliday: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

SchoolCalendarSchema.index({ startDate: 1, endDate: 1 });
SchoolCalendarSchema.index({ academicYearId: 1, type: 1 });
SchoolCalendarSchema.index({ type: 1 });

module.exports = mongoose.models.SchoolCalendar || mongoose.model('SchoolCalendar', SchoolCalendarSchema);
