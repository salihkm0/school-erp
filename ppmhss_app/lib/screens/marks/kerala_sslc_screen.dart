// lib/screens/marks/kerala_sslc_screen.dart
import 'package:flutter/material.dart';
import 'package:school_management/models/kerala_sslc_model.dart';
import 'package:school_management/services/kerala_sslc_service.dart';

class KeralaSSLCScreen extends StatefulWidget {
  const KeralaSSLCScreen({super.key});

  @override
  State<KeralaSSLCScreen> createState() => _KeralaSSLCScreenState();
}

class _KeralaSSLCScreenState extends State<KeralaSSLCScreen> with SingleTickerProviderStateMixin {
  final KeralaSSLCService _service = KeralaSSLCService();
  final TextEditingController _regNoController = TextEditingController(text: '541001');

  late TabController _tabController;
  String _academicYear = '2025-2026';

  bool _isSearching = false;
  KeralaSSLCResultModel? _searchResult;
  String? _errorMessage;

  bool _isLoadingAnalytics = false;
  SSLCAnalyticsModel? _analytics;

  final List<Map<String, String>> _subjectOrder = [
    {'key': 'lang1', 'code': '101', 'name': 'Language Paper 1'},
    {'key': 'lang2', 'code': '102', 'name': 'Language Paper 2'},
    {'key': 'english', 'code': '103', 'name': 'English'},
    {'key': 'hindi', 'code': '104', 'name': 'Hindi'},
    {'key': 'socialScience', 'code': '105', 'name': 'Social Science'},
    {'key': 'physics', 'code': '106', 'name': 'Physics'},
    {'key': 'chemistry', 'code': '107', 'name': 'Chemistry'},
    {'key': 'biology', 'code': '108', 'name': 'Biology'},
    {'key': 'mathematics', 'code': '109', 'name': 'Mathematics'},
    {'key': 'it', 'code': '110', 'name': 'Information Technology'},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAnalytics();
    _performSearch('541001');
  }

  @override
  void dispose() {
    _tabController.dispose();
    _regNoController.dispose();
    super.dispose();
  }

  Future<void> _loadAnalytics() async {
    setState(() => _isLoadingAnalytics = true);
    final data = await _service.getAnalytics(academicYear: _academicYear);
    if (mounted) {
      setState(() {
        _analytics = data;
        _isLoadingAnalytics = false;
      });
    }
  }

  Future<void> _performSearch(String regNo) async {
    if (regNo.trim().isEmpty) return;
    setState(() {
      _isSearching = true;
      _errorMessage = null;
    });

    final res = await _service.searchResult(
      registerNumber: regNo.trim(),
      academicYear: _academicYear,
    );

    if (mounted) {
      setState(() {
        _isSearching = false;
        if (res != null) {
          _searchResult = res;
          _errorMessage = null;
        } else {
          _searchResult = null;
          _errorMessage = 'No SSLC result found for Register #$regNo in $_academicYear';
        }
      });
    }
  }

