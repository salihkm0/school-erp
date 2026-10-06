const mongoose = require('mongoose');

const TeacherSubstitutionSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  periodNumber: {
    type: Number,
    required: true
  },
  startTime: String,
  endTime: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  originalTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true
  },
  originalTeacherName: String,
  substituteTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    index: true
  },
  substituteTeacherName: String,
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  subjectName: String,
  room: String,
  reason: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Official Duty', 'Training / Workshop', 'Emergency', 'Other'],
    default: 'Casual Leave'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'notified', 'completed', 'cancelled'],
    default: 'assigned'
  },
  remarks: String,
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

TeacherSubstitutionSchema.index({ date: 1, periodNumber: 1, classId: 1 });
TeacherSubstitutionSchema.index({ date: 1, substituteTeacherId: 1 });

module.exports = mongoose.models.TeacherSubstitution || mongoose.model('TeacherSubstitution', TeacherSubstitutionSchema);
