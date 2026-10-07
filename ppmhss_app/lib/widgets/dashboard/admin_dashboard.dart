// lib/widgets/dashboard/admin_dashboard.dart
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

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
    _setupSocket();
  }

  Future<void> _load() async {
    final store = StoreProvider.of<AppState>(context, listen: false);
    await store.dispatch(fetchAdminDashboardThunk());
  }

  void _setupSocket() {
    SocketService().addListener('dashboard:updated', (data) {
      if (mounted) _load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _AdminVM>(
      converter: (s) => _AdminVM(
        data: s.state.dashboard.adminData,
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
        final adminData = vm.data;
        final adminName = user?.name.isNotEmpty == true ? user!.name : 'Administrator';

        final totalStudents = adminData?.summary.totalStudents ?? 0;
        final totalStaff = adminData?.summary.totalStaff ?? 0;
        final totalClasses = adminData?.summary.totalClasses ?? 0;

        final List<String> statsBadges = [
          '$totalStudents Students',
          '$totalStaff Staff',
          '$totalClasses Classes',
        ];

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: _load,
            color: const Color(0xFF047857),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 1. Curved Emerald Hero Header (Cartoon Theme)
                  CartoonCurvedHeader(
                    title: 'Hello, $adminName',
                    subtitle: 'EXECUTIVE SCHOOL PORTAL',
                    classBadges: statsBadges,
                    gradientColors: const [Color(0xFF047857), Color(0xFF065F46), Color(0xFF022C22)],
                    leadingAvatar: Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFFBBF24), width: 2.5),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.15),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text('👨‍💼', style: TextStyle(fontSize: 28)),
                      ),
                    ),
                    showSearchBar: true,
                    searchPlaceholder: 'Search student by name, admission no...',
                    onSearchTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const GlobalStudentSearchScreen()),
                      );
                    },
                    onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
                  ),

                  const SizedBox(height: 8),

                  // 2. Section Header: "School Management & Academics"
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('🏫', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'Academics & Operations',
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
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFA7F3D0)),
                          ),
                          child: const Text(
                            'ADMIN SUITE',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF047857)),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // 3. 3-Column Cartoonish Card Grid
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
                        // Card 1: Students
                        CartoonGridCard(
                          title: 'Students',
                          iconType: CartoonIconType.students,
                          badgeText: '$totalStudents',
                          badgeColor: const Color(0xFF2563EB),
                          onTap: () => Navigator.pushNamed(context, '/students'),
                        ),

                        // Card 2: Staff
                        CartoonGridCard(
                          title: 'Staff & Faculty',
                          iconType: CartoonIconType.teachers,
                          badgeText: '$totalStaff',
                          badgeColor: const Color(0xFFEC4899),
                          onTap: () => Navigator.pushNamed(context, '/staff'),
                        ),

                        // Card 3: Attendance
                        CartoonGridCard(
                          title: 'Attendance',
                          iconType: CartoonIconType.attendance,
                          badgeText: 'LIVE',
                          badgeColor: const Color(0xFF059669),
                          onTap: () => Navigator.pushNamed(context, '/attendance'),
                        ),

                        // Card 4: Kerala SSLC Results
                        CartoonGridCard(
                          title: 'Kerala SSLC',
                          iconType: CartoonIconType.sslc,
                          badgeText: '★ 10 A+',
                          badgeColor: const Color(0xFF047857),
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),

                        // Card 5: Fees & Billing
                        CartoonGridCard(
                          title: 'Fees & Billing',
                          iconType: CartoonIconType.fees,
                          badgeText: 'ACCOUNTS',
                          badgeColor: const Color(0xFF7C3AED),
                          onTap: () => Navigator.pushNamed(context, '/fees'),
                        ),

                        // Card 6: Time Table
                        CartoonGridCard(
                          title: 'Time Table',
                          iconType: CartoonIconType.timetable,
                          onTap: () => Navigator.pushNamed(context, '/timetable'),
                        ),

                        // Card 7: School Calendar
                        CartoonGridCard(
                          title: 'Calendar & Holidays',
                          iconType: CartoonIconType.calendar,
                          badgeText: 'HOLIDAYS',
                          badgeColor: const Color(0xFFEA580C),
                          onTap: () => Navigator.pushNamed(context, '/calendar'),
                        ),

                        // Card 8: Events & Fests
                        CartoonGridCard(
                          title: 'Events & Fests',
                          iconType: CartoonIconType.events,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),

                        // Card 9: Exams & Schedule
                        CartoonGridCard(
                          title: 'Exams',
                          iconType: CartoonIconType.exams,
                          onTap: () => Navigator.pushNamed(context, '/exams'),
                        ),

                        // Card 10: Marks Entry
                        CartoonGridCard(
                          title: 'Marks Entry',
                          iconType: CartoonIconType.results,
                          onTap: () => Navigator.pushNamed(context, '/marks/entry'),
                        ),

                        // Card 11: Classes
                        CartoonGridCard(
                          title: 'Classes',
                          iconType: CartoonIconType.classes,
                          onTap: () => Navigator.pushNamed(context, '/classes'),
                        ),

                        // Card 12: Subjects
                        CartoonGridCard(
                          title: 'Subjects',
                          iconType: CartoonIconType.subjects,
                          onTap: () => Navigator.pushNamed(context, '/subjects'),
                        ),

                        // Card 13: Staff Duties
                        CartoonGridCard(
                          title: 'Duties',
                          iconType: CartoonIconType.duties,
                          onTap: () => Navigator.pushNamed(context, '/duties'),
                        ),

                        // Card 14: Analytics & Reports
                        CartoonGridCard(
                          title: 'Reports & Stats',
                          iconType: CartoonIconType.reports,
                          onTap: () => Navigator.pushNamed(context, '/reports'),
                        ),

                        // Card 15: Configure & Settings
                        CartoonGridCard(
                          title: 'Configure',
                          iconType: CartoonIconType.configure,
                          onTap: () => Navigator.pushNamed(context, '/settings'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 4. Executive Portals & Carousel
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('🌟', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'Executive Portals',
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

                  // Carousel Banners
                  SizedBox(
                    height: 140,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: [
                        _buildCarouselBanner(
                          title: 'Kerala SSLC 2026 Portal',
                          subtitle: 'Bulk Import, Analytics & Honors Board',
                          tag: 'OFFICIAL',
                          gradient: const [Color(0xFF047857), Color(0xFF064E3B)],
                          icon: Icons.workspace_premium_rounded,
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'Annual Sports & Arts Fest',
                          subtitle: 'Manage Leaderboard, Teams & Results',
                          tag: 'FEST 2026',
                          gradient: const [Color(0xFFDC2626), Color(0xFFB91C1C)],
                          icon: Icons.emoji_events_rounded,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'School Calendar & Holidays',
                          subtitle: 'Configure Official Kerala School Schedule',
                          tag: 'CALENDAR',
                          gradient: const [Color(0xFF0284C7), Color(0xFF0369A1)],
                          icon: Icons.beach_access_rounded,
                          onTap: () => Navigator.pushNamed(context, '/calendar'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 50),
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

class _AdminVM {
  final AdminDashboardData? data;
  final UserModel? user;
  final bool isLoading;
  final String? error;

  _AdminVM({
    this.data,
    this.user,
    required this.isLoading,
    this.error,
  });
}
