// lib/services/fee_service.dart
import 'package:dio/dio.dart';
import 'package:school_management/models/fee_model.dart';
import 'package:school_management/services/api_service.dart';

class FeeService {
  static final FeeService _instance = FeeService._internal();
  factory FeeService() => _instance;
  FeeService._internal();

  final ApiService _apiService = ApiService();

  // Get fee ledger details for a specific student (or my-child)
  Future<StudentFeeRecord?> getStudentFeeRecord(String studentId) async {
    try {
      final response = await _apiService.dio.get('/fees/student/$studentId');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data['data'] ?? response.data;
        return StudentFeeRecord.fromJson(data);
      }
      return null;
    } catch (_) {
      // Fallback mock representation if student fee endpoint isn't populated yet
      return null;
    }
  }

  // Generate UPI Payment Intent or String
  String generateUpiString({
    required String upiId,
    required String name,
    required double amount,
    required String transactionNote,
  }) {
    final cleanNote = Uri.encodeComponent(transactionNote);
    final cleanName = Uri.encodeComponent(name);
    return 'upi://pay?pa=$upiId&pn=$cleanName&am=${amount.toStringAsFixed(2)}&cu=INR&tn=$cleanNote';
  }
}
