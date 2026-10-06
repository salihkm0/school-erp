const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['public', 'religious', 'school', 'emergency'],
    default: 'public'
  },
  description: String
});

const AttendanceTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  month: {
    type: Number,
    min: 1,
    max: 12
  },
  year: {
    type: Number
  },
  totalWorkingDays: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  holidays: [HolidaySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  totalWorkingDays: {
    type: Number,
    required: true,
    default: 0
  },
  totalHolidays: {
    type: Number,
    default: 0
  },
  presentDays: {
    type: Number,
    default: 0
  },
  absentDays: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceTemplate'
  },
  holidays: [HolidaySchema],
  remarks: String
}, {
  timestamps: true
});

// Pre-save middleware to calculate percentage
AttendanceSchema.pre('save', function(next) {
  if (this.totalWorkingDays > 0) {
    this.percentage = (this.presentDays / this.totalWorkingDays) * 100;
  } else {
    this.percentage = 0;
  }
  next();
});

// ── Daily Attendance Schema ──────────────────────────────────────────────
const DailyAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dateString: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'excused'],
    default: 'present',
    required: true
  },
  session: {
    type: String,
    enum: ['full_day', 'morning', 'afternoon'],
    default: 'full_day'
  },
  remarks: {
    type: String,
    default: ''
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isNotified: {
    type: Boolean,
    default: false
  },
  notifiedAt: Date
}, {
  timestamps: true
});

// ── Daily Attendance Session / Class Log Schema ──────────────────────────
const DailyAttendanceSessionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dateString: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  session: {
    type: String,
    enum: ['full_day', 'morning', 'afternoon'],
    default: 'full_day'
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  lateCount: {
    type: Number,
    default: 0
  },
  halfDayCount: {
    type: Number,
    default: 0
  },
  excusedCount: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isSubmitted: {
    type: Boolean,
    default: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ── Indexes ──────────────────────────────────────────────────────────
AttendanceTemplateSchema.index({ classId: 1, year: 1, month: 1, isActive: 1 });
AttendanceTemplateSchema.index({ academicYearId: 1 });

AttendanceSchema.index({ studentId: 1, year: 1, month: 1 }, { unique: true });
AttendanceSchema.index({ classId: 1, year: 1, month: 1 });
AttendanceSchema.index({ academicYearId: 1 });

DailyAttendanceSchema.index({ studentId: 1, dateString: 1, session: 1 }, { unique: true });
DailyAttendanceSchema.index({ classId: 1, dateString: 1, session: 1 });
DailyAttendanceSchema.index({ classId: 1, year: 1, month: 1 });
DailyAttendanceSchema.index({ studentId: 1, year: 1, month: 1 });
DailyAttendanceSchema.index({ academicYearId: 1 });

DailyAttendanceSessionSchema.index({ classId: 1, dateString: 1, session: 1 }, { unique: true });
DailyAttendanceSessionSchema.index({ dateString: 1 });
DailyAttendanceSessionSchema.index({ classId: 1, year: 1, month: 1 });

// Create models
const AttendanceModel = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
const AttendanceTemplateModel = mongoose.models.AttendanceTemplate || mongoose.model('AttendanceTemplate', AttendanceTemplateSchema);
const DailyAttendanceModel = mongoose.models.DailyAttendance || mongoose.model('DailyAttendance', DailyAttendanceSchema);
const DailyAttendanceSessionModel = mongoose.models.DailyAttendanceSession || mongoose.model('DailyAttendanceSession', DailyAttendanceSessionSchema);

// Export as an object with named exports
module.exports = {
  Attendance: AttendanceModel,
  AttendanceTemplate: AttendanceTemplateModel,
  DailyAttendance: DailyAttendanceModel,
  DailyAttendanceSession: DailyAttendanceSessionModel
};