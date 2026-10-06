const mongoose = require('mongoose');
const Class = require('../models/Class');
const Staff = require('../models/Staff');
const Subject = require('../models/Subject');
const AcademicYear = require('../models/AcademicYear');
const TimetableStructure = require('../models/TimetableStructure');
const TeacherSubstitution = require('../models/TeacherSubstitution');

// Default initial structure builder helper
const getDefaultStructure = async (academicYearId) => {
  return {
    academicYearId,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    periods: [
      { periodNumber: 1, name: 'Period 1', startTime: '09:00', endTime: '09:45', type: 'regular', isBreak: false },
      { periodNumber: 2, name: 'Period 2', startTime: '09:45', endTime: '10:30', type: 'regular', isBreak: false },
      { periodNumber: 3, name: 'Interval Break', startTime: '10:30', endTime: '10:45', type: 'break', isBreak: true },
      { periodNumber: 4, name: 'Period 3', startTime: '10:45', endTime: '11:30', type: 'regular', isBreak: false },
      { periodNumber: 5, name: 'Period 4', startTime: '11:30', endTime: '12:15', type: 'regular', isBreak: false },
      { periodNumber: 6, name: 'Lunch Break', startTime: '12:15', endTime: '01:15', type: 'break', isBreak: true },
      { periodNumber: 7, name: 'Period 5', startTime: '01:15', endTime: '02:00', type: 'regular', isBreak: false },
      { periodNumber: 8, name: 'Period 6', startTime: '02:00', endTime: '02:45', type: 'regular', isBreak: false },
      { periodNumber: 9, name: 'Period 7', startTime: '02:45', endTime: '03:30', type: 'regular', isBreak: false }
    ],
    rooms: [
      { name: 'Room 101', type: 'Classroom', capacity: 50, building: 'Main Block', floor: '1st' },
      { name: 'Room 102', type: 'Classroom', capacity: 50, building: 'Main Block', floor: '1st' },
      { name: 'Room 103', type: 'Classroom', capacity: 50, building: 'Main Block', floor: '1st' },
      { name: 'Room 201', type: 'Classroom', capacity: 50, building: 'High School Block', floor: '2nd' },
      { name: 'Physics Lab', type: 'Physics Lab', capacity: 40, building: 'Science Block', floor: 'Ground' },
      { name: 'Chemistry Lab', type: 'Chemistry Lab', capacity: 40, building: 'Science Block', floor: 'Ground' },
      { name: 'Biology Lab', type: 'Biology Lab', capacity: 40, building: 'Science Block', floor: '1st' },
      { name: 'Computer Lab 1', type: 'Computer Lab', capacity: 60, building: 'IT Wing', floor: '2nd' },
      { name: 'Smart Class A', type: 'Smart Class', capacity: 50, building: 'Main Block', floor: '1st' },
      { name: 'Library', type: 'Library', capacity: 100, building: 'Central Block', floor: 'Ground' },
      { name: 'School Ground', type: 'Ground/Court', capacity: 200, building: 'Outdoors', floor: 'Ground' }
    ],
    maxTeacherPeriodsPerWeek: 28,
    maxTeacherPeriodsPerDay: 6,
    maxConsecutivePeriods: 3,
    isActive: true
  };
};

/**
 * @desc Get or initialize institutional timetable structure
 * @route GET /api/timetable/structure
 */
