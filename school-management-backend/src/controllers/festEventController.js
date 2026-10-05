// src/controllers/festEventController.js
const FestEvent = require('../models/FestEvent');
const EventItem = require('../models/EventItem');
const EventParticipant = require('../models/EventParticipant');
const EventResult = require('../models/EventResult');
const Student = require('../models/Student');
const { getIO } = require('../config/socket');

// Helper to broadcast live event updates
function broadcastEventUpdate(eventName, payload) {
  try {
    const io = getIO();
    if (io) {
      io.emit(eventName, payload);
      // Also send to general notifications channel
      io.emit('event_realtime_alert', {
        title: 'Event Update',
        message: payload.message || 'Points table updated',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Socket broadcast error in festEventController:', err.message);
  }
}

// ==========================================
// 1. EVENT MANAGEMENT
// ==========================================

exports.getEvents = async (req, res) => {
  try {
    const { status, eventType, academicYear } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (academicYear) filter.academicYear = academicYear;

    const events = await FestEvent.find(filter)
      .populate('academicYear', 'name isCurrent')
      .populate('createdBy', 'name email')
      .sort({ startDate: -1 });

    // Enrich with item & participant counts
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const [itemCount, participantCount, completedItemCount] = await Promise.all([
          EventItem.countDocuments({ event: event._id }),
          EventParticipant.countDocuments({ event: event._id }),
          EventItem.countDocuments({ event: event._id, status: 'completed' }),
        ]);

        // Find leading group
        let leadingGroup = null;
        if (event.groups && event.groups.length > 0) {
          const sorted = [...event.groups].sort((a, b) => b.points - a.points);
          leadingGroup = sorted[0];
        }

        return {
          ...event.toObject(),
          itemCount,
          completedItemCount,
          participantCount,
          leadingGroup,
        };
      })
    );

    res.json({ success: true, data: enrichedEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await FestEvent.findById(req.params.id)
      .populate('academicYear', 'name isCurrent')
      .populate('groups.captainStudent', 'fullName admissionNo rollNumber')
      .populate('groups.inChargeStaff', 'fullName employeeId')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const [itemCount, participantCount, completedItemCount] = await Promise.all([
      EventItem.countDocuments({ event: event._id }),
      EventParticipant.countDocuments({ event: event._id }),
      EventItem.countDocuments({ event: event._id, status: 'completed' }),
    ]);

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        itemCount,
        completedItemCount,
        participantCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      eventType,
      academicYear,
      startDate,
      endDate,
      venue,
      description,
      groupingType = 'house',
      groups = [],
      categories,
      chestNumberConfig,
      pointSystem,
    } = req.body;

    // Provide default houses if none passed for 'house' grouping
    let initialGroups = groups;
    if ((!initialGroups || initialGroups.length === 0) && groupingType === 'house') {
      initialGroups = [
        { name: 'Red House', code: 'RED', color: '#EF4444', points: 0 },
        { name: 'Blue House', code: 'BLU', color: '#3B82F6', points: 0 },
        { name: 'Green House', code: 'GRN', color: '#10B981', points: 0 },
        { name: 'Yellow House', code: 'YEL', color: '#F59E0B', points: 0 },
      ];
    }

    const newEvent = await FestEvent.create({
      name,
      eventType: eventType || 'sports',
      academicYear,
      startDate,
      endDate,
      venue: venue || 'School Campus',
      description: description || '',
      groupingType,
      groups: initialGroups,
      categories: categories || ['Sub-Junior', 'Junior', 'Senior', 'General'],
      chestNumberConfig: chestNumberConfig || {
        prefix: '',
        startNumber: 101,
        digits: 3,
        allocationStrategy: 'sequential',
      },
      pointSystem: pointSystem || {
        individualFirst: 5,
        individualSecond: 3,
        individualThird: 1,
        groupFirst: 10,
        groupSecond: 6,
        groupThird: 2,
        gradePoints: { A: 5, B: 3, C: 1 },
      },
      createdBy: req.user?._id,
    });

    broadcastEventUpdate('event_created', {
      event: newEvent,
      message: `New event "${newEvent.name}" created!`,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await FestEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const allowedFields = [
      'name',
      'eventType',
      'academicYear',
      'startDate',
      'endDate',
      'venue',
      'description',
      'status',
      'groupingType',
      'groups',
      'categories',
      'chestNumberConfig',
      'pointSystem',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    broadcastEventUpdate('event_updated', {
      event,
      message: `Event "${event.name}" updated`,
    });

    res.json({ success: true, message: 'Event updated successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await FestEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Cascade delete associated items, participants, and results
    await Promise.all([
      EventItem.deleteMany({ event: event._id }),
      EventParticipant.deleteMany({ event: event._id }),
      EventResult.deleteMany({ event: event._id }),
      event.deleteOne(),
    ]);

    broadcastEventUpdate('event_deleted', {
      eventId: req.params.id,
      message: `Event "${event.name}" deleted`,
    });

    res.json({ success: true, message: 'Event and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ITEMS / COMPETITIONS MANAGEMENT
// ==========================================

exports.getEventItems = async (req, res) => {
  try {
    const { category, itemType, status } = req.query;
    const filter = { event: req.params.id };

    if (category) filter.category = category;
    if (itemType) filter.itemType = itemType;
    if (status) filter.status = status;

    const items = await EventItem.find(filter).sort({ category: 1, name: 1 });

    // Attach participant counts and result info
    const enriched = await Promise.all(
      items.map(async (item) => {
        const participantCount = await EventParticipant.countDocuments({
          event: req.params.id,
          registeredItems: item._id,
        });
        const result = await EventResult.findOne({ event: req.params.id, item: item._id });

        return {
          ...item.toObject(),
          participantCount,
          hasResult: !!result,
          result: result || null,
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEventItem = async (req, res) => {
  try {
    const event = await FestEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const {
      name,
      code,
      category,
      itemType,
      gender,
      maxParticipantsPerGroup,
      minGroupMembers,
      maxGroupMembers,
      pointsOverride,
      stageVenue,
      scheduledDate,
      scheduledTime,
      rules,
    } = req.body;

    const item = await EventItem.create({
      event: event._id,
      name,
      code: code || '',
      category: category || 'General',
      itemType: itemType || 'individual',
      gender: gender || 'open',
      maxParticipantsPerGroup: maxParticipantsPerGroup || (itemType === 'group' ? 1 : 2),
      minGroupMembers: minGroupMembers || 1,
      maxGroupMembers: maxGroupMembers || 10,
      pointsOverride: pointsOverride || {},
      stageVenue: stageVenue || event.venue || 'Main Ground',
      scheduledDate,
      scheduledTime,
      rules: rules || '',
    });

    res.status(201).json({
      success: true,
      message: 'Competition item created successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEventItem = async (req, res) => {
  try {
    const item = await EventItem.findOne({ _id: req.params.itemId, event: req.params.id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json({ success: true, message: 'Item updated successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEventItem = async (req, res) => {
  try {
    const item = await EventItem.findOne({ _id: req.params.itemId, event: req.params.id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Remove item reference from participants & delete results
    await Promise.all([
      EventParticipant.updateMany(
        { event: req.params.id, registeredItems: item._id },
        { $pull: { registeredItems: item._id } }
      ),
      EventResult.deleteMany({ event: req.params.id, item: item._id }),
      item.deleteOne(),
    ]);

    res.json({ success: true, message: 'Item and its registered links deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. PARTICIPANTS & CHEST NUMBERS
// ==========================================

exports.getParticipants = async (req, res) => {
  try {
    const { group, category, search, itemId } = req.query;
    const filter = { event: req.params.id };

    if (group) filter.group = group;
    if (category) filter.category = category;
    if (itemId) filter.registeredItems = itemId;

    let query = EventParticipant.find(filter)
      .populate('student', 'fullName admissionNo rollNumber currentClass photo gender')
      .populate('registeredItems', 'name code category itemType')
      .sort({ chestNumber: 1 });

    let participants = await query;

    if (search) {
      const s = search.toLowerCase();
      participants = participants.filter((p) => {
        return (
          p.chestNumber?.toLowerCase().includes(s) ||
          p.student?.fullName?.toLowerCase().includes(s) ||
          p.student?.admissionNo?.toLowerCase().includes(s) ||
          p.groupName?.toLowerCase().includes(s)
        );
      });
    }

    res.json({ success: true, count: participants.length, data: participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerParticipant = async (req, res) => {
  try {
    const { studentId, groupId, category, chestNumber, registeredItems = [] } = req.body;
    const event = await FestEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const groupObj = event.groups.id(groupId) || event.groups.find((g) => g._id.toString() === groupId);
    if (!groupObj) {
      return res.status(400).json({ success: false, message: 'Invalid group / house selected' });
    }

    // Auto-generate chest number if not provided
    let assignedChestNo = chestNumber;
    if (!assignedChestNo) {
      const count = await EventParticipant.countDocuments({ event: event._id });
      const nextNum = (event.chestNumberConfig?.startNumber || 101) + count;
      const prefix = event.chestNumberConfig?.prefix || '';
      assignedChestNo = `${prefix}${nextNum}`;
    }

    // Upsert participant
    let participant = await EventParticipant.findOne({ event: event._id, student: studentId });
    if (participant) {
      participant.group = groupObj._id;
      participant.groupName = groupObj.name;
      participant.groupColor = groupObj.color;
      participant.category = category || participant.category;
      if (chestNumber) participant.chestNumber = chestNumber;
      participant.registeredItems = registeredItems;
      await participant.save();
    } else {
      participant = await EventParticipant.create({
        event: event._id,
        student: studentId,
        group: groupObj._id,
        groupName: groupObj.name,
        groupColor: groupObj.color,
        chestNumber: assignedChestNo,
        category: category || 'General',
        registeredItems,
      });
    }

    const populated = await EventParticipant.findById(participant._id)
      .populate('student', 'fullName admissionNo rollNumber currentClass photo')
      .populate('registeredItems', 'name code category');

    res.status(201).json({
      success: true,
      message: 'Participant registered successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkRegisterParticipants = async (req, res) => {
  try {
    const { studentIds, groupId, category } = req.body;
    const event = await FestEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const groupObj = event.groups.id(groupId) || event.groups.find((g) => g._id.toString() === groupId);
    if (!groupObj) {
      return res.status(400).json({ success: false, message: 'Invalid group selected' });
    }

    let createdCount = 0;
    let existingCount = await EventParticipant.countDocuments({ event: event._id });
    const startNum = event.chestNumberConfig?.startNumber || 101;
    const prefix = event.chestNumberConfig?.prefix || '';

    for (const sId of studentIds) {
      const exists = await EventParticipant.findOne({ event: event._id, student: sId });
      if (!exists) {
        existingCount++;
        const chestNo = `${prefix}${startNum + existingCount - 1}`;
        await EventParticipant.create({
          event: event._id,
          student: sId,
          group: groupObj._id,
          groupName: groupObj.name,
          groupColor: groupObj.color,
          chestNumber: chestNo,
          category: category || 'General',
          registeredItems: [],
        });
        createdCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully registered ${createdCount} new participants to ${groupObj.name}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateChestNumbers = async (req, res) => {
  try {
    const event = await FestEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { allocationStrategy, prefix, startNumber = 101 } = req.body;
    const strategy = allocationStrategy || event.chestNumberConfig?.allocationStrategy || 'sequential';
    const cfgPrefix = prefix !== undefined ? prefix : event.chestNumberConfig?.prefix || '';

    let participants = [];

    if (strategy === 'house_prefix') {
      // Group by house and assign HOUSE-101, etc.
      for (const grp of event.groups) {
        const grpParticipants = await EventParticipant.find({ event: event._id, group: grp._id })
          .populate('student', 'fullName')
          .sort({ 'student.fullName': 1 });

        let currentNo = startNumber;
        for (const p of grpParticipants) {
          const houseCode = grp.code || grp.name.substring(0, 3).toUpperCase();
          p.chestNumber = `${houseCode}-${currentNo++}`;
          await p.save();
        }
      }
    } else if (strategy === 'category_prefix') {
      // Group by category and assign JUN-101, SEN-101
      for (const cat of event.categories) {
        const catParticipants = await EventParticipant.find({ event: event._id, category: cat })
          .populate('student', 'fullName')
          .sort({ 'student.fullName': 1 });

        let currentNo = startNumber;
        for (const p of catParticipants) {
          const catCode = cat.substring(0, 3).toUpperCase();
          p.chestNumber = `${catCode}-${currentNo++}`;
          await p.save();
        }
      }
    } else {
      // Sequential: 101, 102, 103...
      participants = await EventParticipant.find({ event: event._id })
        .populate('student', 'fullName')
        .sort({ groupName: 1, 'student.fullName': 1 });

      let currentNo = startNumber;
      for (const p of participants) {
        p.chestNumber = `${cfgPrefix}${currentNo++}`;
        await p.save();
      }
    }

    // Save configuration updates
    event.chestNumberConfig = {
      prefix: cfgPrefix,
      startNumber,
      allocationStrategy: strategy,
      digits: 3,
    };
    await event.save();

    res.json({
      success: true,
      message: 'Chest numbers generated and allocated successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. CALL SHEET, RESULTS & LIVE SCORING
// ==========================================

exports.getItemCallSheet = async (req, res) => {
  try {
    const item = await EventItem.findOne({ _id: req.params.itemId, event: req.params.id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const participants = await EventParticipant.find({
      event: req.params.id,
      registeredItems: item._id,
    })
      .populate('student', 'fullName admissionNo rollNumber currentClass photo gender')
      .sort({ chestNumber: 1 });

    res.json({
      success: true,
      data: {
        item,
        participants,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordItemResult = async (req, res) => {
  try {
    const { winners = [], remarks = '', published = true } = req.body;
    const event = await FestEvent.findById(req.params.id);
    const item = await EventItem.findOne({ _id: req.params.itemId, event: req.params.id });

    if (!event || !item) {
      return res.status(404).json({ success: false, message: 'Event or Item not found' });
    }

    // Calculate points based on pointSystem or item overrides
    const isGroup = item.itemType === 'group';
    const firstPts = item.pointsOverride?.first ?? (isGroup ? event.pointSystem.groupFirst : event.pointSystem.individualFirst);
    const secondPts = item.pointsOverride?.second ?? (isGroup ? event.pointSystem.groupSecond : event.pointSystem.individualSecond);
    const thirdPts = item.pointsOverride?.third ?? (isGroup ? event.pointSystem.groupThird : event.pointSystem.individualThird);

    const formattedWinners = winners.map((w) => {
      let basePts = 0;
      if (w.position === 1) basePts = firstPts;
      else if (w.position === 2) basePts = secondPts;
      else if (w.position === 3) basePts = thirdPts;

      // Grade extra points (if any)
      const gradePts = w.grade ? (event.pointSystem?.gradePoints?.[w.grade] || 0) : 0;
      const totalPointsAwarded = w.pointsAwarded !== undefined ? w.pointsAwarded : (basePts + gradePts);

      return {
        position: w.position,
        participant: w.participantId,
        student: w.studentId,
        studentName: w.studentName,
        admissionNo: w.admissionNo,
        chestNumber: w.chestNumber,
        group: w.groupId,
        groupName: w.groupName,
        groupColor: w.groupColor,
        teamMembers: w.teamMembers || [],
        grade: w.grade || 'None',
        scoreOrTime: w.scoreOrTime || '',
        pointsAwarded: totalPointsAwarded,
      };
    });

    // Upsert result
    let resultDoc = await EventResult.findOne({ event: event._id, item: item._id });
    if (resultDoc) {
      resultDoc.winners = formattedWinners;
      resultDoc.remarks = remarks;
      resultDoc.published = published;
      resultDoc.publishedAt = new Date();
      resultDoc.publishedBy = req.user?._id;
      await resultDoc.save();
    } else {
      resultDoc = await EventResult.create({
        event: event._id,
        item: item._id,
        winners: formattedWinners,
        remarks,
        published,
        publishedBy: req.user?._id,
      });
    }

    // Mark item as completed
    item.status = 'completed';
    await item.save();

    // Recalculate all group points for this event
    await recalculateEventScores(event._id);

    // Fetch updated leaderboard
    const updatedLeaderboard = await getLeaderboardData(event._id);

    // Broadcast LIVE Socket.IO Realtime update!
    broadcastEventUpdate('event_points_updated', {
      eventId: event._id,
      eventName: event.name,
      itemName: item.name,
      itemCategory: item.category,
      winners: formattedWinners,
      leaderboard: updatedLeaderboard,
      message: `Results published for "${item.name}"! Points updated live!`,
    });

    res.json({
      success: true,
      message: 'Results recorded and live points table updated!',
      data: {
        result: resultDoc,
        leaderboard: updatedLeaderboard,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventResults = async (req, res) => {
  try {
    const results = await EventResult.find({ event: req.params.id, published: true })
      .populate('item', 'name code category itemType gender stageVenue')
      .populate('publishedBy', 'name')
      .sort({ publishedAt: -1 });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. LIVE LEADERBOARD & POINT TABLES
// ==========================================

async function recalculateEventScores(eventId) {
  const event = await FestEvent.findById(eventId);
  if (!event) return;

  const results = await EventResult.find({ event: eventId, published: true });

  // Reset counts
  const groupScores = {};
  const participantScores = {};

  event.groups.forEach((g) => {
    groupScores[g._id.toString()] = {
      points: 0,
      goldCount: 0,
      silverCount: 0,
      bronzeCount: 0,
    };
  });

  results.forEach((r) => {
    (r.winners || []).forEach((w) => {
      const gId = w.group?.toString();
      if (gId && groupScores[gId]) {
        groupScores[gId].points += w.pointsAwarded || 0;
        if (w.position === 1) groupScores[gId].goldCount += 1;
        if (w.position === 2) groupScores[gId].silverCount += 1;
        if (w.position === 3) groupScores[gId].bronzeCount += 1;
      }

      const pId = w.participant?.toString();
      if (pId) {
        if (!participantScores[pId]) {
          participantScores[pId] = { points: 0, gold: 0, silver: 0, bronze: 0 };
        }
        participantScores[pId].points += w.pointsAwarded || 0;
        if (w.position === 1) participantScores[pId].gold += 1;
        if (w.position === 2) participantScores[pId].silver += 1;
        if (w.position === 3) participantScores[pId].bronze += 1;
      }
    });
  });

  // Update groups in event document
  event.groups.forEach((g) => {
    const gId = g._id.toString();
    if (groupScores[gId]) {
      g.points = groupScores[gId].points;
      g.goldCount = groupScores[gId].goldCount;
      g.silverCount = groupScores[gId].silverCount;
      g.bronzeCount = groupScores[gId].bronzeCount;
    }
  });

  await event.save();

  // Update participant point totals
  const pUpdates = Object.keys(participantScores).map((pId) => {
    return EventParticipant.findByIdAndUpdate(pId, {
      totalPoints: participantScores[pId].points,
      goldCount: participantScores[pId].gold,
      silverCount: participantScores[pId].silver,
      bronzeCount: participantScores[pId].bronze,
    });
  });
  await Promise.all(pUpdates);
}

async function getLeaderboardData(eventId) {
  const event = await FestEvent.findById(eventId);
  if (!event) return null;

  // Sort groups by points descending
  const sortedGroups = [...(event.groups || [])].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    if (b.silverCount !== a.silverCount) return b.silverCount - a.silverCount;
    return b.bronzeCount - a.bronzeCount;
  });

  // Calculate ranks
  let currentRank = 1;
  const groupsWithRank = sortedGroups.map((g, idx) => {
    if (idx > 0 && g.points < sortedGroups[idx - 1].points) {
      currentRank = idx + 1;
    }
    return {
      _id: g._id,
      name: g.name,
      code: g.code,
      color: g.color,
      points: g.points || 0,
      goldCount: g.goldCount || 0,
      silverCount: g.silverCount || 0,
      bronzeCount: g.bronzeCount || 0,
      rank: currentRank,
    };
  });

  // Individual Top Champions
  const topParticipants = await EventParticipant.find({ event: eventId, totalPoints: { $gt: 0 } })
    .populate('student', 'fullName admissionNo currentClass photo gender')
    .sort({ totalPoints: -1, goldCount: -1 })
    .limit(10);

  // Category wise group breakdowns
  const results = await EventResult.find({ event: eventId, published: true }).populate('item', 'category');
  const categoryBreakdown = {};

  event.categories.forEach((cat) => {
    categoryBreakdown[cat] = {};
    event.groups.forEach((grp) => {
      categoryBreakdown[cat][grp._id.toString()] = {
        groupName: grp.name,
        color: grp.color,
        points: 0,
      };
    });
  });

  results.forEach((r) => {
    const cat = r.item?.category || 'General';
    if (categoryBreakdown[cat]) {
      (r.winners || []).forEach((w) => {
        const gId = w.group?.toString();
        if (gId && categoryBreakdown[cat][gId]) {
          categoryBreakdown[cat][gId].points += w.pointsAwarded || 0;
        }
      });
    }
  });

  return {
    event: {
      _id: event._id,
      name: event.name,
      eventType: event.eventType,
      status: event.status,
      venue: event.venue,
    },
    groups: groupsWithRank,
    topParticipants,
    categoryBreakdown,
  };
}

exports.getEventLeaderboard = async (req, res) => {
  try {
    const data = await getLeaderboardData(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
