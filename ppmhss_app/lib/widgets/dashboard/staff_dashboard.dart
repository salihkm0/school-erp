// lib/widgets/dashboard/staff_dashboard.dart
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:school_management/store/app_state.dart';
import 'package:school_management/actions/dashboard_actions.dart';
import 'package:school_management/models/dashboard_model.dart';
import 'package:school_management/models/user_model.dart';
import 'package:school_management/widgets/common/loading_widget.dart';
import 'package:school_management/widgets/common/error_widget.dart';
import 'package:school_management/services/socket_service.dart';
import 'package:school_management/screens/students/global_student_search_screen.dart';
import 'package:school_management/widgets/common/cartoon_curved_header.dart';
import 'package:school_management/widgets/common/cartoon_grid_card.dart';
import 'package:school_management/widgets/common/cartoon_icon_badge.dart';

class StaffDashboard extends StatefulWidget {
  final void Function(int)? onSwitchTab;
  const StaffDashboard({super.key, this.onSwitchTab});

  @override
  State<StaffDashboard> createState() => _StaffDashboardState();
}

class _StaffDashboardState extends State<StaffDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
    _setupSocket();
  }

  Future<void> _load() async {
    final store = StoreProvider.of<AppState>(context, listen: false);
    await store.dispatch(fetchStaffDashboardThunk());
  }

  void _setupSocket() {
    SocketService().addListener('dashboard:updated', (data) {
      if (mounted) _load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _StaffVM>(
      converter: (s) => _StaffVM(
        data: s.state.dashboard.staffData,
        user: s.state.auth.user,
        isLoading: s.state.dashboard.isLoading,
        error: s.state.dashboard.error,
      ),
      builder: (context, vm) {
        if (vm.isLoading && vm.data == null) {
          return const Center(child: LoadingWidget());
        }
        if (vm.error != null && vm.data == null) {
          return Center(child: CustomErrorWidget(message: vm.error!, onRetry: _load));
        }

        final user = vm.user;
        final staffData = vm.data;
        final teacherName = user?.name.isNotEmpty == true ? user!.name : 'Teacher';

        // Extract class names for top pill chips
        final List<String> classBadges = [];
        if (staffData?.classTeacherInfo != null) {
          for (final tc in staffData!.classTeacherInfo!.classes) {
            if (tc.name.isNotEmpty && !classBadges.contains(tc.name)) {
              classBadges.add(tc.name.replaceAll('Class ', '').replaceAll('Standard ', ''));
            }
          }
        }
        if (staffData?.subjectClasses != null) {
          for (final sc in staffData!.subjectClasses!) {
            final cleaned = sc.name.replaceAll('Class ', '').replaceAll('Standard ', '');
            if (cleaned.isNotEmpty && !classBadges.contains(cleaned)) {
              classBadges.add(cleaned);
            }
          }
        }
        if (classBadges.isEmpty) {
          classBadges.addAll(['9 A', '8 A', '10 A']);
        }

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: _load,
            color: const Color(0xFFDC2626),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 1. Curved Red Hero Header (Like Image 2 & 3)
                  CartoonCurvedHeader(
                    title: teacherName,
                    subtitle: 'FACULTY & CLASS TEACHER',
                    classBadges: classBadges,
                    gradientColors: const [Color(0xFFE11D48), Color(0xFFBE123C), Color(0xFF9F1239)],
                    showSearchBar: true,
                    searchPlaceholder: 'Search student, register no, class...',
                    onSearchTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const GlobalStudentSearchScreen()),
                      );
                    },
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                  ),

                  const SizedBox(height: 8),

                  // 2. Section Header: "Academics & Operations"
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('🎒', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'Academics & Work',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                                letterSpacing: -0.4,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: const Text(
                            'TERM 2026',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF1D4ED8)),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // 3. 3-Column Cartoonish Card Grid (Like Image 2 & 3)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 3,
                      mainAxisSpacing: 14,
                      crossAxisSpacing: 14,
                      childAspectRatio: 0.88,
                      children: [
                        // Card 1: Attendance List
                        CartoonGridCard(
                          title: 'Attendance List',
                          iconType: CartoonIconType.attendance,
                          onTap: () => Navigator.pushNamed(context, '/staff/attendance'),
                        ),

                        // Card 2: Add Attendance
                        CartoonGridCard(
                          title: 'Add Attendance',
                          iconType: CartoonIconType.addAttendance,
                          badgeText: 'DAILY',
                          badgeColor: const Color(0xFF10B981),
                          onTap: () => Navigator.pushNamed(context, '/staff/attendance'),
                        ),

                        // Card 3: Profile
                        CartoonGridCard(
                          title: 'My Profile',
                          iconType: CartoonIconType.profile,
                          onTap: () => Navigator.pushNamed(context, '/profile'),
                        ),

                        // Card 4: Students List
                        CartoonGridCard(
                          title: 'Students List',
                          iconType: CartoonIconType.students,
                          onTap: () => Navigator.pushNamed(context, '/staff/my-classes'),
                        ),

                        // Card 5: Timetable
                        CartoonGridCard(
                          title: 'Time Table',
                          iconType: CartoonIconType.timetable,
                          onTap: () => Navigator.pushNamed(context, '/timetable'),
                        ),

                        // Card 6: School Calendar
                        CartoonGridCard(
                          title: 'Calendar & Holidays',
                          iconType: CartoonIconType.calendar,
                          badgeText: 'HOLIDAYS',
                          badgeColor: const Color(0xFFF59E0B),
                          onTap: () => Navigator.pushNamed(context, '/calendar'),
                        ),

                        // Card 7: Exams
                        CartoonGridCard(
                          title: 'Exams & Schedule',
                          iconType: CartoonIconType.exams,
                          onTap: () => Navigator.pushNamed(context, '/staff/exams'),
                        ),

                        // Card 8: Mark Entry
                        CartoonGridCard(
                          title: 'Marks Entry',
                          iconType: CartoonIconType.results,
                          onTap: () => Navigator.pushNamed(context, '/marks/entry'),
                        ),

                        // Card 9: Kerala SSLC Results
                        CartoonGridCard(
                          title: 'Kerala SSLC',
                          iconType: CartoonIconType.sslc,
                          badgeText: '★ 10 A+',
                          badgeColor: const Color(0xFF047857),
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),

                        // Card 10: Reports & Analytics
                        CartoonGridCard(
                          title: 'Analytics Reports',
                          iconType: CartoonIconType.reports,
                          onTap: () => Navigator.pushNamed(context, '/reports'),
                        ),

                        // Card 11: Duties
                        CartoonGridCard(
                          title: 'Staff Duties',
                          iconType: CartoonIconType.duties,
                          onTap: () => Navigator.pushNamed(context, '/staff/my-duties'),
                        ),

                        // Card 12: Events & Fests
                        CartoonGridCard(
                          title: 'Events & Fests',
                          iconType: CartoonIconType.events,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 4. Section: E-Learning & Spotlight Highlights (Like Image 3)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('✨', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'E-Learning & Highlights',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                                letterSpacing: -0.4,
                              ),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/sslc'),
                          child: const Text('View All', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Horizontal Carousel Banner
                  SizedBox(
                    height: 140,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: [
                        _buildCarouselBanner(
                          title: 'Kerala SSLC 2026 Board',
                          subtitle: 'Live Grade Sheet & Wall of Fame',
                          tag: 'TOPPERS',
                          gradient: const [Color(0xFF065F46), Color(0xFF047857)],
                          icon: Icons.workspace_premium_rounded,
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'Sports & Arts Fest 2026',
                          subtitle: 'Live House Leaderboard & Points',
                          tag: 'FEST',
                          gradient: const [Color(0xFF7C3AED), Color(0xFF6D28D9)],
                          icon: Icons.emoji_events_rounded,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'School Calendar & Events',
                          subtitle: 'Official Holidays & Academic Schedule',
                          tag: 'CALENDAR',
                          gradient: const [Color(0xFF0284C7), Color(0xFF0369A1)],
                          icon: Icons.beach_access_rounded,
                          onTap: () => Navigator.pushNamed(context, '/calendar'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 90),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildCarouselBanner({
    required String title,
    required String subtitle,
    required String tag,
    required List<Color> gradient,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 260,
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: gradient, begin: Alignment.topLeft, end: Alignment.bottomRight),
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: gradient.last.withValues(alpha: 0.25),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    tag,
                    style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
                  ),
                ),
                Icon(icon, color: const Color(0xFFFBBF24), size: 24),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 11, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StaffVM {
  final StaffDashboardData? data;
  final UserModel? user;
  final bool isLoading;
  final String? error;

  _StaffVM({
    this.data,
    this.user,
    required this.isLoading,
    this.error,
  });
}
