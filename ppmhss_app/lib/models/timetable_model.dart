class PeriodConfig {
  final int periodNumber;
  final String name;
  final String startTime;
  final String endTime;
  final String type;
  final bool isBreak;

  PeriodConfig({
    required this.periodNumber,
    required this.name,
    required this.startTime,
    required this.endTime,
    required this.type,
    required this.isBreak,
  });

  factory PeriodConfig.fromJson(Map<String, dynamic> json) {
    return PeriodConfig(
      periodNumber: json['periodNumber'] is int
          ? json['periodNumber']
          : int.tryParse(json['periodNumber']?.toString() ?? '0') ?? 0,
      name: json['name']?.toString() ?? 'Period',
      startTime: json['startTime']?.toString() ?? '',
      endTime: json['endTime']?.toString() ?? '',
      type: json['type']?.toString() ?? 'regular',
      isBreak: json['isBreak'] == true,
    );
  }
}

class PeriodSlot {
  final int periodNumber;
  final String? subjectId;
  final String subjectName;
  final String? teacherId;
  final String teacherName;
  final String startTime;
  final String endTime;
  final String room;
  final String type;
  final String notes;
  final bool isBreak;
  final String? className;
  final bool isSubstituted;
  final String? substituteTeacherName;

  PeriodSlot({
    required this.periodNumber,
    this.subjectId,
    required this.subjectName,
    this.teacherId,
    required this.teacherName,
    required this.startTime,
    required this.endTime,
    required this.room,
    required this.type,
    required this.notes,
    this.isBreak = false,
    this.className,
    this.isSubstituted = false,
    this.substituteTeacherName,
  });

  factory PeriodSlot.fromJson(Map<String, dynamic> json) {
    String subName = '';
    String? subId;
    if (json['subjectId'] is Map) {
      subId = json['subjectId']['_id']?.toString();
      subName = json['subjectId']['name']?.toString() ?? '';
    } else if (json['subjectId'] != null) {
      subId = json['subjectId']?.toString();
      subName = json['subjectName']?.toString() ?? 'Subject';
    } else if (json['subjectName'] != null) {
      subName = json['subjectName']?.toString() ?? '';
    }

    String tName = json['teacherName']?.toString() ?? '';
    String? tId;
    if (json['teacherId'] is Map) {
      tId = json['teacherId']['_id']?.toString();
      tName = json['teacherId']['name']?.toString() ?? tName;
    } else if (json['teacherId'] != null) {
      tId = json['teacherId']?.toString();
    }

    final pType = json['type']?.toString() ?? 'regular';

    return PeriodSlot(
      periodNumber: json['periodNumber'] is int
          ? json['periodNumber']
          : int.tryParse(json['periodNumber']?.toString() ?? '0') ?? 0,
      subjectId: subId,
      subjectName: subName,
      teacherId: tId,
      teacherName: tName,
      startTime: json['startTime']?.toString() ?? '',
      endTime: json['endTime']?.toString() ?? '',
      room: json['room']?.toString() ?? '',
      type: pType,
      notes: json['notes']?.toString() ?? '',
      isBreak: pType == 'break' || json['isBreak'] == true,
      className: json['className']?.toString(),
      isSubstituted: json['isSubstituted'] == true,
      substituteTeacherName: json['substituteTeacherName']?.toString(),
    );
  }
}

class DayTimetable {
  final String day;
  final List<PeriodSlot> periods;

  DayTimetable({
    required this.day,
    required this.periods,
  });

  factory DayTimetable.fromJson(Map<String, dynamic> json) {
    final rawList = json['periods'] as List? ?? [];
    return DayTimetable(
      day: json['day']?.toString() ?? 'Monday',
      periods: rawList
          .map((p) => PeriodSlot.fromJson(p as Map<String, dynamic>))
          .toList(),
    );
  }
}

