// lib/services/kerala_sslc_service.dart
import 'package:school_management/services/api_service.dart';
import 'package:school_management/models/kerala_sslc_model.dart';

class KeralaSSLCService {
  final ApiService _api = ApiService();

  /// Search candidate SSLC result by register number and optional DOB
  Future<KeralaSSLCResultModel?> searchResult({
    required String registerNumber,
    String? dob,
    String academicYear = '2025-2026',
  }) async {
    try {
      final Map<String, dynamic> queryParams = {
        'registerNumber': registerNumber.trim(),
        'academicYear': academicYear.trim(),
      };
      if (dob != null && dob.isNotEmpty) {
        queryParams['dob'] = dob;
      }

      final response = await _api.get(
        '/sslc/search',
        params: queryParams,
        noCache: true,
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        return KeralaSSLCResultModel.fromJson(response.data['data'] as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Get school-wide SSLC analytics and Full A+ Toppers
  Future<SSLCAnalyticsModel?> getAnalytics({String academicYear = '2025-2026'}) async {
    try {
      final response = await _api.get(
        '/sslc/analytics',
        params: {'academicYear': academicYear.trim()},
        noCache: true,
      );
      if (response.statusCode == 200 && response.data['success'] == true) {
        return SSLCAnalyticsModel.fromJson(response.data as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
