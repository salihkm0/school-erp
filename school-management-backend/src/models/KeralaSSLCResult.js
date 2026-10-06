// src/models/KeralaSSLCResult.js
const mongoose = require('mongoose');

// Kerala 9-point grading scale mapping
const GRADE_POINTS = {
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C+': 5,
  'C': 4,
  'D+': 3,
  'D': 2,
  'E': 1
};

const SubjectGradeSchema = new mongoose.Schema({
  subjectCode: { type: String, default: '' },
  subjectName: { type: String, required: true },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E'],
    uppercase: true
  },
  gradePoint: { type: Number, default: 0 }
}, { _id: false });

const KeralaSSLCResultSchema = new mongoose.Schema({
  registerNumber: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  academicYear: {
    type: String,
    required: true,
    default: '2025-2026',
    index: true
  },
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  admissionNo: {
    type: String,
    trim: true,
    default: ''
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  schoolCode: {
    type: String,
    default: '18020',
    trim: true
  },
  schoolName: {
    type: String,
    default: 'PPMHSS KONDOTTY',
    trim: true
  },
  dob: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  category: {
    type: String,
    default: 'General'
  },
  subjects: {
    lang1: { type: SubjectGradeSchema, default: () => ({ subjectCode: '101', subjectName: 'Language Paper 1', grade: 'A+', gradePoint: 9 }) },
    lang2: { type: SubjectGradeSchema, default: () => ({ subjectCode: '102', subjectName: 'Language Paper 2', grade: 'A+', gradePoint: 9 }) },
    english: { type: SubjectGradeSchema, default: () => ({ subjectCode: '103', subjectName: 'English', grade: 'A+', gradePoint: 9 }) },
    hindi: { type: SubjectGradeSchema, default: () => ({ subjectCode: '104', subjectName: 'Hindi', grade: 'A+', gradePoint: 9 }) },
    socialScience: { type: SubjectGradeSchema, default: () => ({ subjectCode: '105', subjectName: 'Social Science', grade: 'A+', gradePoint: 9 }) },
    physics: { type: SubjectGradeSchema, default: () => ({ subjectCode: '106', subjectName: 'Physics', grade: 'A+', gradePoint: 9 }) },
    chemistry: { type: SubjectGradeSchema, default: () => ({ subjectCode: '107', subjectName: 'Chemistry', grade: 'A+', gradePoint: 9 }) },
    biology: { type: SubjectGradeSchema, default: () => ({ subjectCode: '108', subjectName: 'Biology', grade: 'A+', gradePoint: 9 }) },
    mathematics: { type: SubjectGradeSchema, default: () => ({ subjectCode: '109', subjectName: 'Mathematics', grade: 'A+', gradePoint: 9 }) },
    it: { type: SubjectGradeSchema, default: () => ({ subjectCode: '110', subjectName: 'Information Technology', grade: 'A+', gradePoint: 9 }) }
  },
  totalSubjects: {
    type: Number,
    default: 10
  },
  totalAPlusCount: {
    type: Number,
    default: 0
  },
  totalACount: {
    type: Number,
    default: 0
  },
  totalBPlusCount: {
    type: Number,
    default: 0
  },
  totalGradePoints: {
    type: Number,
    default: 0
  },
  gpa: {
    type: Number,
    default: 0
  },
  resultStatus: {
    type: String,
    enum: ['EHS', 'NHS'], // EHS = Eligible for Higher Studies, NHS = Not Eligible for Higher Studies
    default: 'EHS'
  },
  fullAPlus: {
    type: Boolean,
    default: false
  },
  remarks: {
    type: String,
    default: 'Eligible for Higher Studies (EHS)'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Composite unique index: registerNumber + academicYear
KeralaSSLCResultSchema.index({ registerNumber: 1, academicYear: 1 }, { unique: true });

// Pre-save hook to calculate grade points, A+ count, GPA, and result status
KeralaSSLCResultSchema.pre('save', function (next) {
  const subjectKeys = ['lang1', 'lang2', 'english', 'hindi', 'socialScience', 'physics', 'chemistry', 'biology', 'mathematics', 'it'];
  let aPlusCount = 0;
  let aCount = 0;
  let bPlusCount = 0;
  let totalPoints = 0;
  let isEligible = true;
  let validSubjectCount = 0;

  subjectKeys.forEach(key => {
    const sub = this.subjects[key];
    if (sub && sub.grade) {
      validSubjectCount++;
      const gradeUpper = sub.grade.toUpperCase();
      sub.grade = gradeUpper;
      sub.gradePoint = GRADE_POINTS[gradeUpper] || 1;
      totalPoints += sub.gradePoint;

      if (gradeUpper === 'A+') aPlusCount++;
      else if (gradeUpper === 'A') aCount++;
      else if (gradeUpper === 'B+') bPlusCount++;

      // In Kerala SSLC, grade 'D' or 'E' in any subject makes the student NHS
      if (gradeUpper === 'D' || gradeUpper === 'E') {
        isEligible = false;
      }
    }
  });

  this.totalSubjects = validSubjectCount || 10;
  this.totalAPlusCount = aPlusCount;
  this.totalACount = aCount;
  this.totalBPlusCount = bPlusCount;
  this.totalGradePoints = totalPoints;
  this.gpa = validSubjectCount > 0 ? Math.round((totalPoints / validSubjectCount) * 100) / 100 : 0;
  this.fullAPlus = aPlusCount === validSubjectCount && validSubjectCount >= 9;
  this.resultStatus = isEligible ? 'EHS' : 'NHS';
  this.remarks = isEligible ? 'Eligible for Higher Studies (EHS)' : 'Needs Improvement (NHS)';

  next();
});

const KeralaSSLCResult = mongoose.models.KeralaSSLCResult || mongoose.model('KeralaSSLCResult', KeralaSSLCResultSchema);
module.exports = KeralaSSLCResult;
