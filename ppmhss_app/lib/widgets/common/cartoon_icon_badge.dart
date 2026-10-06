// lib/widgets/common/cartoon_icon_badge.dart
import 'package:flutter/material.dart';

enum CartoonIconType {
  students,
  teachers,
  attendance,
  addAttendance,
  timetable,
  exams,
  results,
  fees,
  events,
  calendar,
  classes,
  subjects,
  duties,
  reports,
  inbox,
  doubt,
  configure,
  profile,
  sslc,
  elearning
}

class CartoonIconBadge extends StatelessWidget {
  final CartoonIconType type;
  final double size;

  const CartoonIconBadge({
    super.key,
    required this.type,
    this.size = 56.0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _getBgColor(),
        borderRadius: BorderRadius.circular(size * 0.32),
        boxShadow: [
          BoxShadow(
            color: _getShadowColor().withValues(alpha: 0.25),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: _buildIconContent(),
      ),
    );
  }

  Color _getBgColor() {
    switch (type) {
      case CartoonIconType.students:
        return const Color(0xFFEFF6FF); // soft blue
      case CartoonIconType.teachers:
        return const Color(0xFFFDF2F8); // soft pink
      case CartoonIconType.attendance:
      case CartoonIconType.addAttendance:
        return const Color(0xFFECFDF5); // soft emerald
      case CartoonIconType.timetable:
        return const Color(0xFFEFF6FF); // soft sky
      case CartoonIconType.exams:
        return const Color(0xFFFEF2F2); // soft red
      case CartoonIconType.results:
      case CartoonIconType.sslc:
        return const Color(0xFFFFFBEB); // soft amber/gold
      case CartoonIconType.fees:
        return const Color(0xFFF5F3FF); // soft purple
      case CartoonIconType.events:
        return const Color(0xFFFFF1F2); // soft rose
      case CartoonIconType.calendar:
        return const Color(0xFFFFF7ED); // soft orange
      case CartoonIconType.classes:
        return const Color(0xFFF0FDF4); // soft green
      case CartoonIconType.subjects:
        return const Color(0xFFF0F9FF); // soft light blue
      case CartoonIconType.duties:
        return const Color(0xFFF8FAFC); // soft slate
      case CartoonIconType.reports:
        return const Color(0xFFF0FDF4); // soft mint
      case CartoonIconType.inbox:
        return const Color(0xFFFEF3C7); // soft yellow
      case CartoonIconType.doubt:
        return const Color(0xFFECFEFF); // soft cyan
      case CartoonIconType.configure:
        return const Color(0xFFF1F5F9); // soft cool grey
      case CartoonIconType.profile:
        return const Color(0xFFEFF6FF); // soft blue
      case CartoonIconType.elearning:
        return const Color(0xFFEDE9FE); // soft lavender
    }
  }

  Color _getShadowColor() {
    switch (type) {
      case CartoonIconType.students:
        return const Color(0xFF3B82F6);
      case CartoonIconType.teachers:
        return const Color(0xFFEC4899);
      case CartoonIconType.attendance:
      case CartoonIconType.addAttendance:
        return const Color(0xFF10B981);
      case CartoonIconType.timetable:
        return const Color(0xFF0284C7);
      case CartoonIconType.exams:
        return const Color(0xFFEF4444);
      case CartoonIconType.results:
      case CartoonIconType.sslc:
        return const Color(0xFFF59E0B);
      case CartoonIconType.fees:
        return const Color(0xFF8B5CF6);
      case CartoonIconType.events:
        return const Color(0xFFF43F5E);
      case CartoonIconType.calendar:
        return const Color(0xFFF97316);
      default:
        return const Color(0xFF64748B);
    }
  }

  Widget _buildIconContent() {
    final iconSize = size * 0.58;

    switch (type) {
      case CartoonIconType.students:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.face_retouching_natural_rounded, size: iconSize, color: const Color(0xFF3B82F6)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle),
                child: const Icon(Icons.menu_book_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.teachers:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.person_pin_circle_rounded, size: iconSize, color: const Color(0xFFEC4899)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                child: const Icon(Icons.school_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.attendance:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.assignment_turned_in_rounded, size: iconSize, color: const Color(0xFF059669)),
            Positioned(
              top: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                child: const Icon(Icons.check, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.addAttendance:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.how_to_reg_rounded, size: iconSize, color: const Color(0xFF0D9488)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle),
                child: const Icon(Icons.add, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.timetable:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.calendar_month_rounded, size: iconSize, color: const Color(0xFF0284C7)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFEA580C), shape: BoxShape.circle),
                child: const Icon(Icons.schedule_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.exams:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.quiz_rounded, size: iconSize, color: const Color(0xFFDC2626)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFFBBF24), shape: BoxShape.circle),
                child: const Icon(Icons.edit_rounded, size: 10, color: Color(0xFF78350F)),
              ),
            ),
          ],
        );

      case CartoonIconType.results:
      case CartoonIconType.sslc:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.emoji_events_rounded, size: iconSize, color: const Color(0xFFD97706)),
            Positioned(
              top: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFF10B981), shape: BoxShape.circle),
                child: const Icon(Icons.star_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.fees:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.receipt_long_rounded, size: iconSize, color: const Color(0xFF7C3AED)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle),
                child: const Icon(Icons.currency_rupee_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.events:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.celebration_rounded, size: iconSize, color: const Color(0xFFE11D48)),
            Positioned(
              top: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFFBBF24), shape: BoxShape.circle),
                child: const Icon(Icons.flag_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.calendar:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.beach_access_rounded, size: iconSize, color: const Color(0xFFEA580C)),
            Positioned(
              bottom: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFF0284C7), shape: BoxShape.circle),
                child: const Icon(Icons.wb_sunny_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.classes:
        return Icon(Icons.holiday_village_rounded, size: iconSize, color: const Color(0xFF16A34A));

      case CartoonIconType.subjects:
        return Icon(Icons.auto_stories_rounded, size: iconSize, color: const Color(0xFF0284C7));

      case CartoonIconType.duties:
        return Icon(Icons.badge_rounded, size: iconSize, color: const Color(0xFF475569));

      case CartoonIconType.reports:
        return Icon(Icons.insert_chart_rounded, size: iconSize, color: const Color(0xFF059669));

      case CartoonIconType.inbox:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.mark_email_unread_rounded, size: iconSize, color: const Color(0xFFD97706)),
            Positioned(
              top: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(3),
                decoration: const BoxDecoration(color: Color(0xFFEF4444), shape: BoxShape.circle),
                child: const Text('1', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        );

      case CartoonIconType.doubt:
        return Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.psychology_alt_rounded, size: iconSize, color: const Color(0xFF0891B2)),
            Positioned(
              top: 2,
              right: 2,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(color: Color(0xFFF59E0B), shape: BoxShape.circle),
                child: const Icon(Icons.question_mark_rounded, size: 10, color: Colors.white),
              ),
            ),
          ],
        );

      case CartoonIconType.configure:
        return Icon(Icons.tune_rounded, size: iconSize, color: const Color(0xFF475569));

      case CartoonIconType.profile:
        return Icon(Icons.account_box_rounded, size: iconSize, color: const Color(0xFF2563EB));

      case CartoonIconType.elearning:
        return Icon(Icons.laptop_chromebook_rounded, size: iconSize, color: const Color(0xFF7C3AED));
    }
  }
}
