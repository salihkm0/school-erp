// lib/models/kerala_sslc_model.dart

class SSLCSubjectGrade {
  final String subjectCode;
  final String subjectName;
  final String grade;
  final num gradePoint;

  SSLCSubjectGrade({
    required this.subjectCode,
    required this.subjectName,
    required this.grade,
    required this.gradePoint,
  });

  factory SSLCSubjectGrade.fromJson(Map<String, dynamic> json) {
    return SSLCSubjectGrade(
      subjectCode: json['subjectCode']?.toString() ?? '',
      subjectName: json['subjectName']?.toString() ?? '',
      grade: json['grade']?.toString() ?? 'A+',
      gradePoint: json['gradePoint'] as num? ?? 9,
    );
  }

  Map<String, dynamic> toJson() => {
    'subjectCode': subjectCode,
    'subjectName': subjectName,
    'grade': grade,
    'gradePoint': gradePoint,
  };
}

class KeralaSSLCResultModel {
  final String id;
  final String registerNumber;
  final String academicYear;
  final String candidateName;
  final String admissionNo;
  final String schoolCode;
  final String schoolName;
  final String? dob;
  final String gender;
  final Map<String, SSLCSubjectGrade> subjects;
  final int totalSubjects;
  final int totalAPlusCount;
  final int totalACount;
  final int totalBPlusCount;
  final num totalGradePoints;
  final num gpa;
  final String resultStatus; // 'EHS' | 'NHS'
  final bool fullAPlus;
  final String remarks;

  KeralaSSLCResultModel({
    required this.id,
    required this.registerNumber,
    required this.academicYear,
    required this.candidateName,
    required this.admissionNo,
    required this.schoolCode,
    required this.schoolName,
    this.dob,
    required this.gender,
    required this.subjects,
    required this.totalSubjects,
    required this.totalAPlusCount,
    required this.totalACount,
    required this.totalBPlusCount,
    required this.totalGradePoints,
    required this.gpa,
    required this.resultStatus,
    required this.fullAPlus,
    required this.remarks,
  });

  factory KeralaSSLCResultModel.fromJson(Map<String, dynamic> json) {
    final rawSubs = json['subjects'] as Map<String, dynamic>? ?? {};
    final Map<String, SSLCSubjectGrade> subMap = {};
    rawSubs.forEach((key, val) {
      if (val is Map<String, dynamic>) {
        subMap[key] = SSLCSubjectGrade.fromJson(val);
      }
    });

    return KeralaSSLCResultModel(
      id: json['_id']?.toString() ?? '',
      registerNumber: json['registerNumber']?.toString() ?? '',
      academicYear: json['academicYear']?.toString() ?? '2025-2026',
      candidateName: json['candidateName']?.toString() ?? '',
      admissionNo: json['admissionNo']?.toString() ?? '',
      schoolCode: json['schoolCode']?.toString() ?? '18020',
      schoolName: json['schoolName']?.toString() ?? 'PPMHSS KONDOTTY',
      dob: json['dob']?.toString(),
      gender: json['gender']?.toString() ?? 'Male',
      subjects: subMap,
      totalSubjects: json['totalSubjects'] as int? ?? 10,
      totalAPlusCount: json['totalAPlusCount'] as int? ?? 0,
      totalACount: json['totalACount'] as int? ?? 0,
      totalBPlusCount: json['totalBPlusCount'] as int? ?? 0,
      totalGradePoints: json['totalGradePoints'] as num? ?? 0,
      gpa: json['gpa'] as num? ?? 0,
      resultStatus: json['resultStatus']?.toString() ?? 'EHS',
      fullAPlus: json['fullAPlus'] == true || (json['totalAPlusCount'] == 10),
      remarks: json['remarks']?.toString() ?? 'Eligible for Higher Studies (EHS)',
    );
  }
}

class SSLCTopper {
  final String id;
  final String registerNumber;
  final String candidateName;
  final int totalAPlusCount;
  final num gpa;
  final bool fullAPlus;

  SSLCTopper({
    required this.id,
    required this.registerNumber,
    required this.candidateName,
    required this.totalAPlusCount,
    required this.gpa,
    required this.fullAPlus,
  });

  factory SSLCTopper.fromJson(Map<String, dynamic> json) {
    return SSLCTopper(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      registerNumber: json['registerNumber']?.toString() ?? '',
      candidateName: json['candidateName']?.toString() ?? '',
      totalAPlusCount: json['totalAPlusCount'] as int? ?? 10,
      gpa: json['gpa'] as num? ?? 9.0,
      fullAPlus: json['fullAPlus'] == true,
    );
  }
}

class SSLCAnalyticsModel {
  final String academicYear;
  final int totalAppeared;
  final int totalPassed;
  final num passPercentage;
  final int fullAPlusCount;
  final int nineAPlusCount;
  final List<SSLCTopper> toppers;

  SSLCAnalyticsModel({
    required this.academicYear,
    required this.totalAppeared,
    required this.totalPassed,
    required this.passPercentage,
    required this.fullAPlusCount,
    required this.nineAPlusCount,
    required this.toppers,
  });

  factory SSLCAnalyticsModel.fromJson(Map<String, dynamic> json) {
    final rawToppers = json['toppers'] as List? ?? [];
    return SSLCAnalyticsModel(
      academicYear: json['academicYear']?.toString() ?? '2025-2026',
      totalAppeared: json['totalAppeared'] as int? ?? 0,
      totalPassed: json['totalPassed'] as int? ?? 0,
      passPercentage: json['passPercentage'] as num? ?? 0,
      fullAPlusCount: json['fullAPlusCount'] as int? ?? 0,
      nineAPlusCount: json['nineAPlusCount'] as int? ?? 0,
      toppers: rawToppers.map((t) => SSLCTopper.fromJson(t as Map<String, dynamic>)).toList(),
    );
  }
}