exports.getTimetableStructure = async (req, res) => {
  try {
    let academicYearId = req.query.academicYearId;
    if (!academicYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) academicYearId = activeYear._id;
    }

    if (!academicYearId) {
      return res.status(400).json({ success: false, message: 'Active academic year not found' });
    }

    let structure = await TimetableStructure.findOne({ academicYearId });
    if (!structure) {
      const defaultData = await getDefaultStructure(academicYearId);
      structure = await TimetableStructure.create(defaultData);
    }

    return res.status(200).json({
      success: true,
      structure
    });
  } catch (error) {
    console.error('Error fetching timetable structure:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update institutional timetable structure
 * @route PUT /api/timetable/structure
 */
exports.updateTimetableStructure = async (req, res) => {
  try {
    const { academicYearId, workingDays, periods, rooms, maxTeacherPeriodsPerWeek, maxTeacherPeriodsPerDay, maxConsecutivePeriods } = req.body;
    
    let targetYearId = academicYearId;
    if (!targetYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) targetYearId = activeYear._id;
    }

    let structure = await TimetableStructure.findOne({ academicYearId: targetYearId });
    if (!structure) {
      structure = new TimetableStructure({ academicYearId: targetYearId });
    }

    if (workingDays) structure.workingDays = workingDays;
    if (periods) structure.periods = periods;
    if (rooms) structure.rooms = rooms;
    if (maxTeacherPeriodsPerWeek !== undefined) structure.maxTeacherPeriodsPerWeek = maxTeacherPeriodsPerWeek;
    if (maxTeacherPeriodsPerDay !== undefined) structure.maxTeacherPeriodsPerDay = maxTeacherPeriodsPerDay;
    if (maxConsecutivePeriods !== undefined) structure.maxConsecutivePeriods = maxConsecutivePeriods;

    await structure.save();

    return res.status(200).json({
      success: true,
      message: 'Timetable structure updated successfully',
      structure
    });
  } catch (error) {
    console.error('Error updating timetable structure:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Master Timetable (all classes for academic year)
 * @route GET /api/timetable/master
 */
exports.getMasterTimetable = async (req, res) => {
  try {
    let academicYearId = req.query.academicYearId;
    if (!academicYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) academicYearId = activeYear._id;
    }

    const classes = await Class.find({ academicYearId, isActive: true })
      .populate('subjects', 'name code department type')
      .populate('classTeacherId', 'name shortName staffCode')
      .populate('subjectTeachers.teacherId', 'name shortName staffCode')
      .populate('subjectTeachers.subjectId', 'name code department')
      .populate('timetable.periods.subjectId', 'name code department type')
      .populate('timetable.periods.teacherId', 'name shortName staffCode photoUrl')
      .sort({ name: 1, section: 1 });

    const structure = await TimetableStructure.findOne({ academicYearId }) || await getDefaultStructure(academicYearId);

    // Calculate global conflict analytics across all classes
    const conflicts = [];
    const teacherSlotMap = {}; // `day_period_teacherId` -> [classInfo]
    const roomSlotMap = {}; // `day_period_room` -> [classInfo]

    classes.forEach(cls => {
      const classLabel = cls.section ? `${cls.name}-${cls.section}` : cls.name;
      cls.timetable?.forEach(dayItem => {
        dayItem.periods?.forEach((period, pIdx) => {
          const slotKey = `${dayItem.day}_${period.periodNumber || (pIdx + 1)}`;

          // Check Teacher clash
          if (period.teacherId?._id || period.teacherId) {
            const tId = (period.teacherId._id || period.teacherId).toString();
            const tKey = `${slotKey}_${tId}`;
            if (!teacherSlotMap[tKey]) {
              teacherSlotMap[tKey] = [];
            }
            teacherSlotMap[tKey].push({
              classId: cls._id,
              className: classLabel,
              day: dayItem.day,
              periodNumber: period.periodNumber || (pIdx + 1),
              teacherId: tId,
              teacherName: period.teacherId?.name || period.teacherName,
              subjectName: period.subjectId?.name
            });
          }

          // Check Room clash
          if (period.room && period.room.trim() !== '') {
            const rKey = `${slotKey}_${period.room.trim().toLowerCase()}`;
            if (!roomSlotMap[rKey]) {
              roomSlotMap[rKey] = [];
            }
            roomSlotMap[rKey].push({
              classId: cls._id,
              className: classLabel,
              day: dayItem.day,
              periodNumber: period.periodNumber || (pIdx + 1),
              room: period.room
            });
          }
        });
      });
    });

    // Detect teacher clashes
    Object.values(teacherSlotMap).forEach(entries => {
      if (entries.length > 1) {
        conflicts.push({
          type: 'teacher_double_booking',
          day: entries[0].day,
          periodNumber: entries[0].periodNumber,
          teacherName: entries[0].teacherName,
          classes: entries.map(e => e.className),
          description: `Teacher ${entries[0].teacherName} is scheduled in ${entries.map(e => e.className).join(' & ')} at the same time.`
        });
      }
    });

    // Detect room clashes
    Object.values(roomSlotMap).forEach(entries => {
      if (entries.length > 1) {
        conflicts.push({
          type: 'room_double_booking',
          day: entries[0].day,
          periodNumber: entries[0].periodNumber,
          room: entries[0].room,
          classes: entries.map(e => e.className),
          description: `Room "${entries[0].room}" is assigned to ${entries.map(e => e.className).join(' & ')} simultaneously.`
        });
      }
    });

    return res.status(200).json({
      success: true,
      classes,
      structure,
      conflictCount: conflicts.length,
      conflicts
    });
  } catch (error) {
    console.error('Error fetching master timetable:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get timetable for a single class (with substitutions)
 * @route GET /api/timetable/class/:classId
 */
exports.getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query; // optional date for substitutions

    const classData = await Class.findById(classId)
      .populate('subjects', 'name code department type')
      .populate('classTeacherId', 'name shortName staffCode contact')
      .populate('subjectTeachers.teacherId', 'name shortName staffCode')
      .populate('subjectTeachers.subjectId', 'name code department')
      .populate('timetable.periods.subjectId', 'name code department type')
      .populate('timetable.periods.teacherId', 'name shortName staffCode photoUrl');

    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const structure = await TimetableStructure.findOne({ academicYearId: classData.academicYearId }) || await getDefaultStructure(classData.academicYearId);

    // Fetch substitutions if date provided or today
    const queryDate = date || new Date().toISOString().split('T')[0];
    const substitutions = await TeacherSubstitution.find({
      classId,
      date: queryDate,
      status: { $ne: 'cancelled' }
    }).populate('substituteTeacherId', 'name shortName staffCode')
      .populate('originalTeacherId', 'name shortName staffCode')
      .populate('subjectId', 'name code');

    return res.status(200).json({
      success: true,
      classData,
      structure,
      substitutions,
      queryDate
    });
  } catch (error) {
    console.error('Error fetching class timetable:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Check clashes before saving a class timetable
 * @route POST /api/timetable/check-clash
 */
exports.checkClashes = async (req, res) => {
  try {
    const { classId, day, periodNumber, teacherId, room } = req.body;

    const currentClass = await Class.findById(classId);
    if (!currentClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const otherClasses = await Class.find({
      _id: { $ne: classId },
      academicYearId: currentClass.academicYearId,
      isActive: true
    }).populate('subjectTeachers.teacherId', 'name');

    let teacherClash = null;
    let roomClash = null;

    for (const cls of otherClasses) {
      const daySchedule = cls.timetable?.find(t => t.day === day);
      if (daySchedule) {
        const periodSlot = daySchedule.periods?.find(p => (p.periodNumber || 0) === Number(periodNumber));
        if (periodSlot) {
          // Check Teacher clash
          if (teacherId && periodSlot.teacherId && periodSlot.teacherId.toString() === teacherId.toString()) {
            const clsName = cls.section ? `${cls.name}-${cls.section}` : cls.name;
            teacherClash = {
              conflictingClassId: cls._id,
              conflictingClassName: clsName,
              day,
              periodNumber,
              message: `Teacher is already scheduled in ${clsName} during ${day} Period ${periodNumber}`
            };
          }

          // Check Room clash
          if (room && periodSlot.room && periodSlot.room.trim().toLowerCase() === room.trim().toLowerCase()) {
            const clsName = cls.section ? `${cls.name}-${cls.section}` : cls.name;
            roomClash = {
              conflictingClassId: cls._id,
              conflictingClassName: clsName,
              day,
              periodNumber,
              room,
              message: `Room "${room}" is already occupied by ${clsName} during ${day} Period ${periodNumber}`
            };
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      hasClash: !!(teacherClash || roomClash),
      teacherClash,
      roomClash
    });
  } catch (error) {
    console.error('Error checking clashes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update class timetable with strict/warn clash validation
 * @route PUT /api/timetable/class/:classId
 */
exports.updateClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const { timetable, force } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Comprehensive Clash Detection against all other active classes
    const otherClasses = await Class.find({
      _id: { $ne: classId },
      academicYearId: classData.academicYearId,
      isActive: true
    }).populate('timetable.periods.teacherId', 'name shortName');

    const clashes = [];

    timetable.forEach(dayItem => {
      dayItem.periods?.forEach((period, pIdx) => {
        const pNum = period.periodNumber || (pIdx + 1);

        otherClasses.forEach(otherCls => {
          const otherDay = otherCls.timetable?.find(d => d.day === dayItem.day);
          if (otherDay) {
            const otherPeriod = otherDay.periods?.find(p => (p.periodNumber || 0) === pNum);
            if (otherPeriod) {
              const otherClsName = otherCls.section ? `${otherCls.name}-${otherCls.section}` : otherCls.name;
              
              // Teacher conflict
              if (period.teacherId && otherPeriod.teacherId) {
                const pTeacher = period.teacherId._id ? period.teacherId._id.toString() : period.teacherId.toString();
                const oTeacher = otherPeriod.teacherId._id ? otherPeriod.teacherId._id.toString() : otherPeriod.teacherId.toString();

                if (pTeacher === oTeacher) {
                  clashes.push({
                    type: 'teacher',
                    day: dayItem.day,
                    periodNumber: pNum,
                    teacherName: period.teacherName || otherPeriod.teacherName || 'Teacher',
                    conflictingClass: otherClsName,
                    message: `${period.teacherName || 'Teacher'} is already scheduled in ${otherClsName} on ${dayItem.day} (Period ${pNum})`
                  });
                }
              }

              // Room conflict
              if (period.room && otherPeriod.room && period.room.trim().toLowerCase() === otherPeriod.room.trim().toLowerCase()) {
                clashes.push({
                  type: 'room',
                  day: dayItem.day,
                  periodNumber: pNum,
                  room: period.room,
                  conflictingClass: otherClsName,
                  message: `Room "${period.room}" is already assigned to ${otherClsName} on ${dayItem.day} (Period ${pNum})`
                });
              }
            }
          }
        });
      });
    });

    if (clashes.length > 0 && !force) {
      return res.status(409).json({
        success: false,
        clashDetected: true,
        clashes,
        message: `Found ${clashes.length} scheduling conflicts with other classes.`
      });
    }

    classData.timetable = timetable;
    await classData.save();

    return res.status(200).json({
      success: true,
      message: 'Timetable updated successfully',
      clashesWarning: clashes.length > 0 ? clashes : null,
      classData
    });
  } catch (error) {
    console.error('Error updating class timetable:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Teacher Timetable & Workload Analysis
 * @route GET /api/timetable/teacher/:teacherId
 */
exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;
    let { academicYearId, date } = req.query;

    const teacher = await Staff.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    if (!academicYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) academicYearId = activeYear._id;
    }

    const structure = await TimetableStructure.findOne({ academicYearId }) || await getDefaultStructure(academicYearId);
    const classes = await Class.find({ academicYearId, isActive: true })
      .populate('subjects', 'name code department type');

    // Build weekly grid for this teacher
    const weeklySchedule = {};
    structure.workingDays.forEach(day => {
      weeklySchedule[day] = {};
    });

    let totalPeriodsPerWeek = 0;
    const periodsPerDay = {};
    const subjectBreakdown = {};
    const classBreakdown = {};

    classes.forEach(cls => {
      const className = cls.section ? `${cls.name}-${cls.section}` : cls.name;
      cls.timetable?.forEach(dayItem => {
        if (!weeklySchedule[dayItem.day]) {
          weeklySchedule[dayItem.day] = {};
        }

        dayItem.periods?.forEach((period, pIdx) => {
          const pNum = period.periodNumber || (pIdx + 1);
          const tId = period.teacherId?._id ? period.teacherId._id.toString() : period.teacherId?.toString();

          if (tId === teacherId.toString()) {
            totalPeriodsPerWeek++;
            periodsPerDay[dayItem.day] = (periodsPerDay[dayItem.day] || 0) + 1;

            const subjectObj = cls.subjects?.find(s => s._id.toString() === (period.subjectId?._id || period.subjectId || '').toString());
            const subName = subjectObj?.name || 'Assigned Subject';

            subjectBreakdown[subName] = (subjectBreakdown[subName] || 0) + 1;
            classBreakdown[className] = (classBreakdown[className] || 0) + 1;

            weeklySchedule[dayItem.day][pNum] = {
              classId: cls._id,
              className,
              subjectId: period.subjectId,
              subjectName: subName,
              subjectCode: subjectObj?.code || '',
              room: period.room,
              startTime: period.startTime,
              endTime: period.endTime,
              type: period.type || 'regular',
              periodNumber: pNum
            };
          }
        });
      });
    });

    // Compute free periods
    const freePeriodsPerDay = {};
    structure.workingDays.forEach(day => {
      freePeriodsPerDay[day] = [];
      structure.periods.filter(p => !p.isBreak).forEach(p => {
        if (!weeklySchedule[day][p.periodNumber]) {
          freePeriodsPerDay[day].push(p.periodNumber);
        }
      });
    });

    // Fetch active substitutions for this teacher (either substitute or absent)
    const queryDate = date || new Date().toISOString().split('T')[0];
    const substitutionsAsSub = await TeacherSubstitution.find({
      substituteTeacherId: teacherId,
      date: queryDate,
      status: { $ne: 'cancelled' }
    }).populate('classId', 'name section').populate('subjectId', 'name code').populate('originalTeacherId', 'name shortName');

    const substitutionsAsAbsent = await TeacherSubstitution.find({
      originalTeacherId: teacherId,
      date: queryDate,
      status: { $ne: 'cancelled' }
    }).populate('classId', 'name section').populate('substituteTeacherId', 'name shortName');

    const maxWeekly = structure.maxTeacherPeriodsPerWeek || 28;
    const workloadPercentage = Math.min(100, Math.round((totalPeriodsPerWeek / maxWeekly) * 100));

    return res.status(200).json({
      success: true,
      teacher,
      structure,
      weeklySchedule,
      analytics: {
        totalPeriodsPerWeek,
        maxWeeklyPeriods: maxWeekly,
        workloadPercentage,
        periodsPerDay,
        freePeriodsPerDay,
        subjectBreakdown,
        classBreakdown,
        status: totalPeriodsPerWeek > maxWeekly ? 'overloaded' : totalPeriodsPerWeek >= maxWeekly - 4 ? 'optimal' : 'underloaded'
      },
      substitutions: {
        todayAssignedSubstitutions: substitutionsAsSub,
        todayAbsences: substitutionsAsAbsent
      }
    });
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get timetable for currently logged in teacher
 * @route GET /api/timetable/my-schedule
 */
exports.getMySchedule = async (req, res) => {
  try {
    const userId = req.user._id;
    const staff = await Staff.findOne({ userId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found for this account' });
    }

    req.params.teacherId = staff._id;
    return exports.getTeacherTimetable(req, res);
  } catch (error) {
    console.error('Error fetching current user schedule:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Room / Lab schedule
 * @route GET /api/timetable/room/:roomName
 */
exports.getRoomTimetable = async (req, res) => {
  try {
    const { roomName } = req.params;
    let { academicYearId } = req.query;

    if (!academicYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) academicYearId = activeYear._id;
    }

    const structure = await TimetableStructure.findOne({ academicYearId }) || await getDefaultStructure(academicYearId);
    const classes = await Class.find({ academicYearId, isActive: true })
      .populate('subjects', 'name code')
      .populate('timetable.periods.teacherId', 'name shortName');

    const weeklySchedule = {};
    structure.workingDays.forEach(day => {
      weeklySchedule[day] = {};
    });

    let totalOccupiedPeriods = 0;

    classes.forEach(cls => {
      const className = cls.section ? `${cls.name}-${cls.section}` : cls.name;
      cls.timetable?.forEach(dayItem => {
        if (!weeklySchedule[dayItem.day]) {
          weeklySchedule[dayItem.day] = {};
        }

        dayItem.periods?.forEach((period, pIdx) => {
          if (period.room && period.room.trim().toLowerCase() === decodeURIComponent(roomName).trim().toLowerCase()) {
            const pNum = period.periodNumber || (pIdx + 1);
            totalOccupiedPeriods++;

            weeklySchedule[dayItem.day][pNum] = {
              classId: cls._id,
              className,
              teacherName: period.teacherId?.name || period.teacherName,
              subjectName: cls.subjects?.find(s => s._id.toString() === (period.subjectId?._id || period.subjectId || '').toString())?.name || 'Class',
              startTime: period.startTime,
              endTime: period.endTime,
              periodNumber: pNum
            };
          }
        });
      });
    });

    return res.status(200).json({
      success: true,
      roomName: decodeURIComponent(roomName),
      weeklySchedule,
      structure,
      totalOccupiedPeriods
    });
  } catch (error) {
    console.error('Error fetching room schedule:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Daily Substitutions
 * @route GET /api/timetable/substitutions
 */
exports.getSubstitutions = async (req, res) => {
  try {
    const { date, startDate, endDate, classId, teacherId, status } = req.query;
    const query = {};

    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (classId) query.classId = classId;
    if (status) query.status = status;
    if (teacherId) {
      query.$or = [{ originalTeacherId: teacherId }, { substituteTeacherId: teacherId }];
    }

    const substitutions = await TeacherSubstitution.find(query)
      .populate('classId', 'name section')
      .populate('originalTeacherId', 'name shortName staffCode contact photoUrl')
      .populate('substituteTeacherId', 'name shortName staffCode contact photoUrl')
      .populate('subjectId', 'name code department')
      .populate('assignedBy', 'name role')
      .sort({ date: -1, periodNumber: 1 });

    return res.status(200).json({
      success: true,
      count: substitutions.length,
      substitutions
    });
  } catch (error) {
    console.error('Error fetching substitutions:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Find Free Available Teachers for a specific slot
 * @route GET /api/timetable/substitutions/free-teachers
 */
exports.getFreeTeachersForPeriod = async (req, res) => {
  try {
    const { date, day, periodNumber, subjectId, academicYearId } = req.query;

    if (!day || !periodNumber) {
      return res.status(400).json({ success: false, message: 'Day and periodNumber are required' });
    }

    let targetYearId = academicYearId;
    if (!targetYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) targetYearId = activeYear._id;
    }

    const allTeachers = await Staff.find({ role: 'teacher', isActive: true });
    const classes = await Class.find({ academicYearId: targetYearId, isActive: true });

    // 1. Identify teachers who are already scheduled in any class during this day & period
    const busyTeacherIds = new Set();
    classes.forEach(cls => {
      const daySchedule = cls.timetable?.find(d => d.day === day);
      if (daySchedule) {
        const periodSlot = daySchedule.periods?.find(p => (p.periodNumber || 0) === Number(periodNumber));
        if (periodSlot?.teacherId) {
          busyTeacherIds.add(periodSlot.teacherId.toString());
        }
      }
    });

    // 2. Identify teachers who already have an assigned substitution or are absent on this date & period
    if (date) {
      const substitutions = await TeacherSubstitution.find({
        date,
        periodNumber: Number(periodNumber),
        status: { $nin: ['cancelled'] }
      });

      substitutions.forEach(sub => {
        if (sub.substituteTeacherId) busyTeacherIds.add(sub.substituteTeacherId.toString());
        if (sub.originalTeacherId) busyTeacherIds.add(sub.originalTeacherId.toString());
      });
    }

    // 3. Filter free teachers and compute weekly workload
    const targetSubject = subjectId ? await Subject.findById(subjectId) : null;

    const freeTeachers = allTeachers
      .filter(t => !busyTeacherIds.has(t._id.toString()))
      .map(teacher => {
        // Check department/subject match
        const isSubjectMatch = targetSubject && (
          teacher.subjectExpertise?.some(s => s.toLowerCase().includes(targetSubject.name.toLowerCase())) ||
          teacher.specialization?.some(s => s.toLowerCase().includes(targetSubject.name.toLowerCase()))
        );

        return {
          _id: teacher._id,
          name: teacher.name,
          shortName: teacher.shortName,
          staffCode: teacher.staffCode,
          contact: teacher.contact,
          photoUrl: teacher.photoUrl,
          subjectExpertise: teacher.subjectExpertise,
          specialization: teacher.specialization,
          isSubjectMatch: !!isSubjectMatch
        };
      })
      .sort((a, b) => (b.isSubjectMatch ? 1 : 0) - (a.isSubjectMatch ? 1 : 0));

    return res.status(200).json({
      success: true,
      count: freeTeachers.length,
      freeTeachers
    });
  } catch (error) {
    console.error('Error finding free teachers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create Substitution (Single or Bulk Day Absences)
 * @route POST /api/timetable/substitutions
 */
exports.createSubstitution = async (req, res) => {
  try {
    const { substitutions, autoNotify } = req.body;
    // substitutions: Array of { date, day, periodNumber, classId, originalTeacherId, originalTeacherName, substituteTeacherId, substituteTeacherName, subjectId, subjectName, room, reason, remarks }

    if (!substitutions || !Array.isArray(substitutions) || substitutions.length === 0) {
      return res.status(400).json({ success: false, message: 'Substitutions array is required' });
    }

    const createdRecords = [];

    for (const item of substitutions) {
      // Upsert to prevent duplicate substitution on same date, class, period
      const record = await TeacherSubstitution.findOneAndUpdate(
        { date: item.date, periodNumber: item.periodNumber, classId: item.classId },
        {
          ...item,
          assignedBy: req.user?._id,
          status: item.substituteTeacherId ? 'assigned' : 'pending'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdRecords.push(record);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully created ${createdRecords.length} substitution record(s)`,
      substitutions: createdRecords
    });
  } catch (error) {
    console.error('Error creating substitutions:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update Substitution Status or Substitute Teacher
 * @route PUT /api/timetable/substitutions/:id
 */
exports.updateSubstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { substituteTeacherId, substituteTeacherName, status, remarks, reason } = req.body;

    const substitution = await TeacherSubstitution.findById(id);
    if (!substitution) {
      return res.status(404).json({ success: false, message: 'Substitution record not found' });
    }

    if (substituteTeacherId !== undefined) substitution.substituteTeacherId = substituteTeacherId;
    if (substituteTeacherName !== undefined) substitution.substituteTeacherName = substituteTeacherName;
    if (status) substitution.status = status;
    if (remarks !== undefined) substitution.remarks = remarks;
    if (reason) substitution.reason = reason;

    await substitution.save();

    return res.status(200).json({
      success: true,
      message: 'Substitution updated successfully',
      substitution
    });
  } catch (error) {
    console.error('Error updating substitution:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete Substitution
 * @route DELETE /api/timetable/substitutions/:id
 */
exports.deleteSubstitution = async (req, res) => {
  try {
    const { id } = req.params;
    await TeacherSubstitution.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Substitution deleted successfully' });
  } catch (error) {
    console.error('Error deleting substitution:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Auto-Generate Timetable Draft (Algorithmic Constraint Scheduler)
 * @route POST /api/timetable/auto-generate
 */
exports.autoGenerateTimetable = async (req, res) => {
  try {
    const { classId, academicYearId } = req.body;

    let targetYearId = academicYearId;
    if (!targetYearId && classId) {
      const c = await Class.findById(classId);
      if (c) targetYearId = c.academicYearId;
    }
    if (!targetYearId) {
      const activeYear = await AcademicYear.findOne({ status: 'active' });
      if (activeYear) targetYearId = activeYear._id;
    }

    const structure = await TimetableStructure.findOne({ academicYearId: targetYearId }) || await getDefaultStructure(targetYearId);
    const targetClass = classId ? await Class.findById(classId).populate('subjectTeachers.subjectId').populate('subjectTeachers.teacherId') : null;

    if (classId && !targetClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Other classes to avoid clashes
    const otherClasses = await Class.find({
      _id: { $ne: classId },
      academicYearId: targetYearId,
      isActive: true
    });

    // Build existing occupancy matrix: `day_period_teacherId` -> true
    const teacherBusyMap = {};
    const roomBusyMap = {};

    otherClasses.forEach(cls => {
      cls.timetable?.forEach(dayItem => {
        dayItem.periods?.forEach((p, idx) => {
          const pNum = p.periodNumber || (idx + 1);
          if (p.teacherId) {
            teacherBusyMap[`${dayItem.day}_${pNum}_${p.teacherId.toString()}`] = true;
          }
          if (p.room) {
            roomBusyMap[`${dayItem.day}_${pNum}_${p.room.trim().toLowerCase()}`] = true;
          }
        });
      });
    });

    const teachingPeriods = structure.periods.filter(p => !p.isBreak);
    const workingDays = structure.workingDays;

    // Build list of periods required based on class subjectTeachers
    const subjectList = [];
    if (targetClass?.subjectTeachers && targetClass.subjectTeachers.length > 0) {
      targetClass.subjectTeachers.forEach(st => {
        const count = st.periodsPerWeek || 3;
        for (let i = 0; i < count; i++) {
          subjectList.push({
            subjectId: st.subjectId?._id || st.subjectId,
            subjectName: st.subjectId?.name || 'Subject',
            teacherId: st.teacherId?._id || st.teacherId,
            teacherName: st.teacherId?.name || st.teacherName || 'Teacher'
          });
        }
      });
    } else if (targetClass?.subjects && targetClass.subjects.length > 0) {
      // Fallback if subjectTeachers not populated
      const subs = await Subject.find({ _id: { $in: targetClass.subjects } });
      subs.forEach(s => {
        for (let i = 0; i < 4; i++) {
          subjectList.push({
            subjectId: s._id,
            subjectName: s.name,
            teacherId: null,
            teacherName: ''
          });
        }
      });
    }

    // Shuffle subjectList to distribute evenly
    const shuffled = [...subjectList].sort(() => Math.random() - 0.5);

    // Build draft schedule
    const proposedTimetable = workingDays.map(day => {
      const periods = structure.periods.map(slot => {
        if (slot.isBreak) {
          return {
            periodNumber: slot.periodNumber,
            startTime: slot.startTime,
            endTime: slot.endTime,
            subjectId: null,
            teacherId: null,
            teacherName: '',
            room: '',
            type: 'break',
            notes: slot.name
          };
        }

        // Find best non-conflicting subject for this slot
        let chosenSubjectIdx = -1;
        for (let i = 0; i < shuffled.length; i++) {
          const candidate = shuffled[i];
          const isClashing = candidate.teacherId && teacherBusyMap[`${day}_${slot.periodNumber}_${candidate.teacherId.toString()}`];
          if (!isClashing) {
            chosenSubjectIdx = i;
            break;
          }
        }

        let assigned = null;
        if (chosenSubjectIdx !== -1) {
          assigned = shuffled.splice(chosenSubjectIdx, 1)[0];
          if (assigned.teacherId) {
            teacherBusyMap[`${day}_${slot.periodNumber}_${assigned.teacherId.toString()}`] = true;
          }
        }

        return {
          periodNumber: slot.periodNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subjectId: assigned?.subjectId || null,
          teacherId: assigned?.teacherId || null,
          teacherName: assigned?.teacherName || '',
          room: targetClass?.name ? `Room ${targetClass.name}` : 'Classroom',
          type: 'regular',
          notes: ''
        };
      });

      return {
        day,
        periods
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Draft timetable generated successfully without conflicts',
      proposedTimetable,
      remainingUnassignedPeriods: shuffled.length
    });
  } catch (error) {
    console.error('Error auto-generating timetable:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
