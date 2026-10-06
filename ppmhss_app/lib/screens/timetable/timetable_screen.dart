import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:school_management/models/timetable_model.dart';
import 'package:school_management/models/class_model.dart';
import 'package:school_management/services/timetable_service.dart';
import 'package:school_management/services/class_service.dart';
import 'package:school_management/store/app_state.dart';
import 'package:school_management/utils/theme.dart';

class TimetableScreen extends StatefulWidget {
  final String? initialClassId;
  const TimetableScreen({super.key, this.initialClassId});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> with SingleTickerProviderStateMixin {
  final TimetableService _timetableService = TimetableService();
  final ClassService _classService = ClassService();

  bool _isLoading = true;
  String _selectedDay = 'Monday';
  final List<String> _workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Staff Schedule state
  Map<String, List<PeriodSlot>> _teacherSchedule = {};
  List<SubstitutionRecord> _assignedSubstitutions = [];

  // Class Schedule state
  List<ClassModel> _classes = [];
  String? _selectedClassId;
  List<DayTimetable> _classDays = [];

  // Substitutions list (for Admin)
  List<SubstitutionRecord> _dailySubstitutions = [];

  // Mode: 'my_schedule' | 'class_schedule' | 'substitutions'
  String _currentView = 'my_schedule';

  @override
  void initState() {
    super.initState();
    _initDefaultDay();
    _loadData();
  }

  void _initDefaultDay() {
    final now = DateTime.now();
    final weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    final todayName = weekdayNames[now.weekday - 1];
    if (_workingDays.contains(todayName)) {
      _selectedDay = todayName;
    }
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    final store = StoreProvider.of<AppState>(context, listen: false);
    final userRole = store.state.auth.user?.role ?? 'parent';

    // 1. Fetch Classes list for selector
    try {
      final classesRes = await _classService.getClasses(limit: 100);
      final rawList = classesRes['data'] as List? ?? [];
      final parsedClasses = rawList.map((c) => ClassModel.fromJson(c as Map<String, dynamic>)).toList();
      if (mounted) {
        setState(() {
          _classes = parsedClasses;
          if (_classes.isNotEmpty) {
            _selectedClassId = widget.initialClassId ?? _classes.first.id;
          }
        });
      }
    } catch (e) {
      // Fallback
    }

    // 2. Load according to role
    if (userRole == 'staff') {
      _currentView = 'my_schedule';
      await _loadTeacherSchedule();
    } else if (userRole == 'admin') {
      _currentView = 'class_schedule';
      if (_selectedClassId != null) {
        await _loadClassSchedule(_selectedClassId!);
      }
      await _loadDailySubstitutions();
    } else {
      // Parent: load child's class schedule
      _currentView = 'class_schedule';
      if (_selectedClassId != null) {
        await _loadClassSchedule(_selectedClassId!);
      }
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadTeacherSchedule() async {
    final res = await _timetableService.getMySchedule();
    if (res['success'] == true && mounted) {
      setState(() {
        _teacherSchedule = res['schedule'] as Map<String, List<PeriodSlot>>? ?? {};
        _assignedSubstitutions = res['assignedSubstitutions'] as List<SubstitutionRecord>? ?? [];
      });
    }
  }

  Future<void> _loadClassSchedule(String classId) async {
    final res = await _timetableService.getClassTimetable(classId);
    if (res['success'] == true && mounted) {
      setState(() {
        _classDays = res['days'] as List<DayTimetable>? ?? [];
      });
    }
  }

  Future<void> _loadDailySubstitutions() async {
    final subs = await _timetableService.getDailySubstitutions();
    if (mounted) {
      setState(() {
        _dailySubstitutions = subs;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, String>(
      converter: (store) => store.state.auth.user?.role ?? 'parent',
      builder: (context, userRole) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: AppBar(
            backgroundColor: AppTheme.primaryColor,
            foregroundColor: Colors.white,
            elevation: 0,
            title: const Text(
              'Timetable & Schedule',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: _loadData,
                tooltip: 'Refresh',
              ),
            ],
          ),
          body: _isLoading
              ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
              : Column(
                  children: [
                    // Top View Switcher for Staff & Admin
                    if (userRole == 'staff' || userRole == 'admin')
                      _buildTopViewSelector(userRole),

                    // Active Daily Substitutions Notice (if any)
                    if (_assignedSubstitutions.isNotEmpty && _currentView == 'my_schedule')
                      _buildTeacherSubstitutionBanner(),

                    // Class Selector (when viewing Class Schedule)
                    if (_currentView == 'class_schedule')
                      _buildClassSelector(),

                    // Working Days Carousel Tabs
                    if (_currentView != 'substitutions')
                      _buildDaysBar(),

                    // Main Schedule List
                    Expanded(
                      child: _currentView == 'my_schedule'
                          ? _buildTeacherDailySchedule()
                          : _currentView == 'class_schedule'
                              ? _buildClassDailySchedule()
                              : _buildSubstitutionsList(),
                    ),
                  ],
                ),
        );
      },
    );
  }

  Widget _buildTopViewSelector(String role) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            if (role == 'staff')
              Expanded(
                child: _buildSwitchTabButton(
                  title: 'My Schedule',
                  icon: Icons.person_outline,
                  isSelected: _currentView == 'my_schedule',
                  onTap: () {
                    setState(() => _currentView = 'my_schedule');
                    _loadTeacherSchedule();
                  },
                ),
              ),
            Expanded(
              child: _buildSwitchTabButton(
                title: 'Class Timetables',
                icon: Icons.school_outlined,
                isSelected: _currentView == 'class_schedule',
                onTap: () {
                  setState(() => _currentView = 'class_schedule');
                  if (_selectedClassId != null) {
                    _loadClassSchedule(_selectedClassId!);
                  }
                },
              ),
            ),
            if (role == 'admin')
              Expanded(
                child: _buildSwitchTabButton(
                  title: 'Substitutions',
                  icon: Icons.swap_horiz,
                  isSelected: _currentView == 'substitutions',
                  onTap: () {
                    setState(() => _currentView = 'substitutions');
                    _loadDailySubstitutions();
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTabButton({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 4, offset: const Offset(0, 2))]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: isSelected ? AppTheme.primaryColor : Colors.grey[600]),
            const SizedBox(width: 6),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? AppTheme.primaryColor : Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTeacherSubstitutionBanner() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B).withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Assigned Substitution Today',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF92400E)),
                ),
                Text(
                  _assignedSubstitutions
                      .map((s) => 'Class ${s.className} (Period ${s.periodNumber})')
                      .join(', '),
                  style: const TextStyle(fontSize: 12, color: Color(0xFFB45309)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassSelector() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.class_outlined, size: 18, color: AppTheme.primaryColor),
          const SizedBox(width: 8),
          const Text('Select Class:', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedClassId,
                  isExpanded: true,
                  hint: const Text('Choose Class', style: TextStyle(fontSize: 13)),
                  items: _classes.map((c) {
                    final label = c.section != null && c.section!.isNotEmpty
                        ? 'Class ${c.name}-${c.section}'
                        : 'Class ${c.name}';
                    return DropdownMenuItem<String>(
                      value: c.id,
                      child: Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() => _selectedClassId = val);
                      _loadClassSchedule(val);
                    }
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDaysBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: _workingDays.map((day) {
            final isSelected = _selectedDay == day;
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: ChoiceChip(
                label: Text(day),
                selected: isSelected,
                selectedColor: AppTheme.primaryColor,
                backgroundColor: Colors.grey[100],
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : Colors.grey[700],
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  fontSize: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: isSelected ? AppTheme.primaryColor : Colors.transparent,
                  ),
                ),
                onSelected: (selected) {
                  if (selected) {
                    setState(() => _selectedDay = day);
                  }
                },
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildTeacherDailySchedule() {
    final daySlots = _teacherSchedule[_selectedDay] ?? [];

    if (daySlots.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_available, size: 48, color: Colors.grey[300]),
            const SizedBox(height: 12),
            Text(
              'No scheduled periods for $_selectedDay',
              style: TextStyle(color: Colors.grey[600], fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: daySlots.length,
      itemBuilder: (context, index) {
        final slot = daySlots[index];
        return _buildPeriodCard(slot);
      },
    );
  }

  Widget _buildClassDailySchedule() {
    final dayObj = _classDays.firstWhere(
      (d) => d.day == _selectedDay,
      orElse: () => DayTimetable(day: _selectedDay, periods: []),
    );

    final periods = dayObj.periods;

    if (periods.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_month_outlined, size: 48, color: Colors.grey[300]),
            const SizedBox(height: 12),
            Text(
              'No periods scheduled on $_selectedDay',
              style: TextStyle(color: Colors.grey[600], fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: periods.length,
      itemBuilder: (context, index) {
        final slot = periods[index];
        return _buildPeriodCard(slot);
      },
    );
  }

  Widget _buildPeriodCard(PeriodSlot slot) {
    if (slot.isBreak) {
      return Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF3C7).withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFFDE68A)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.coffee_outlined, size: 16, color: Color(0xFFD97706)),
            const SizedBox(width: 8),
            Text(
              slot.notes.isNotEmpty ? slot.notes : 'INTERVAL / LUNCH BREAK',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF92400E)),
            ),
            const SizedBox(width: 8),
            Text(
              '(${slot.startTime} - ${slot.endTime})',
              style: const TextStyle(fontSize: 11, color: Color(0xFFB45309)),
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.grey[100]!),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Period Number Badge
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  'P${slot.periodNumber}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                    fontSize: 15,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Period Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          slot.subjectName.isNotEmpty ? slot.subjectName : 'Free Period',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            color: slot.subjectName.isNotEmpty ? const Color(0xFF0F172A) : Colors.grey[400],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (slot.type == 'lab')
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.purple[50],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'LAB',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.purple),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Timing
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: Colors.grey[400]),
                      const SizedBox(width: 4),
                      Text(
                        '${slot.startTime} - ${slot.endTime}',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Teacher / Class / Room Details
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: [
                      if (slot.className != null && slot.className!.isNotEmpty)
                        _buildInfoChip(Icons.school_outlined, 'Class ${slot.className}'),
                      if (slot.teacherName.isNotEmpty)
                        _buildInfoChip(Icons.person_outline, slot.teacherName),
                      if (slot.room.isNotEmpty)
                        _buildInfoChip(Icons.location_on_outlined, slot.room),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(fontSize: 11, color: Colors.grey[700], fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildSubstitutionsList() {
    if (_dailySubstitutions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline, size: 48, color: Colors.green[300]),
            const SizedBox(height: 12),
            const Text(
              'No teacher absences or substitutions today',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _dailySubstitutions.length,
      itemBuilder: (context, index) {
        final sub = _dailySubstitutions[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(color: Colors.grey[100]!),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Period ${sub.periodNumber} (${sub.startTime} - ${sub.endTime})',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      sub.status.toUpperCase(),
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.green[700]),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Class: ${sub.className} • Subject: ${sub.subjectName}',
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Text('Absent: ', style: TextStyle(fontSize: 12, color: Colors.red)),
                  Text(sub.originalTeacherName, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.red)),
                ],
              ),
              Row(
                children: [
                  const Text('Substitute: ', style: TextStyle(fontSize: 12, color: Colors.green)),
                  Text(
                    sub.substituteTeacherName.isNotEmpty ? sub.substituteTeacherName : 'Pending',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
