import 'package:school_management/services/api_service.dart';
import 'package:school_management/models/timetable_model.dart';

class TimetableService {
  final ApiService _api = ApiService();

  /// Get class timetable with periods and substitutions
  Future<Map<String, dynamic>> getClassTimetable(String classId, {String? date}) async {
    try {
      final response = await _api.get(
        '/timetable/class/$classId',
        params: date != null ? {'date': date} : null,
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        final rawClass = response.data['classData'] as Map<String, dynamic>;
        final rawTimetable = rawClass['timetable'] as List? ?? [];
        final days = rawTimetable.map((d) => DayTimetable.fromJson(d as Map<String, dynamic>)).toList();

        final rawSubs = response.data['substitutions'] as List? ?? [];
        final subs = rawSubs.map((s) => SubstitutionRecord.fromJson(s as Map<String, dynamic>)).toList();

        return {
          'success': true,
          'days': days,
          'substitutions': subs,
          'className': rawClass['section'] != null && rawClass['section'].toString().isNotEmpty
              ? '${rawClass['name']}-${rawClass['section']}'
              : rawClass['name']?.toString() ?? '',
          'classTeacherName': rawClass['classTeacherId'] is Map
              ? rawClass['classTeacherId']['name']?.toString()
              : '',
        };
      }
      return {'success': false, 'message': response.data['message'] ?? 'Failed to load class schedule'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  /// Get teacher weekly timetable & workload
  Future<Map<String, dynamic>> getTeacherTimetable(String teacherId, {String? date}) async {
    try {
      final response = await _api.get(
        '/timetable/teacher/$teacherId',
        params: date != null ? {'date': date} : null,
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        final rawSchedule = response.data['weeklySchedule'] as Map<String, dynamic>? ?? {};
        final Map<String, List<PeriodSlot>> schedule = {};

        rawSchedule.forEach((day, slotsMap) {
          final slotList = <PeriodSlot>[];
          if (slotsMap is Map) {
            slotsMap.forEach((periodNumStr, slotJson) {
              if (slotJson is Map<String, dynamic>) {
                slotList.add(PeriodSlot.fromJson(slotJson));
              }
            });
          }
          // Sort by periodNumber
          slotList.sort((a, b) => a.periodNumber.compareTo(b.periodNumber));
          schedule[day] = slotList;
        });

        TeacherWorkload? analytics;
        if (response.data['analytics'] != null) {
          analytics = TeacherWorkload.fromJson(response.data['analytics'] as Map<String, dynamic>);
        }

        final rawAssignedSubs = response.data['substitutions']?['todayAssignedSubstitutions'] as List? ?? [];
        final assignedSubs = rawAssignedSubs.map((s) => SubstitutionRecord.fromJson(s as Map<String, dynamic>)).toList();

        return {
          'success': true,
          'schedule': schedule,
          'analytics': analytics,
          'assignedSubstitutions': assignedSubs,
          'teacherName': response.data['teacher']?['name']?.toString() ?? '',
        };
      }
      return {'success': false, 'message': response.data['message'] ?? 'Failed to load teacher schedule'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  /// Get currently logged in teacher schedule
  Future<Map<String, dynamic>> getMySchedule() async {
    try {
      final response = await _api.get('/timetable/my-schedule');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final rawSchedule = response.data['weeklySchedule'] as Map<String, dynamic>? ?? {};
        final Map<String, List<PeriodSlot>> schedule = {};

        rawSchedule.forEach((day, slotsMap) {
          final slotList = <PeriodSlot>[];
          if (slotsMap is Map) {
            slotsMap.forEach((periodNumStr, slotJson) {
              if (slotJson is Map<String, dynamic>) {
                slotList.add(PeriodSlot.fromJson(slotJson));
              }
            });
          }
          slotList.sort((a, b) => a.periodNumber.compareTo(b.periodNumber));
          schedule[day] = slotList;
        });

        TeacherWorkload? analytics;
        if (response.data['analytics'] != null) {
          analytics = TeacherWorkload.fromJson(response.data['analytics'] as Map<String, dynamic>);
        }

        final rawAssignedSubs = response.data['substitutions']?['todayAssignedSubstitutions'] as List? ?? [];
        final assignedSubs = rawAssignedSubs.map((s) => SubstitutionRecord.fromJson(s as Map<String, dynamic>)).toList();

        return {
          'success': true,
          'schedule': schedule,
          'analytics': analytics,
          'assignedSubstitutions': assignedSubs,
          'teacherName': response.data['teacher']?['name']?.toString() ?? '',
        };
      }
      return {'success': false, 'message': response.data['message'] ?? 'Failed to load schedule'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  /// Get daily substitutions list
  Future<List<SubstitutionRecord>> getDailySubstitutions({String? date}) async {
    try {
      final response = await _api.get(
        '/timetable/substitutions',
        params: date != null ? {'date': date} : null,
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        final list = response.data['substitutions'] as List? ?? [];
        return list.map((s) => SubstitutionRecord.fromJson(s as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Get structure (working days & periods)
  Future<Map<String, dynamic>> getTimetableStructure() async {
    try {
      final response = await _api.get('/timetable/structure');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final struct = response.data['structure'] as Map<String, dynamic>? ?? {};
        final workingDays = (struct['workingDays'] as List? ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
            .map((e) => e.toString())
            .toList();
        final rawPeriods = struct['periods'] as List? ?? [];
        final periods = rawPeriods.map((p) => PeriodConfig.fromJson(p as Map<String, dynamic>)).toList();

        return {
          'success': true,
          'workingDays': workingDays,
          'periods': periods,
        };
      }
      return {'success': false};
    } catch (e) {
      return {'success': false};
    }
  }
}
