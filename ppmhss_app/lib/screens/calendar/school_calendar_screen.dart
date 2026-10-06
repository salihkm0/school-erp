// lib/screens/calendar/school_calendar_screen.dart
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:school_management/models/school_calendar_model.dart';
import 'package:school_management/services/school_calendar_service.dart';
import 'package:school_management/utils/theme.dart';
import 'package:school_management/widgets/common/loading_widget.dart';

class SchoolCalendarScreen extends StatefulWidget {
  const SchoolCalendarScreen({super.key});

  @override
  State<SchoolCalendarScreen> createState() => _SchoolCalendarScreenState();
}

class _SchoolCalendarScreenState extends State<SchoolCalendarScreen> {
  final SchoolCalendarService _calendarService = SchoolCalendarService();

  DateTime _focusedMonth = DateTime.now();
  DateTime? _selectedDate;
  String _selectedFilter = 'all'; // all, public_holiday, vacation, school_event, examination_period
  bool _isLoading = true;
  List<SchoolCalendarEvent> _events = [];

  static const List<String> _weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    setState(() => _isLoading = true);
    try {
      final events = await _calendarService.getCalendarEvents(
        year: _focusedMonth.year,
        month: _focusedMonth.month,
      );
      if (mounted) {
        setState(() {
          _events = events;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _onMonthChanged(int delta) {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + delta, 1);
    });
    _loadEvents();
  }

  List<SchoolCalendarEvent> get _filteredEvents {
    if (_selectedFilter == 'all') return _events;
    return _events.where((e) => e.type == _selectedFilter).toList();
  }

  // Find all events for a specific day
  List<SchoolCalendarEvent> _getEventsForDay(DateTime day) {
    return _events.where((e) {
      final start = DateTime(e.startDate.year, e.startDate.month, e.startDate.day);
      final end = DateTime(e.endDate.year, e.endDate.month, e.endDate.day, 23, 59, 59);
      final target = DateTime(day.year, day.month, day.day, 12, 0, 0);
      return target.isAfter(start.subtract(const Duration(hours: 1))) &&
          target.isBefore(end.add(const Duration(hours: 1)));
    }).toList();
  }

  Color _getEventColor(SchoolCalendarEvent event) {
    if (event.isVacation) return const Color(0xFF8B5CF6); // Purple
    if (event.isHoliday) return const Color(0xFFF59E0B); // Amber
    if (event.isExam) return const Color(0xFFEF4444); // Red
    if (event.isSchoolEvent) return const Color(0xFF3B82F6); // Blue
    return const Color(0xFF10B981); // Emerald
  }

  @override
  Widget build(BuildContext context) {
    final monthName = DateFormat('MMMM yyyy').format(_focusedMonth);
    final daysInMonth = DateUtils.getDaysInMonth(_focusedMonth.year, _focusedMonth.month);
    final firstDayOfWeek = DateTime(_focusedMonth.year, _focusedMonth.month, 1).weekday % 7;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text(
          'School Calendar & Holidays',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimaryColor,
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.today_rounded, color: AppTheme.primaryColor),
            tooltip: 'Go to Today',
            onPressed: () {
              setState(() {
                _focusedMonth = DateTime.now();
                _selectedDate = DateTime.now();
              });
              _loadEvents();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadEvents,
        color: AppTheme.primaryColor,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Month Selector Bar
              _buildMonthNavigator(monthName),
              const SizedBox(height: 12),

              // Calendar Card
              _buildCalendarCard(daysInMonth, firstDayOfWeek),
              const SizedBox(height: 16),

              // Quick Filter Chips
              _buildFilterChips(),
              const SizedBox(height: 16),

              // Events List Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Events in $monthName (${_filteredEvents.length})',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimaryColor,
                    ),
                  ),
                  if (_selectedFilter != 'all')
                    TextButton(
                      onPressed: () => setState(() => _selectedFilter = 'all'),
                      child: const Text('Clear Filter', style: TextStyle(fontSize: 12)),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              // Events List
              _isLoading
                  ? const Center(child: Padding(
                      padding: EdgeInsets.all(32),
                      child: LoadingWidget(),
                    ))
                  : _buildEventsList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMonthNavigator(String monthName) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left_rounded, size: 28),
            onPressed: () => _onMonthChanged(-1),
          ),
          Text(
            monthName,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimaryColor,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right_rounded, size: 28),
            onPressed: () => _onMonthChanged(1),
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarCard(int daysInMonth, int firstDayOfWeek) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          // Days of Week Header
          Row(
            children: List.generate(7, (index) {
              final isSunday = index == 0;
              return Expanded(
                child: Center(
                  child: Text(
                    _weekDays[index],
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isSunday ? Colors.red[400] : Colors.grey[600],
                    ),
                  ),
                ),
              );
            }),
          ),
          const Divider(height: 20),

          // Grid Days
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: daysInMonth + firstDayOfWeek,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 6,
              crossAxisSpacing: 6,
              childAspectRatio: 1.0,
            ),
            itemBuilder: (context, index) {
              if (index < firstDayOfWeek) {
                return const SizedBox.shrink();
              }

              final dayNumber = index - firstDayOfWeek + 1;
              final currentDate = DateTime(_focusedMonth.year, _focusedMonth.month, dayNumber);
              final isSunday = currentDate.weekday == DateTime.sunday;
              final isToday = DateUtils.isSameDay(currentDate, DateTime.now());
              final isSelected = _selectedDate != null && DateUtils.isSameDay(currentDate, _selectedDate);

              final dayEvents = _getEventsForDay(currentDate);
              final hasHoliday = dayEvents.any((e) => e.isHoliday);
              final hasEvent = dayEvents.isNotEmpty;

              Color? bgColor;
              Color textColor = Colors.black87;

              if (isSelected) {
                bgColor = AppTheme.primaryColor;
                textColor = Colors.white;
              } else if (hasHoliday) {
                bgColor = const Color(0xFFFEF3C7); // Amber 100
                textColor = const Color(0xFF92400E); // Amber 800
              } else if (isToday) {
                bgColor = AppTheme.primaryColor.withOpacity(0.12);
                textColor = AppTheme.primaryColor;
              } else if (isSunday) {
                bgColor = Colors.grey[100];
                textColor = Colors.grey[500]!;
              }

              return InkWell(
                onTap: () {
                  setState(() => _selectedDate = currentDate);
                  if (dayEvents.isNotEmpty) {
                    _showDayEventsBottomSheet(currentDate, dayEvents);
                  }
                },
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(10),
                    border: isSelected
                        ? null
                        : isToday
                            ? Border.all(color: AppTheme.primaryColor, width: 1.5)
                            : hasHoliday
                                ? Border.all(color: const Color(0xFFFDE68A), width: 1)
                                : null,
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Text(
                        '$dayNumber',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected || hasHoliday || isToday
                              ? FontWeight.bold
                              : FontWeight.normal,
                          color: textColor,
                        ),
                      ),
                      if (hasEvent && !isSelected)
                        Positioned(
                          bottom: 3,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: dayEvents.take(3).map((e) {
                              return Container(
                                width: 4,
                                height: 4,
                                margin: const EdgeInsets.symmetric(horizontal: 0.5),
                                decoration: BoxDecoration(
                                  color: _getEventColor(e),
                                  shape: BoxShape.circle,
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    final filters = [
      {'id': 'all', 'label': 'All Events', 'icon': Icons.calendar_month_outlined},
      {'id': 'public_holiday', 'label': 'Holidays', 'icon': Icons.beach_access_rounded},
      {'id': 'vacation', 'label': 'Vacations', 'icon': Icons.wb_sunny_outlined},
      {'id': 'school_event', 'label': 'School Fests', 'icon': Icons.celebration_outlined},
      {'id': 'examination_period', 'label': 'Exams', 'icon': Icons.assignment_outlined},
    ];

    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: filters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final item = filters[index];
          final isSelected = _selectedFilter == item['id'];

          return ChoiceChip(
            label: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  item['icon'] as IconData,
                  size: 15,
                  color: isSelected ? Colors.white : Colors.grey[700],
                ),
                const SizedBox(width: 5),
                Text(item['label'] as String),
              ],
            ),
            selected: isSelected,
            selectedColor: AppTheme.primaryColor,
            backgroundColor: Colors.white,
            labelStyle: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? Colors.white : Colors.grey[800],
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
              side: BorderSide(
                color: isSelected ? Colors.transparent : Colors.grey[300]!,
              ),
            ),
            onSelected: (_) {
              setState(() => _selectedFilter = item['id'] as String);
            },
          );
        },
      ),
    );
  }

  Widget _buildEventsList() {
    if (_filteredEvents.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(32),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Column(
          children: [
            Icon(Icons.event_busy_rounded, size: 48, color: Colors.grey[300]),
            const SizedBox(height: 10),
            Text(
              'No events or holidays scheduled for this month',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _filteredEvents.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final event = _filteredEvents[index];
        final eventColor = _getEventColor(event);

        final startFormatted = DateFormat('EEE, d MMM').format(event.startDate);
        final endFormatted = DateFormat('EEE, d MMM').format(event.endDate);
        final dateLabel = event.isSingleDay
            ? startFormatted
            : '$startFormatted — $endFormatted (${event.durationDays} Days)';

        return InkWell(
          onTap: () => _showEventDetailsDialog(event),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey[200]!),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: eventColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    event.isHoliday
                        ? Icons.beach_access_rounded
                        : event.isVacation
                            ? Icons.wb_sunny_rounded
                            : event.isExam
                                ? Icons.assignment_rounded
                                : Icons.celebration_rounded,
                    color: eventColor,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        event.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimaryColor,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        dateLabel,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: eventColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    event.typeLabel,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: eventColor,
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

  void _showDayEventsBottomSheet(DateTime date, List<SchoolCalendarEvent> dayEvents) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('EEEE, d MMMM yyyy').format(date),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ...dayEvents.map((evt) {
                  final color = _getEventColor(evt);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: color.withOpacity(0.2)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.event_note_rounded, color: color, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                evt.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              if (evt.description.isNotEmpty)
                                Text(
                                  evt.description,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[700],
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Text(
                          evt.typeLabel,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: color,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showEventDetailsDialog(SchoolCalendarEvent event) {
    final color = _getEventColor(event);
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.event, color: color, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  event.title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _detailRow('Category', event.typeLabel),
              _detailRow('Start Date', DateFormat('EEEE, d MMMM yyyy').format(event.startDate)),
              _detailRow('End Date', DateFormat('EEEE, d MMMM yyyy').format(event.endDate)),
              _detailRow('Duration', '${event.durationDays} Days'),
              if (event.description.isNotEmpty) ...[
                const SizedBox(height: 8),
                const Text('Description:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                const SizedBox(height: 2),
                Text(event.description, style: TextStyle(color: Colors.grey[700], fontSize: 12)),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: TextStyle(fontSize: 12, color: Colors.grey[600], fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
