// lib/models/fee_model.dart

class StudentFeeRecord {
  final String id;
  final String studentId;
  final String studentName;
  final String? admissionNo;
  final String? rollNumber;
  final String? className;
  final String academicYear;
  final double totalAmount;
  final double paidAmount;
  final double dueAmount;
  final String status; // paid, partial, pending, overdue
  final DateTime? dueDate;
  final List<FeeCategoryItem> items;
  final List<FeeTransactionItem> transactions;

  StudentFeeRecord({
    required this.id,
    required this.studentId,
    required this.studentName,
    this.admissionNo,
    this.rollNumber,
    this.className,
    this.academicYear = '2025-2026',
    required this.totalAmount,
    required this.paidAmount,
    required this.dueAmount,
    this.status = 'pending',
    this.dueDate,
    this.items = const [],
    this.transactions = const [],
  });

  bool get isFullyPaid => status == 'paid' || dueAmount <= 0;
  bool get isOverdue =>
      status == 'overdue' || (dueDate != null && dueDate!.isBefore(DateTime.now()) && dueAmount > 0);

  factory StudentFeeRecord.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic d) {
      if (d == null) return null;
      if (d is DateTime) return d;
      return DateTime.tryParse(d.toString());
    }

    double parseDouble(dynamic v) {
      if (v == null) return 0.0;
      if (v is num) return v.toDouble();
      return double.tryParse(v.toString()) ?? 0.0;
    }

    final rawItems = json['items'] as List? ?? json['feeBreakdown'] as List? ?? [];
    final itemsList = rawItems.map((i) => FeeCategoryItem.fromJson(i)).toList();

    final rawTxns = json['transactions'] as List? ?? json['payments'] as List? ?? [];
    final txnsList = rawTxns.map((t) => FeeTransactionItem.fromJson(t)).toList();

    return StudentFeeRecord(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      studentId: json['studentId'] is Map
          ? json['studentId']['_id']?.toString() ?? ''
          : json['studentId']?.toString() ?? '',
      studentName: json['studentName']?.toString() ??
          (json['studentId'] is Map ? json['studentId']['fullName']?.toString() ?? 'Student' : 'Student'),
      admissionNo: json['admissionNo']?.toString() ??
          (json['studentId'] is Map ? json['studentId']['admissionNo']?.toString() : null),
      rollNumber: json['rollNumber']?.toString() ??
          (json['studentId'] is Map ? json['studentId']['rollNumber']?.toString() : null),
      className: json['className']?.toString() ??
          (json['classId'] is Map ? json['classId']['displayName']?.toString() : null),
      academicYear: json['academicYear']?.toString() ?? '2025-2026',
      totalAmount: parseDouble(json['totalAmount'] ?? json['totalFee']),
      paidAmount: parseDouble(json['paidAmount'] ?? json['totalPaid']),
      dueAmount: parseDouble(json['dueAmount'] ?? json['pendingAmount']),
      status: json['status']?.toString() ?? 'pending',
      dueDate: parseDate(json['dueDate']),
      items: itemsList,
      transactions: txnsList,
    );
  }
}

class FeeCategoryItem {
  final String title;
  final double amount;
  final String category; // tuition, exam, lab, transport, library, activity
  final bool isPaid;

  FeeCategoryItem({
    required this.title,
    required this.amount,
    this.category = 'tuition',
    this.isPaid = false,
  });

  factory FeeCategoryItem.fromJson(Map<String, dynamic> json) {
    return FeeCategoryItem(
      title: json['title']?.toString() ?? json['name']?.toString() ?? 'Fee Item',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0.0,
      category: json['category']?.toString() ?? 'tuition',
      isPaid: json['isPaid'] == true,
    );
  }
}

class FeeTransactionItem {
  final String id;
  final String receiptNo;
  final double amount;
  final String paymentMode; // upi, cash, bank_transfer, card, cheque
  final DateTime date;
  final String status;

  FeeTransactionItem({
    required this.id,
    required this.receiptNo,
    required this.amount,
    required this.paymentMode,
    required this.date,
    this.status = 'completed',
  });

  factory FeeTransactionItem.fromJson(Map<String, dynamic> json) {
    DateTime parseDate(dynamic d) {
      if (d == null) return DateTime.now();
      if (d is DateTime) return d;
      return DateTime.tryParse(d.toString()) ?? DateTime.now();
    }

    return FeeTransactionItem(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      receiptNo: json['receiptNo']?.toString() ?? json['invoiceNumber']?.toString() ?? 'REC-001',
      amount: (json['amount'] is num) ? (json['amount'] as num).toDouble() : 0.0,
      paymentMode: json['paymentMode']?.toString() ?? 'cash',
      date: parseDate(json['date'] ?? json['paymentDate'] ?? json['createdAt']),
      status: json['status']?.toString() ?? 'completed',
    );
  }
}
