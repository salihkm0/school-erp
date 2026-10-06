// lib/services/school_calendar_service.dart
import 'package:dio/dio.dart';
import 'package:school_management/models/school_calendar_model.dart';
import 'package:school_management/services/api_service.dart';

class SchoolCalendarService {
  static final SchoolCalendarService _instance =
      SchoolCalendarService._internal();
  factory SchoolCalendarService() => _instance;
  SchoolCalendarService._internal();

  final ApiService _apiService = ApiService();

  // Fetch all calendar events with optional filters
  Future<List<SchoolCalendarEvent>> getCalendarEvents({
    int? month,
    int? year,
    String? type,
    String? academicYearId,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (month != null) queryParams['month'] = month;
      if (year != null) queryParams['year'] = year;
      if (type != null && type != 'all') queryParams['type'] = type;
      if (academicYearId != null) queryParams['academicYearId'] = academicYearId;

      final response = await _apiService.dio.get(
        '/calendar',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final List list = response.data['data'] ?? [];
        return list.map((e) => SchoolCalendarEvent.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      // Fallback on error
      return [];
    }
  }

  // Fetch upcoming holidays
  Future<List<SchoolCalendarEvent>> getUpcomingHolidays({int limit = 5}) async {
    try {
      final response = await _apiService.dio.get(
        '/calendar/upcoming',
        queryParameters: {'limit': limit},
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final List list = response.data['data'] ?? [];
        return list.map((e) => SchoolCalendarEvent.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Quick check if a date is a holiday or school event
  SchoolCalendarEvent? findHolidayForDate(
    List<SchoolCalendarEvent> events,
    DateTime date,
  ) {
    for (final event in events) {
      final start = DateTime(
        event.startDate.year,
        event.startDate.month,
        event.startDate.day,
      );
      final end = DateTime(
        event.endDate.year,
        event.endDate.month,
        event.endDate.day,
        23,
        59,
        59,
      );
      final current = DateTime(date.year, date.month, date.day, 12, 0, 0);

      if (current.isAfter(start.subtract(const Duration(hours: 1))) &&
          current.isBefore(end.add(const Duration(hours: 1)))) {
        return event;
      }
    }
    return null;
  }
}