class SubstitutionRecord {
  final String id;
  final String date;
  final String day;
  final int periodNumber;
  final String startTime;
  final String endTime;
  final String className;
  final String originalTeacherName;
  final String substituteTeacherName;
  final String subjectName;
  final String room;
  final String reason;
  final String status;

  SubstitutionRecord({
    required this.id,
    required this.date,
    required this.day,
    required this.periodNumber,
    required this.startTime,
    required this.endTime,
    required this.className,
    required this.originalTeacherName,
    required this.substituteTeacherName,
    required this.subjectName,
    required this.room,
    required this.reason,
    required this.status,
  });

  factory SubstitutionRecord.fromJson(Map<String, dynamic> json) {
    String cName = '';
    if (json['classId'] is Map) {
      final name = json['classId']['name']?.toString() ?? '';
      final sec = json['classId']['section']?.toString();
      cName = sec != null && sec.isNotEmpty ? '$name-$sec' : name;
    } else {
      cName = json['className']?.toString() ?? '';
    }

    String origTeacher = json['originalTeacherName']?.toString() ?? '';
    if (json['originalTeacherId'] is Map) {
      origTeacher = json['originalTeacherId']['name']?.toString() ?? origTeacher;
    }

    String subTeacher = json['substituteTeacherName']?.toString() ?? '';
    if (json['substituteTeacherId'] is Map) {
      subTeacher = json['substituteTeacherId']['name']?.toString() ?? subTeacher;
    }

    String subName = json['subjectName']?.toString() ?? '';
    if (json['subjectId'] is Map) {
      subName = json['subjectId']['name']?.toString() ?? subName;
    }

    return SubstitutionRecord(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      date: json['date']?.toString() ?? '',
      day: json['day']?.toString() ?? '',
      periodNumber: json['periodNumber'] is int
          ? json['periodNumber']
          : int.tryParse(json['periodNumber']?.toString() ?? '0') ?? 0,
      startTime: json['startTime']?.toString() ?? '',
      endTime: json['endTime']?.toString() ?? '',
      className: cName,
      originalTeacherName: origTeacher,
      substituteTeacherName: subTeacher,
      subjectName: subName,
      room: json['room']?.toString() ?? '',
      reason: json['reason']?.toString() ?? 'Leave',
      status: json['status']?.toString() ?? 'assigned',
    );
  }
}

class TeacherWorkload {
  final int totalPeriodsPerWeek;
  final int maxWeeklyPeriods;
  final int workloadPercentage;
  final String status;
  final Map<String, int> periodsPerDay;
  final Map<String, dynamic> subjectBreakdown;

  TeacherWorkload({
    required this.totalPeriodsPerWeek,
    required this.maxWeeklyPeriods,
    required this.workloadPercentage,
    required this.status,
    required this.periodsPerDay,
    required this.subjectBreakdown,
  });

  factory TeacherWorkload.fromJson(Map<String, dynamic> json) {
    final rawPpd = json['periodsPerDay'] as Map<String, dynamic>? ?? {};
    final ppd = <String, int>{};
    rawPpd.forEach((k, v) {
      ppd[k] = v is int ? v : int.tryParse(v.toString()) ?? 0;
    });

    return TeacherWorkload(
      totalPeriodsPerWeek: json['totalPeriodsPerWeek'] is int
          ? json['totalPeriodsPerWeek']
          : int.tryParse(json['totalPeriodsPerWeek']?.toString() ?? '0') ?? 0,
      maxWeeklyPeriods: json['maxWeeklyPeriods'] is int
          ? json['maxWeeklyPeriods']
          : int.tryParse(json['maxWeeklyPeriods']?.toString() ?? '28') ?? 28,
      workloadPercentage: json['workloadPercentage'] is int
          ? json['workloadPercentage']
          : int.tryParse(json['workloadPercentage']?.toString() ?? '0') ?? 0,
      status: json['status']?.toString() ?? 'optimal',
      periodsPerDay: ppd,
      subjectBreakdown: json['subjectBreakdown'] as Map<String, dynamic>? ?? {},
    );
  }
}