  Color _getGradeColor(String grade) {
    switch (grade.toUpperCase()) {
      case 'A+':
        return const Color(0xFF047857); // Emerald
      case 'A':
        return const Color(0xFF16A34A); // Green
      case 'B+':
        return const Color(0xFF0D9488); // Teal
      case 'B':
        return const Color(0xFF2563EB); // Blue
      case 'C+':
        return const Color(0xFF4F46E5); // Indigo
      case 'C':
        return const Color(0xFFD97706); // Amber
      case 'D+':
        return const Color(0xFFEA580C); // Orange
      case 'D':
      case 'E':
        return const Color(0xFFDC2626); // Red
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: const Color(0xFF064E3B),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Kerala SSLC Results',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
            ),
            Text(
              'Pareeksha Bhavan • Batch $_academicYear',
              style: const TextStyle(fontSize: 11, color: Color(0xFF6EE7B7)),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12, top: 10, bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _academicYear,
                dropdownColor: const Color(0xFF064E3B),
                icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                items: const [
                  DropdownMenuItem(value: '2025-2026', child: Text('2025-2026')),
                  DropdownMenuItem(value: '2024-2025', child: Text('2024-2025')),
                  DropdownMenuItem(value: '2023-2024', child: Text('2023-2024')),
                ],
                onChanged: (val) {
                  if (val != null && val != _academicYear) {
                    setState(() => _academicYear = val);
                    _loadAnalytics();
                    _performSearch(_regNoController.text);
                  }
                },
              ),
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFFFBBF24),
          indicatorWeight: 3,
          labelColor: const Color(0xFFFBBF24),
          unselectedLabelColor: Colors.white70,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(icon: Icon(Icons.search, size: 18), text: 'Result Card'),
            Tab(icon: Icon(Icons.emoji_events, size: 18), text: 'Wall of Fame'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSearchTab(),
          _buildWallOfFameTab(),
        ],
      ),
    );
  }

  // TAB 1: Search & Result Card
  Widget _buildSearchTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Search Input Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Candidate Result Verification',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF1E293B)),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Enter 6-digit SSLC Register Number to fetch official grade sheet.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _regNoController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontWeight: FontWeight.w700, letterSpacing: 1.2),
                        decoration: InputDecoration(
                          hintText: 'e.g. 541001',
                          prefixIcon: const Icon(Icons.badge_outlined, color: Color(0xFF064E3B)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          filled: true,
                          fillColor: const Color(0xFFF1F5F9),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onSubmitted: (v) => _performSearch(v),
                      ),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: _isSearching ? null : () => _performSearch(_regNoController.text),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF047857),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: _isSearching
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Text('Check', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Quick Candidate Chips
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    const Text('Demo:', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w600)),
                    for (final chip in ['541001', '541002', '541011', '541016'])
                      ActionChip(
                        label: Text(
                          '#$chip',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF047857)),
                        ),
                        backgroundColor: const Color(0xFFECFDF5),
                        side: const BorderSide(color: Color(0xFFA7F3D0)),
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
                        onPressed: () {
                          _regNoController.text = chip;
                          _performSearch(chip);
                        },
                      ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          if (_errorMessage != null)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Color(0xFFDC2626)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(color: Color(0xFF991B1B), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),

          if (_searchResult != null) _buildResultCertificate(_searchResult!),
        ],
      ),
    );
  }

  Widget _buildResultCertificate(KeralaSSLCResultModel result) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF064E3B).withValues(alpha: 0.2), width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, 6),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Certificate Header
          Container(
            padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
            decoration: const BoxDecoration(
              color: Color(0xFF064E3B),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(22),
                topRight: Radius.circular(22),
              ),
            ),
            child: Column(
              children: [
                const Text(
                  'GOVERNMENT OF KERALA • PAREEKSHA BHAVAN',
                  style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5),
                ),
                const SizedBox(height: 4),
                const Text(
                  'SECONDARY SCHOOL LEAVING CERTIFICATE',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                ),
                const SizedBox(height: 2),
                Text(
                  'SSLC EXAMINATION MARCH ${result.academicYear.split('-').last}',
                  style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),

          // Full A+ Trophy Banner
          if (result.fullAPlus)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
              color: const Color(0xFFFBBF24),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.stars, color: Color(0xFF78350F), size: 20),
                  SizedBox(width: 8),
                  Text(
                    '★ OUTSTANDING ACHIEVEMENT: 10/10 FULL A+ ★',
                    style: TextStyle(color: Color(0xFF78350F), fontWeight: FontWeight.w900, fontSize: 12),
                  ),
                ],
              ),
            ),

          // Candidate Details
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('CANDIDATE NAME', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                          Text(result.candidateName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
                          const SizedBox(height: 8),
                          const Text('SCHOOL', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                          Text('${result.schoolCode} - ${result.schoolName}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('REGISTER NO', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                        Text(result.registerNumber, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF047857), letterSpacing: 1.1)),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: result.resultStatus == 'EHS' ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: result.resultStatus == 'EHS' ? const Color(0xFFA7F3D0) : const Color(0xFFFCA5A5),
                            ),
                          ),
                          child: Text(
                            result.resultStatus == 'EHS' ? '★ EHS - ELIGIBLE' : '⚠️ NHS',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: result.resultStatus == 'EHS' ? const Color(0xFF047857) : const Color(0xFFDC2626),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 16),
                const Divider(color: Color(0xFFE2E8F0)),
                const SizedBox(height: 8),

                // 10 Subject List
                for (final sub in _subjectOrder) ...[
                  Builder(builder: (context) {
                    final gradeObj = result.subjects[sub['key']!];
                    final grade = gradeObj?.grade ?? 'A+';
                    final color = _getGradeColor(grade);
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 5),
                      child: Row(
                        children: [
                          Text(sub['code']!, style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(sub['name']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: color.withValues(alpha: 0.4)),
                            ),
                            child: Text(
                              grade,
                              style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 13),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],

                const SizedBox(height: 16),
                const Divider(color: Color(0xFFE2E8F0)),

                // Cumulative Score Box
                Container(
                  margin: const EdgeInsets.only(top: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          const Text('Total A+', style: TextStyle(fontSize: 10, color: Color(0xFF047857), fontWeight: FontWeight.bold)),
                          Text('${result.totalAPlusCount} / 10', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF065F46))),
                        ],
                      ),
                      Container(width: 1, height: 28, color: const Color(0xFF86EFAC)),
                      Column(
                        children: [
                          const Text('GPA', style: TextStyle(fontSize: 10, color: Color(0xFF047857), fontWeight: FontWeight.bold)),
                          Text(result.gpa.toStringAsFixed(2), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF4338CA))),
                        ],
                      ),
                      Container(width: 1, height: 28, color: const Color(0xFF86EFAC)),
                      Column(
                        children: [
                          const Text('Points', style: TextStyle(fontSize: 10, color: Color(0xFF047857), fontWeight: FontWeight.bold)),
                          Text('${result.totalGradePoints} / 90', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF1E293B))),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // TAB 2: Wall of Fame & Honors
  Widget _buildWallOfFameTab() {
    if (_isLoadingAnalytics) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF047857)));
    }

    final analytics = _analytics;
    if (analytics == null) {
      return const Center(child: Text('No SSLC honors data available'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Stat Metrics Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  'Appeared',
                  '${analytics.totalAppeared}',
                  Icons.groups,
                  const Color(0xFF2563EB),
                  const Color(0xFFEFF6FF),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildMetricCard(
                  'Pass Rate',
                  '${analytics.passPercentage}%',
                  Icons.verified,
                  const Color(0xFF047857),
                  const Color(0xFFECFDF5),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard(
                  'Full A+ Stars',
                  '${analytics.fullAPlusCount}',
                  Icons.emoji_events,
                  const Color(0xFFB45309),
                  const Color(0xFFFEF3C7),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildMetricCard(
                  '9 A+ Stars',
                  '${analytics.nineAPlusCount}',
                  Icons.star,
                  const Color(0xFF4F46E5),
                  const Color(0xFFEEF2FF),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Wall of Fame Header
          Row(
            children: [
              const Icon(Icons.emoji_events, color: Color(0xFFF59E0B), size: 24),
              const SizedBox(width: 8),
              Text(
                'Full A+ Champions (${analytics.toppers.length})',
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF0F172A)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Students who secured A+ grade in all 10 Kerala SSLC subjects',
            style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 14),

          // Toppers List
          for (int i = 0; i < analytics.toppers.length; i++) ...[
            Builder(builder: (context) {
              final topper = analytics.toppers[i];
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFDE68A)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    )
                  ],
                ),
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFFFBBF24),
                    child: Text(
                      '${i + 1}',
                      style: const TextStyle(color: Color(0xFF78350F), fontWeight: FontWeight.w900, fontSize: 13),
                    ),
                  ),
                  title: Text(
                    topper.candidateName,
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                  ),
                  subtitle: Text(
                    'Reg: ${topper.registerNumber} • 10/10 A+ (9.0 GPA)',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF047857), fontWeight: FontWeight.w600),
                  ),
                  trailing: ElevatedButton(
                    onPressed: () {
                      _tabController.animateTo(0);
                      _regNoController.text = topper.registerNumber;
                      _performSearch(topper.registerNumber);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF047857),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                    child: const Text('View', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: color.withValues(alpha: 0.15),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.bold)),
                Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
