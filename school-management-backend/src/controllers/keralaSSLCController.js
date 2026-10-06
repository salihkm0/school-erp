// src/controllers/keralaSSLCController.js
const KeralaSSLCResult = require('../models/KeralaSSLCResult');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { broadcastToAll, broadcastToRole } = require('../config/socket');

// 1. Live Public / In-App Result Search
// @route   GET /api/sslc/search
// @access  Public
exports.searchIndividualResult = async (req, res) => {
  try {
    const { registerNumber, dob, academicYear = '2025-2026' } = req.query;

    if (!registerNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid SSLC Register Number'
      });
    }

    const query = {
      registerNumber: registerNumber.trim(),
      academicYear: academicYear.trim()
    };

    const result = await KeralaSSLCResult.findOne(query)
      .populate('studentId', 'fullName admissionNo profilePicture parentIds');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No SSLC Result found for Register Number "${registerNumber}" in ${academicYear}`
      });
    }

    // If DOB is provided, verify DOB matching
    if (dob && result.dob) {
      const searchDob = new Date(dob);
      const resultDob = new Date(result.dob);
      if (
        searchDob.getFullYear() !== resultDob.getFullYear() ||
        searchDob.getMonth() !== resultDob.getMonth() ||
        searchDob.getDate() !== resultDob.getDate()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Date of Birth does not match the Register Number records'
        });
      }
    }

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in searchIndividualResult:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. School-wide SSLC Analytics & Toppers
// @route   GET /api/sslc/analytics
// @access  Public / Private
exports.getSchoolSSLCAnalytics = async (req, res) => {
  try {
    const { academicYear = '2025-2026' } = req.query;

    const results = await KeralaSSLCResult.find({ academicYear })
      .populate('studentId', 'fullName admissionNo profilePicture')
      .sort({ gpa: -1, totalAPlusCount: -1, candidateName: 1 });

    const totalAppeared = results.length;
    if (totalAppeared === 0) {
      return res.json({
        success: true,
        academicYear,
        totalAppeared: 0,
        totalPassed: 0,
        passPercentage: 0,
        fullAPlusCount: 0,
        nineAPlusCount: 0,
        toppers: [],
        subjectWiseStats: {},
        results: []
      });
    }

    const passedResults = results.filter(r => r.resultStatus === 'EHS');
    const totalPassed = passedResults.length;
    const passPercentage = Math.round((totalPassed / totalAppeared) * 1000) / 10;

    const fullAPlusList = results.filter(r => r.fullAPlus || r.totalAPlusCount === 10);
    const nineAPlusList = results.filter(r => r.totalAPlusCount === 9);

    // Subject-wise stats
    const subjectKeys = [
      { key: 'lang1', name: 'Language Paper 1' },
      { key: 'lang2', name: 'Language Paper 2' },
      { key: 'english', name: 'English' },
      { key: 'hindi', name: 'Hindi' },
      { key: 'socialScience', name: 'Social Science' },
      { key: 'physics', name: 'Physics' },
      { key: 'chemistry', name: 'Chemistry' },
      { key: 'biology', name: 'Biology' },
      { key: 'mathematics', name: 'Mathematics' },
      { key: 'it', name: 'Information Technology' }
    ];

    const subjectWiseStats = {};
    subjectKeys.forEach(sk => {
      let aPlus = 0;
      let a = 0;
      let passed = 0;

      results.forEach(r => {
        const sub = r.subjects?.[sk.key];
        if (sub && sub.grade) {
          if (sub.grade === 'A+') aPlus++;
          else if (sub.grade === 'A') a++;
          if (sub.grade !== 'D' && sub.grade !== 'E') passed++;
        }
      });

      subjectWiseStats[sk.key] = {
        name: sk.name,
        aPlusCount: aPlus,
        aCount: a,
        passPercentage: Math.round((passed / totalAppeared) * 1000) / 10
      };
    });

    return res.json({
      success: true,
      academicYear,
      totalAppeared,
      totalPassed,
      passPercentage,
      fullAPlusCount: fullAPlusList.length,
      nineAPlusCount: nineAPlusList.length,
      toppers: fullAPlusList.map(t => ({
        id: t._id,
        registerNumber: t.registerNumber,
        candidateName: t.candidateName,
        totalAPlusCount: t.totalAPlusCount,
        gpa: t.gpa,
        profilePicture: t.studentId?.profilePicture || null,
        fullAPlus: true
      })),
      subjectWiseStats,
      results
    });
  } catch (error) {
    console.error('Error in getSchoolSSLCAnalytics:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get All School Results (Paginated & Filterable)
// @route   GET /api/sslc/results
// @access  Private
exports.getAllSchoolResults = async (req, res) => {
  try {
    const {
      academicYear = '2025-2026',
      search = '',
      status = 'all',
      fullAPlus = 'all',
      page = 1,
      limit = 50
    } = req.query;

    const query = { academicYear };

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { candidateName: regex },
        { registerNumber: regex },
        { admissionNo: regex }
      ];
    }

    if (status !== 'all') {
      query.resultStatus = status;
    }

    if (fullAPlus === 'true') {
      query.$or = [{ fullAPlus: true }, { totalAPlusCount: 10 }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [results, total] = await Promise.all([
      KeralaSSLCResult.find(query)
        .populate('studentId', 'fullName admissionNo rollNumber')
        .sort({ gpa: -1, totalAPlusCount: -1, candidateName: 1 })
        .skip(skip)
        .limit(limitNum),
      KeralaSSLCResult.countDocuments(query)
    ]);

    return res.json({
      success: true,
      count: results.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: results
    });
  } catch (error) {
    console.error('Error in getAllSchoolResults:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Bulk Import SSLC Results (Excel / CSV / JSON)
// @route   POST /api/sslc/bulk-import
// @access  Private (Admin)
exports.bulkImportSSLCResults = async (req, res) => {
  try {
    const { results = [], academicYear = '2025-2026', schoolCode = '18020', schoolName = 'PPMHSS KONDOTTY' } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid array of student result records'
      });
    }

    // Cache students in school to link studentId
    const allStudents = await Student.find({ status: 'active' }).select('_id fullName admissionNo rollNumber');
    const admissionMap = new Map();
    const nameMap = new Map();
    allStudents.forEach(s => {
      if (s.admissionNo) admissionMap.set(s.admissionNo.toLowerCase().trim(), s._id);
      if (s.fullName) nameMap.set(s.fullName.toLowerCase().trim(), s._id);
    });

    let createdCount = 0;
    let updatedCount = 0;

    for (const record of results) {
      if (!record.registerNumber || !record.candidateName) continue;

      const regNo = record.registerNumber.toString().trim();
      const name = record.candidateName.toString().trim();
      const admNo = record.admissionNo ? record.admissionNo.toString().trim() : '';

      // Find matching student
      let linkedStudentId = null;
      if (admNo && admissionMap.has(admNo.toLowerCase())) {
        linkedStudentId = admissionMap.get(admNo.toLowerCase());
      } else if (nameMap.has(name.toLowerCase())) {
        linkedStudentId = nameMap.get(name.toLowerCase());
      }

      // Format subjects object
      const subjects = record.subjects || {
        lang1: { subjectCode: '101', subjectName: 'Language Paper 1', grade: record.lang1 || 'A+' },
        lang2: { subjectCode: '102', subjectName: 'Language Paper 2', grade: record.lang2 || 'A+' },
        english: { subjectCode: '103', subjectName: 'English', grade: record.english || 'A+' },
        hindi: { subjectCode: '104', subjectName: 'Hindi', grade: record.hindi || 'A+' },
        socialScience: { subjectCode: '105', subjectName: 'Social Science', grade: record.socialScience || 'A+' },
        physics: { subjectCode: '106', subjectName: 'Physics', grade: record.physics || 'A+' },
        chemistry: { subjectCode: '107', subjectName: 'Chemistry', grade: record.chemistry || 'A+' },
        biology: { subjectCode: '108', subjectName: 'Biology', grade: record.biology || 'A+' },
        mathematics: { subjectCode: '109', subjectName: 'Mathematics', grade: record.mathematics || 'A+' },
        it: { subjectCode: '110', subjectName: 'Information Technology', grade: record.it || 'A+' }
      };

      const existing = await KeralaSSLCResult.findOne({ registerNumber: regNo, academicYear });
      if (existing) {
        existing.candidateName = name;
        existing.admissionNo = admNo || existing.admissionNo;
        existing.studentId = linkedStudentId || existing.studentId;
        existing.subjects = subjects;
        existing.schoolCode = schoolCode;
        existing.schoolName = schoolName;
        if (record.dob) existing.dob = new Date(record.dob);
        if (record.gender) existing.gender = record.gender;
        await existing.save();
        updatedCount++;
      } else {
        const newResult = new KeralaSSLCResult({
          registerNumber: regNo,
          academicYear,
          candidateName: name,
          admissionNo: admNo,
          studentId: linkedStudentId,
          schoolCode,
          schoolName,
          dob: record.dob ? new Date(record.dob) : null,
          gender: record.gender || 'Male',
          category: record.category || 'General',
          subjects,
          createdBy: req.user?.id
        });
        await newResult.save();
        createdCount++;
      }
    }

    return res.json({
      success: true,
      message: `Successfully processed SSLC results: ${createdCount} imported, ${updatedCount} updated`,
      createdCount,
      updatedCount,
      totalProcessed: createdCount + updatedCount
    });
  } catch (error) {
    console.error('Error in bulkImportSSLCResults:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. 1-Click Pre-populate Standard Demo SSLC Results for School (2026 Batch)
// @route   POST /api/sslc/seed-sample
// @access  Private (Admin)
exports.seedSampleSSLCResults = async (req, res) => {
  try {
    const academicYear = req.body.academicYear || '2025-2026';

    const sampleCandidates = [
      { regNo: '541001', name: 'Aadhil Mohammed K', admNo: '10841', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541002', name: 'Amina Fathima P', admNo: '10842', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541003', name: 'Devanarayanan M', admNo: '10843', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541004', name: 'Fathima Rasha C', admNo: '10844', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541005', name: 'Hadiya Nasreen K', admNo: '10845', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541006', name: 'Irfan Habib V', admNo: '10846', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541007', name: 'Nandana Suresh', admNo: '10847', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541008', name: 'Rayan Ahmed T', admNo: '10848', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541009', name: 'Shreya Rajesh', admNo: '10849', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541010', name: 'Zayan K M', admNo: '10850', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      // 9 A+ Candidates
      { regNo: '541011', name: 'Adithya Narayanan', admNo: '10851', gender: 'Male', g: ['A+', 'A+', 'A+', 'A+', 'A', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541012', name: 'Ananya Pradeep', admNo: '10852', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A', 'A+', 'A+', 'A+'] },
      { regNo: '541013', name: 'Bilal Farooq', admNo: '10853', gender: 'Male', g: ['A+', 'A+', 'A+', 'A', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541014', name: 'Dilsha Fathima', admNo: '10854', gender: 'Female', g: ['A+', 'A', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+'] },
      { regNo: '541015', name: 'Fidha Sherin', admNo: '10855', gender: 'Female', g: ['A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A+', 'A', 'A+'] },
      // General EHS
      { regNo: '541016', name: 'Gokul Krishna', admNo: '10856', gender: 'Male', g: ['A', 'A', 'B+', 'A', 'A', 'B+', 'A', 'A', 'B+', 'A'] },
      { regNo: '541017', name: 'Hiba Thasneem', admNo: '10857', gender: 'Female', g: ['A+', 'A', 'A', 'B+', 'A', 'B+', 'A', 'A', 'A', 'A+'] },
      { regNo: '541018', name: 'Junaid K', admNo: '10858', gender: 'Male', g: ['B+', 'B+', 'B', 'B+', 'A', 'B+', 'B+', 'A', 'B', 'A'] },
      { regNo: '541019', name: 'Kavya S', admNo: '10859', gender: 'Female', g: ['A+', 'A+', 'A', 'A', 'B+', 'A', 'A', 'B+', 'A', 'A+'] },
      { regNo: '541020', name: 'Mohammed Sahal', admNo: '10860', gender: 'Male', g: ['A', 'A', 'A', 'B+', 'A', 'B+', 'B+', 'A', 'A', 'A'] },
      { regNo: '541021', name: 'Nihal Shafi', admNo: '10861', gender: 'Male', g: ['B+', 'B+', 'A', 'B', 'B+', 'B+', 'B', 'A', 'B+', 'A'] },
      { regNo: '541022', name: 'Rinsha K', admNo: '10862', gender: 'Female', g: ['A+', 'A', 'A', 'A', 'A', 'B+', 'A', 'A', 'A', 'A'] },
      { regNo: '541023', name: 'Safwan M', admNo: '10863', gender: 'Male', g: ['B+', 'A', 'B+', 'B+', 'A', 'B+', 'A', 'B+', 'A', 'A'] },
      { regNo: '541024', name: 'Theertha V', admNo: '10864', gender: 'Female', g: ['A+', 'A+', 'A+', 'A', 'A+', 'A', 'A+', 'A', 'A+', 'A+'] },
      { regNo: '541025', name: 'Vishnu Das', admNo: '10865', gender: 'Male', g: ['A', 'B+', 'B+', 'A', 'B+', 'B', 'B+', 'A', 'B+', 'A'] }
    ];

    let inserted = 0;
    for (const c of sampleCandidates) {
      const subjects = {
        lang1: { subjectCode: '101', subjectName: 'Language Paper 1', grade: c.g[0] },
        lang2: { subjectCode: '102', subjectName: 'Language Paper 2', grade: c.g[1] },
        english: { subjectCode: '103', subjectName: 'English', grade: c.g[2] },
        hindi: { subjectCode: '104', subjectName: 'Hindi', grade: c.g[3] },
        socialScience: { subjectCode: '105', subjectName: 'Social Science', grade: c.g[4] },
        physics: { subjectCode: '106', subjectName: 'Physics', grade: c.g[5] },
        chemistry: { subjectCode: '107', subjectName: 'Chemistry', grade: c.g[6] },
        biology: { subjectCode: '108', subjectName: 'Biology', grade: c.g[7] },
        mathematics: { subjectCode: '109', subjectName: 'Mathematics', grade: c.g[8] },
        it: { subjectCode: '110', subjectName: 'Information Technology', grade: c.g[9] }
      };

      await KeralaSSLCResult.findOneAndUpdate(
        { registerNumber: c.regNo, academicYear },
        {
          registerNumber: c.regNo,
          academicYear,
          candidateName: c.name,
          admissionNo: c.admNo,
          schoolCode: '18020',
          schoolName: 'PPMHSS KONDOTTY',
          dob: new Date('2010-05-15'),
          gender: c.gender,
          subjects
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      inserted++;
    }

    return res.json({
      success: true,
      message: `Successfully populated ${inserted} Kerala SSLC standard results for ${academicYear}`
    });
  } catch (error) {
    console.error('Error in seedSampleSSLCResults:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Broadcast SSLC Results to Parents
// @route   POST /api/sslc/broadcast
// @access  Private (Admin)
exports.broadcastSSLCToParents = async (req, res) => {
  try {
    const { academicYear = '2025-2026' } = req.body;

    const results = await KeralaSSLCResult.find({ academicYear });
    const fullAPlus = results.filter(r => r.fullAPlus || r.totalAPlusCount === 10).length;
    const passPct = results.length > 0 ? Math.round((results.filter(r => r.resultStatus === 'EHS').length / results.length) * 100) : 100;

    // Create system-wide notification
    await Notification.create({
      title: `🎓 Kerala SSLC Results ${academicYear} Announced!`,
      message: `Hearty congratulations to all SSLC candidates! PPMHSS achieved a magnificent ${passPct}% pass rate with ${fullAPlus} Full A+ stars! Check your detailed digital mark list on the portal.`,
      type: 'general',
      target: 'all',
      sender: req.user?.id
    });

    broadcastToAll('sslc_results_announced', {
      academicYear,
      passPercentage: passPct,
      fullAPlusCount: fullAPlus
    });

    return res.json({
      success: true,
      message: `Broadcast sent successfully for SSLC ${academicYear} results`
    });
  } catch (error) {
    console.error('Error in broadcastSSLCToParents:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
