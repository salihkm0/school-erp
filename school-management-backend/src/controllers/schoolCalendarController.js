// src/controllers/schoolCalendarController.js
const SchoolCalendar = require('../models/SchoolCalendar');
const AcademicYear = require('../models/AcademicYear');
const Notification = require('../models/Notification');
const { broadcastToAll, broadcastToRole } = require('../config/socket');

// 1. Get Calendar Events / Holidays
exports.getCalendarEvents = async (req, res) => {
  try {
    const { academicYearId, type, startDate, endDate, month, year } = req.query;

    const query = {};
    if (academicYearId) query.academicYearId = academicYearId;
    if (type && type !== 'all') query.type = type;

    // Date range filtering
    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
      ];
    } else if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);
      query.$or = [
        { startDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { endDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { startDate: { $lte: startOfMonth }, endDate: { $gte: endOfMonth } }
      ];
    }

    const events = await SchoolCalendar.find(query)
      .populate('classIds', 'name section displayName')
      .populate('academicYearId', 'name year')
      .sort({ startDate: 1 });

    return res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error in getCalendarEvents:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Single Event / Holiday
exports.getCalendarEventById = async (req, res) => {
  try {
    const event = await SchoolCalendar.findById(req.params.id)
      .populate('classIds', 'name section displayName')
      .populate('academicYearId', 'name year');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    return res.json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create Calendar Holiday / Event
exports.createCalendarEvent = async (req, res) => {
  try {
    const {
      title,
      type = 'public_holiday',
      startDate,
      endDate,
      academicYearId,
      description,
      applicableTo = 'all',
      classIds = [],
      color,
      isNationalHoliday = false,
      notifyCommunity = false
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ success: false, message: 'Title and Start Date are required' });
    }

    // Default endDate to startDate if single-day event
    const finalEndDate = endDate ? new Date(endDate) : new Date(startDate);

    // Get active academic year if not provided
    let activeYearId = academicYearId;
    if (!activeYearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      activeYearId = activeYear?._id;
    }

    const event = await SchoolCalendar.create({
      title: title.trim(),
      type,
      startDate: new Date(startDate),
      endDate: finalEndDate,
      academicYearId: activeYearId,
      description: description || '',
      applicableTo,
      classIds,
      color: color || '',
      isNationalHoliday: Boolean(isNationalHoliday),
      createdBy: req.user?._id
    });

    // Optional Notification Broadcast to Parents and Staff
    if (notifyCommunity) {
      setImmediate(async () => {
        try {
          const dateStr = new Date(startDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const notifTitle = type === 'public_holiday' 
            ? `🌴 Holiday Alert: ${title}` 
            : type === 'vacation' 
            ? `🏖️ Vacation Notice: ${title}` 
            : `📅 School Event: ${title}`;

          const notifMessage = `${title} is scheduled for ${dateStr}. ${description || 'School holiday / event updated.'}`;

          // Broadcast notification event via websocket
          broadcastToAll('notification', {
            title: notifTitle,
            message: notifMessage,
            type: 'info',
            timestamp: new Date()
          });
        } catch (e) {
          console.error('Error broadcasting holiday notification:', e);
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Holiday / Calendar event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error in createCalendarEvent:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Holiday / Event
exports.updateCalendarEvent = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (startDate && !endDate) {
      req.body.endDate = startDate;
    }

    const event = await SchoolCalendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    return res.json({
      success: true,
      message: 'Calendar event updated successfully',
      data: event
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Holiday / Event
exports.deleteCalendarEvent = async (req, res) => {
  try {
    const event = await SchoolCalendar.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    return res.json({ success: true, message: 'Calendar event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. 1-Click Pre-populate Standard National & State Holidays
exports.importStandardHolidays = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), academicYearId } = req.body;

    let targetAcademicYearId = academicYearId;
    if (!targetAcademicYearId) {
      const activeYear = await AcademicYear.findOne({ isCurrent: true });
      targetAcademicYearId = activeYear?._id;
    }

    const y = parseInt(year, 10);

    const standardHolidays = [
      { title: 'Republic Day', type: 'public_holiday', startDate: `${y}-01-26`, endDate: `${y}-01-26`, isNationalHoliday: true, description: 'National Holiday' },
      { title: 'Maha Shivratri', type: 'public_holiday', startDate: `${y}-03-08`, endDate: `${y}-03-08`, description: 'Gazetted Holiday' },
      { title: 'Eid-ul-Fitr (Ramadan)', type: 'public_holiday', startDate: `${y}-04-10`, endDate: `${y}-04-11`, description: 'Religious Holiday' },
      { title: 'Dr. B.R. Ambedkar Jayanti', type: 'public_holiday', startDate: `${y}-04-14`, endDate: `${y}-04-14`, isNationalHoliday: true, description: 'National Commemoration' },
      { title: 'Vishu / Good Friday', type: 'public_holiday', startDate: `${y}-04-14`, endDate: `${y}-04-15`, description: 'State & Religious Holiday' },
      { title: 'May Day (Workers Day)', type: 'public_holiday', startDate: `${y}-05-01`, endDate: `${y}-05-01`, description: 'International Labor Day' },
      { title: 'Summer Vacation', type: 'vacation', startDate: `${y}-04-01`, endDate: `${y}-05-31`, description: 'Annual Summer Vacation for Students' },
      { title: 'School Reopening Day', type: 'school_event', startDate: `${y}-06-01`, endDate: `${y}-06-01`, description: 'Commencement of new academic term' },
      { title: 'Bakrid (Eid-ul-Adha)', type: 'public_holiday', startDate: `${y}-06-17`, endDate: `${y}-06-17`, description: 'Gazetted Holiday' },
      { title: 'Muharram', type: 'public_holiday', startDate: `${y}-07-17`, endDate: `${y}-07-17`, description: 'Islamic New Year' },
      { title: 'Independence Day', type: 'public_holiday', startDate: `${y}-08-15`, endDate: `${y}-08-15`, isNationalHoliday: true, description: 'National Holiday - Flag Hoisting at 08:30 AM' },
      { title: 'First Term Onam Vacation', type: 'vacation', startDate: `${y}-09-13`, endDate: `${y}-09-22`, description: 'Onam Cultural Holidays & Mid-term break' },
      { title: 'Milad-un-Nabi', type: 'public_holiday', startDate: `${y}-09-16`, endDate: `${y}-09-16`, description: 'Prophet Birthday' },
      { title: 'Mahatma Gandhi Jayanti', type: 'public_holiday', startDate: `${y}-10-02`, endDate: `${y}-10-02`, isNationalHoliday: true, description: 'National Holiday' },
      { title: 'Mahanavami / Vijayadashami (Pooja Holidays)', type: 'public_holiday', startDate: `${y}-10-11`, endDate: `${y}-10-12`, description: 'Pooja Vacation' },
      { title: 'Deepavali (Diwali)', type: 'public_holiday', startDate: `${y}-10-31`, endDate: `${y}-10-31`, description: 'Festival of Lights' },
      { title: 'Kerala Piravi Day', type: 'school_event', startDate: `${y}-11-01`, endDate: `${y}-11-01`, description: 'State Formation Day Celebrations' },
      { title: 'Annual Sports Meet', type: 'school_event', startDate: `${y}-11-20`, endDate: `${y}-11-22`, description: 'Inter-house Track & Field Championships' },
      { title: 'School Kalolsavam (Arts Fest)', type: 'school_event', startDate: `${y}-12-05`, endDate: `${y}-12-07`, description: 'Annual Cultural & Literary Festival' },
      { title: 'Christmas & Winter Vacation', type: 'vacation', startDate: `${y}-12-23`, endDate: `${y}-12-31`, description: 'Christmas Holidays & Year-End Break' }
    ];

    let insertedCount = 0;
    for (const item of standardHolidays) {
      const existing = await SchoolCalendar.findOne({
        title: item.title,
        startDate: new Date(item.startDate)
      });

      if (!existing) {
        await SchoolCalendar.create({
          title: item.title,
          type: item.type,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          isNationalHoliday: item.isNationalHoliday || false,
          academicYearId: targetAcademicYearId,
          description: item.description || '',
          applicableTo: 'all',
          createdBy: req.user?._id
        });
        insertedCount++;
      }
    }

    return res.json({
      success: true,
      message: `Successfully populated ${insertedCount} standard school holidays for ${y}`,
      count: insertedCount
    });
  } catch (error) {
    console.error('Error in importStandardHolidays:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Upcoming Holidays & Events (Next 30 Days)
exports.getUpcomingHolidays = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = await SchoolCalendar.find({
      endDate: { $gte: today }
    })
      .sort({ startDate: 1 })
      .limit(10);

    return res.json({
      success: true,
      count: upcoming.length,
      data: upcoming
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
