import 'package:school_management/services/api_service.dart';
import 'package:school_management/models/fest_event_model.dart';

class FestEventService {
  final ApiService _api = ApiService();

  /// Get all active sports & arts events
  Future<List<FestEventModel>> getEvents() async {
    try {
      final response = await _api.get('/events');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final list = response.data['events'] as List? ?? [];
        return list.map((e) => FestEventModel.fromJson(e as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Get live house point table / leaderboard for an event
  Future<List<HouseLeaderboard>> getEventLeaderboard(String eventId) async {
    try {
      final response = await _api.get('/events/$eventId/leaderboard');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final list = response.data['leaderboard'] as List? ?? [];
        int rank = 1;
        return list.map((item) {
          final res = HouseLeaderboard.fromJson(item as Map<String, dynamic>, rank);
          rank++;
          return res;
        }).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Get items for an event
  Future<List<EventItemModel>> getEventItems(String eventId) async {
    try {
      final response = await _api.get('/events/$eventId/items');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final list = response.data['items'] as List? ?? [];
        return list.map((item) => EventItemModel.fromJson(item as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
