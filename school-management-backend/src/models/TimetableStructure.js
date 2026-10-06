const mongoose = require('mongoose');

const PeriodConfigSchema = new mongoose.Schema({
  periodNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true // e.g. "09:00"
  },
  endTime: {
    type: String,
    required: true // e.g. "09:45"
  },
  type: {
    type: String,
    enum: ['regular', 'lab', 'activity', 'assembly', 'break', 'zero_period'],
    default: 'regular'
  },
  isBreak: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const RoomConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Classroom', 'Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer Lab', 'Smart Class', 'Library', 'Auditorium', 'Ground/Court', 'Other'],
    default: 'Classroom'
  },
  capacity: {
    type: Number,
    default: 50
  },
  building: {
    type: String,
    default: 'Main Block'
  },
  floor: {
    type: String,
    default: 'Ground'
  }
}, { _id: false });

const TimetableStructureSchema = new mongoose.Schema({
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true,
    unique: true
  },
  workingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  periods: [PeriodConfigSchema],
  rooms: [RoomConfigSchema],
  maxTeacherPeriodsPerWeek: {
    type: Number,
    default: 28
  },
  maxTeacherPeriodsPerDay: {
    type: Number,
    default: 6
  },
  maxConsecutivePeriods: {
    type: Number,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.TimetableStructure || mongoose.model('TimetableStructure', TimetableStructureSchema);
