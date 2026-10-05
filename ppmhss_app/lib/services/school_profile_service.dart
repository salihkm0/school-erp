import 'package:school_management/models/school_profile_model.dart';
import 'package:school_management/services/api_service.dart';

class SchoolProfileService {
  final ApiService _apiService = ApiService();
  static SchoolProfileModel? _cachedProfile;

  static SchoolProfileModel get currentProfile => _cachedProfile ?? SchoolProfileModel();

  Future<SchoolProfileModel> getSchoolProfile() async {
    try {
      final response = await _apiService.get('/app-config/school-profile', noCache: true);
      if (response.data != null && response.data['data'] != null) {
        final profile = SchoolProfileModel.fromJson(Map<String, dynamic>.from(response.data['data']));
        _cachedProfile = profile;
        return profile;
      }
      return _cachedProfile ?? SchoolProfileModel();
    } catch (_) {
      return _cachedProfile ?? SchoolProfileModel();
    }
  }
}
