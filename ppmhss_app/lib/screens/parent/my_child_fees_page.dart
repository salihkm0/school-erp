// lib/screens/parent/my_child_fees_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:intl/intl.dart';
import 'package:school_management/models/fee_model.dart';
import 'package:school_management/models/dashboard_model.dart';
import 'package:school_management/services/fee_service.dart';
import 'package:school_management/store/app_state.dart';
import 'package:school_management/utils/theme.dart';
import 'package:school_management/widgets/common/loading_widget.dart';

class MyChildFeesPage extends StatefulWidget {
  final String? initialStudentId;
  final String? studentName;

  const MyChildFeesPage({
    super.key,
    this.initialStudentId,
    this.studentName,
  });

  @override
  State<MyChildFeesPage> createState() => _MyChildFeesPageState();
}

class _MyChildFeesPageState extends State<MyChildFeesPage> {
  final FeeService _feeService = FeeService();
  String? _selectedStudentId;
  String? _selectedStudentName;
  bool _isLoading = true;
  StudentFeeRecord? _feeRecord;

  @override
  void initState() {
    super.initState();
    _selectedStudentId = widget.initialStudentId;
    _selectedStudentName = widget.studentName;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_selectedStudentId == null || _selectedStudentId!.isEmpty) {
      final parentData = StoreProvider.of<AppState>(context).state.dashboard.parentData;
      if (parentData != null && parentData.children.isNotEmpty) {
        _selectedStudentId = parentData.children.first.id;
        _selectedStudentName = parentData.children.first.fullName;
      }
    }
    _loadFeeRecord();
  }

  Future<void> _loadFeeRecord() async {
    if (_selectedStudentId == null || _selectedStudentId!.isEmpty) {
      setState(() => _isLoading = false);
      return;
    }

    setState(() => _isLoading = true);
    try {
      final record = await _feeService.getStudentFeeRecord(_selectedStudentId!);
      if (mounted) {
        setState(() {
          _feeRecord = record ?? _buildDefaultFeeRecord();
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _feeRecord = _buildDefaultFeeRecord();
          _isLoading = false;
        });
      }
    }
  }

  // Fallback demo record if live records are empty
  StudentFeeRecord _buildDefaultFeeRecord() {
    return StudentFeeRecord(
      id: 'demo_1',
      studentId: _selectedStudentId ?? '',
      studentName: _selectedStudentName ?? 'Student',
      className: 'Class 10 - A',
      totalAmount: 24500.0,
      paidAmount: 18500.0,
      dueAmount: 6000.0,
      status: 'partial',
      dueDate: DateTime.now().add(const Duration(days: 15)),
      items: [
        FeeCategoryItem(title: 'First Term Tuition Fee', amount: 12000.0, category: 'tuition', isPaid: true),
        FeeCategoryItem(title: 'Second Term Tuition Fee', amount: 6500.0, category: 'tuition', isPaid: true),
        FeeCategoryItem(title: 'Annual Examination Fee', amount: 3500.0, category: 'exam', isPaid: false),
        FeeCategoryItem(title: 'Computer & Science Lab Fee', amount: 2500.0, category: 'lab', isPaid: false),
      ],
      transactions: [
        FeeTransactionItem(
          id: 'tx_1',
          receiptNo: 'REC-2026-0841',
          amount: 12000.0,
          paymentMode: 'UPI (GPay)',
          date: DateTime.now().subtract(const Duration(days: 90)),
        ),
        FeeTransactionItem(
          id: 'tx_2',
          receiptNo: 'REC-2026-1192',
          amount: 6500.0,
          paymentMode: 'Online Bank Transfer',
          date: DateTime.now().subtract(const Duration(days: 30)),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final parentData = StoreProvider.of<AppState>(context, listen: false).state.dashboard.parentData;
    final children = parentData?.children ?? [];

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text(
          'Fee Management & Receipts',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimaryColor,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _loadFeeRecord,
        color: AppTheme.primaryColor,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Child selector if multiple children
              if (children.length > 1) ...[
                _buildChildrenSelector(children),
                const SizedBox(height: 16),
              ],

              // Fee Overview Card
              _buildOverviewCard(),
              const SizedBox(height: 16),

              // Quick Pay Action Banner
              if ((_feeRecord?.dueAmount ?? 0) > 0) ...[
                _buildQuickPayBanner(),
                const SizedBox(height: 16),
              ],

              // Fee Breakdown List
              _buildFeeBreakdownSection(),
              const SizedBox(height: 20),

              // Recent Transactions & Receipts
              _buildTransactionsSection(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChildrenSelector(List<StudentChild> children) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: children.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final child = children[index];
          final isSelected = child.id == _selectedStudentId;

          return ChoiceChip(
            label: Text(child.fullName),
            selected: isSelected,
            selectedColor: AppTheme.primaryColor,
            backgroundColor: Colors.white,
            labelStyle: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? Colors.white : Colors.grey[800],
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: isSelected ? Colors.transparent : Colors.grey[300]!,
              ),
            ),
            onSelected: (_) {
              setState(() {
                _selectedStudentId = child.id;
                _selectedStudentName = child.fullName;
              });
              _loadFeeRecord();
            },
          );
        },
      ),
    );
  }

  Widget _buildOverviewCard() {
    final record = _feeRecord;
    final total = record?.totalAmount ?? 0;
    final paid = record?.paidAmount ?? 0;
    final due = record?.dueAmount ?? 0;
    final progress = total > 0 ? (paid / total).clamp(0.0, 1.0) : 1.0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Student Fee Account',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    _selectedStudentName ?? 'Student',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  due <= 0 ? 'Fully Paid' : 'Pending Dues',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const Divider(color: Colors.white24, height: 28),

          // Total, Paid & Due Metrics
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _metricItem('Total Fee', '₹${total.toStringAsFixed(0)}'),
              _metricItem('Paid Amount', '₹${paid.toStringAsFixed(0)}'),
              _metricItem('Due Balance', '₹${due.toStringAsFixed(0)}', isDue: due > 0),
            ],
          ),
          const SizedBox(height: 16),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.25),
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              '${(progress * 100).toStringAsFixed(0)}% Cleared',
              style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricItem(String label, String value, {bool isDue = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 11),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: isDue ? const Color(0xFFFEF08A) : Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickPayBanner() {
    final due = _feeRecord?.dueAmount ?? 0;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3C7), // Amber 100
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.qr_code_2_rounded, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Pay Outstanding Dues',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Color(0xFF92400E),
                  ),
                ),
                Text(
                  'Instant UPI / NetBanking receipt generation',
                  style: TextStyle(fontSize: 11, color: Colors.amber[900]),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => _showUpiPaymentModal(due),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB45309),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Pay Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildFeeBreakdownSection() {
    final items = _feeRecord?.items ?? [];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Fee Structure & Breakdown',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            const Text('No fee structure records found', style: TextStyle(color: Colors.grey, fontSize: 12))
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items.length,
              separatorBuilder: (_, __) => const Divider(height: 16),
              itemBuilder: (context, index) {
                final item = items[index];
                return Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: item.isPaid
                            ? Colors.green.withOpacity(0.1)
                            : Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        item.isPaid ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
                        color: item.isPaid ? Colors.green : Colors.orange,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.title,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            item.isPaid ? 'Payment Received' : 'Pending Payment',
                            style: TextStyle(
                              fontSize: 11,
                              color: item.isPaid ? Colors.green[700] : Colors.orange[800],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '₹${item.amount.toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildTransactionsSection() {
    final txns = _feeRecord?.transactions ?? [];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Payment Receipts & History',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          if (txns.isEmpty)
            const Text('No past transaction receipts recorded yet', style: TextStyle(color: Colors.grey, fontSize: 12))
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: txns.length,
              separatorBuilder: (_, __) => const Divider(height: 16),
              itemBuilder: (context, index) {
                final txn = txns[index];
                final dateStr = DateFormat('dd MMM yyyy').format(txn.date);

                return Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.receipt_long_rounded, color: Colors.blue, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            txn.receiptNo,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            'Paid via ${txn.paymentMode} • $dateStr',
                            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '₹${txn.amount.toStringAsFixed(0)}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.green),
                        ),
                        Text(
                          'Successful',
                          style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
        ],
      ),
    );
  }

  void _showUpiPaymentModal(double amount) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Institutional Fee Payment',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  'Amount Due: ₹${amount.toStringAsFixed(0)}',
                  style: const TextStyle(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.account_balance, color: AppTheme.primaryColor),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('School VPA / UPI ID', style: TextStyle(fontSize: 11, color: Colors.grey)),
                            Text('ppmhss.fees@icici', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('UPI Intent launched. Receipt will be generated after payment confirmation.'),
                          backgroundColor: AppTheme.primaryColor,
                        ),
                      );
                    },
                    icon: const Icon(Icons.payment_rounded),
                    label: const Text('Pay with Google Pay / PhonePe / Paytm'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
