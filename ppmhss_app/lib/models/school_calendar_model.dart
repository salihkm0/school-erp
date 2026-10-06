// lib/models/school_calendar_model.dart

class SchoolCalendarEvent {
  final String id;
  final String title;
  final String type; // public_holiday, vacation, school_event, examination_period, restricted_holiday, special_working_day
  final DateTime startDate;
  final DateTime endDate;
  final String? academicYearId;
  final String? academicYearName;
  final String description;
  final String applicableTo; // all, students_only, staff_only, specific_classes
  final List<String> classIds;
  final String color;
  final bool isNationalHoliday;

  SchoolCalendarEvent({
    required this.id,
    required this.title,
    required this.type,
    required this.startDate,
    required this.endDate,
    this.academicYearId,
    this.academicYearName,
    this.description = '',
    this.applicableTo = 'all',
    this.classIds = const [],
    this.color = '',
    this.isNationalHoliday = false,
  });

  bool get isHoliday =>
      type == 'public_holiday' ||
      type == 'vacation' ||
      type == 'restricted_holiday';

  bool get isVacation => type == 'vacation';
  bool get isExam => type == 'examination_period';
  bool get isSchoolEvent => type == 'school_event';
  bool get isSpecialWorkingDay => type == 'special_working_day';

  bool get isSingleDay {
    return startDate.year == endDate.year &&
        startDate.month == endDate.month &&
        startDate.day == endDate.day;
  }

  int get durationDays {
    return endDate.difference(startDate).inDays + 1;
  }

  String get typeLabel {
    switch (type) {
      case 'public_holiday':
        return 'Public Holiday';
      case 'vacation':
        return 'Vacation / Break';
      case 'school_event':
        return 'School Event / Fest';
      case 'examination_period':
        return 'Exam Schedule';
      case 'restricted_holiday':
        return 'Restricted Holiday';
      case 'special_working_day':
        return 'Compensatory Working Day';
      default:
        return 'Event';
    }
  }

  factory SchoolCalendarEvent.fromJson(Map<String, dynamic> json) {
    DateTime parseDate(dynamic dateVal) {
      if (dateVal == null) return DateTime.now();
      if (dateVal is DateTime) return dateVal;
      return DateTime.tryParse(dateVal.toString()) ?? DateTime.now();
    }

    String? acaName;
    if (json['academicYearId'] is Map) {
      acaName = json['academicYearId']['name'];
    }

    return SchoolCalendarEvent(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? 'School Event',
      type: json['type']?.toString() ?? 'public_holiday',
      startDate: parseDate(json['startDate']),
      endDate: parseDate(json['endDate'] ?? json['startDate']),
      academicYearId: json['academicYearId'] is Map
          ? json['academicYearId']['_id']?.toString()
          : json['academicYearId']?.toString(),
      academicYearName: acaName,
      description: json['description']?.toString() ?? '',
      applicableTo: json['applicableTo']?.toString() ?? 'all',
      classIds: (json['classIds'] as List?)
              ?.map((e) => e is Map ? e['_id'].toString() : e.toString())
              .toList() ??
          const [],
      color: json['color']?.toString() ?? '',
      isNationalHoliday: json['isNationalHoliday'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'type': type,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'academicYearId': academicYearId,
      'description': description,
      'applicableTo': applicableTo,
      'classIds': classIds,
      'color': color,
      'isNationalHoliday': isNationalHoliday,
    };
  }
}
