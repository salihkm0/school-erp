// lib/widgets/dashboard/parent_dashboard.dart
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:school_management/store/app_state.dart';
import 'package:school_management/actions/dashboard_actions.dart';
import 'package:school_management/models/dashboard_model.dart';
import 'package:school_management/models/user_model.dart';
import 'package:school_management/widgets/common/loading_widget.dart';
import 'package:school_management/widgets/common/error_widget.dart';
import 'package:school_management/widgets/common/cartoon_curved_header.dart';
import 'package:school_management/widgets/common/cartoon_grid_card.dart';
import 'package:school_management/widgets/common/cartoon_icon_badge.dart';

class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});

  @override
  State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  int _selectedChildIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final store = StoreProvider.of<AppState>(context, listen: false);
    await store.dispatch(fetchParentDashboardThunk());
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ParentVM>(
      converter: (s) => _ParentVM(
        data: s.state.dashboard.parentData,
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
        final parentData = vm.data;
        final children = parentData?.children ?? [];
        final parentName = user?.name.isNotEmpty == true ? user!.name : 'Parent';

        final StudentChild? activeChild = (children.isNotEmpty && _selectedChildIndex < children.length)
            ? children[_selectedChildIndex]
            : null;

        final List<String> childBadges = children.map((c) => '${c.fullName.split(' ').first} (${c.className})').toList();

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            onRefresh: _load,
            color: const Color(0xFF6366F1),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 1. Curved Indigo/Purple Hero Header (Like Image 3)
                  CartoonCurvedHeader(
                    title: 'Hello, $parentName',
                    subtitle: activeChild != null ? 'STUDENT: ${activeChild.fullName.toUpperCase()}' : 'PARENT PORTAL',
                    classBadges: childBadges,
                    gradientColors: const [Color(0xFF6366F1), Color(0xFF4F46E5), Color(0xFF3730A3)],
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
                        child: Text('👨‍👩‍👧', style: TextStyle(fontSize: 28)),
                      ),
                    ),
                    showSearchBar: true,
                    searchPlaceholder: 'Search attendance, exams, fees...',
                    onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
                  ),

                  // 2. Child Selector Carousel if multiple children
                  if (children.length > 1) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      child: SizedBox(
                        height: 42,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: children.length,
                          itemBuilder: (context, idx) {
                            final c = children[idx];
                            final isSelected = idx == _selectedChildIndex;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(
                                  '${c.fullName} • ${c.className}',
                                  style: TextStyle(
                                    fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                                    fontSize: 12,
                                    color: isSelected ? Colors.white : const Color(0xFF334155),
                                  ),
                                ),
                                selected: isSelected,
                                selectedColor: const Color(0xFF4F46E5),
                                backgroundColor: Colors.white,
                                side: BorderSide(
                                  color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE2E8F0),
                                ),
                                onSelected: (sel) {
                                  if (sel) setState(() => _selectedChildIndex = idx);
                                },
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ],

                  const SizedBox(height: 8),

                  // 3. Section: "Academics" (Like Image 3)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('📚', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'Academics',
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
                          child: Text(
                            activeChild != null ? 'ROLL #${activeChild.rollNumber}' : 'ACTIVE',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF047857)),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // 4. 3-Column Cartoon Grid (Like Image 3)
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
                        // Card 1: Attendance
                        CartoonGridCard(
                          title: 'Attendance',
                          iconType: CartoonIconType.attendance,
                          badgeText: activeChild != null ? '${activeChild.attendancePercentage}%' : null,
                          badgeColor: const Color(0xFF059669),
                          onTap: () {
                            if (activeChild != null) {
                              Navigator.pushNamed(
                                context,
                                '/my-child-attendance',
                                arguments: {'studentId': activeChild.id, 'studentName': activeChild.fullName},
                              );
                            } else {
                              Navigator.pushNamed(context, '/my-child-attendance');
                            }
                          },
                        ),

                        // Card 2: Exam Results
                        CartoonGridCard(
                          title: 'Results',
                          iconType: CartoonIconType.results,
                          badgeText: activeChild?.performance.grade,
                          badgeColor: const Color(0xFFF59E0B),
                          onTap: () {
                            if (activeChild != null) {
                              Navigator.pushNamed(
                                context,
                                '/my-child-results',
                                arguments: {'studentId': activeChild.id, 'studentName': activeChild.fullName},
                              );
                            } else {
                              Navigator.pushNamed(context, '/my-child-results');
                            }
                          },
                        ),

                        // Card 3: Fee Payments
                        CartoonGridCard(
                          title: 'Fee Details',
                          iconType: CartoonIconType.fees,
                          badgeText: 'ONLINE',
                          badgeColor: const Color(0xFF7C3AED),
                          onTap: () {
                            if (activeChild != null) {
                              Navigator.pushNamed(
                                context,
                                '/my-child-fees',
                                arguments: {'studentId': activeChild.id, 'studentName': activeChild.fullName},
                              );
                            } else {
                              Navigator.pushNamed(context, '/my-child-fees');
                            }
                          },
                        ),

                        // Card 4: Kerala SSLC Results
                        CartoonGridCard(
                          title: 'Kerala SSLC',
                          iconType: CartoonIconType.sslc,
                          badgeText: '★ 10 A+',
                          badgeColor: const Color(0xFF047857),
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),

                        // Card 5: Time Table
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
                          badgeColor: const Color(0xFFEA580C),
                          onTap: () => Navigator.pushNamed(context, '/calendar'),
                        ),

                        // Card 7: Events & Fests
                        CartoonGridCard(
                          title: 'Events & Fests',
                          iconType: CartoonIconType.events,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),

                        // Card 8: Teachers & Staff
                        CartoonGridCard(
                          title: 'Teachers',
                          iconType: CartoonIconType.teachers,
                          onTap: () => Navigator.pushNamed(context, '/staff'),
                        ),

                        // Card 9: Notifications / Inbox
                        CartoonGridCard(
                          title: 'Inbox / Alerts',
                          iconType: CartoonIconType.inbox,
                          onTap: () => Navigator.pushNamed(context, '/notifications'),
                        ),

                        // Card 10: My Children List
                        CartoonGridCard(
                          title: 'My Children',
                          iconType: CartoonIconType.students,
                          onTap: () => Navigator.pushNamed(context, '/my-children'),
                        ),

                        // Card 11: Ask Doubt / Support
                        CartoonGridCard(
                          title: 'Ask Doubt',
                          iconType: CartoonIconType.doubt,
                          onTap: () => Navigator.pushNamed(context, '/support'),
                        ),

                        // Card 12: Profile & Settings
                        CartoonGridCard(
                          title: 'My Profile',
                          iconType: CartoonIconType.profile,
                          onTap: () => Navigator.pushNamed(context, '/profile'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 5. Section: E-Learning & Spotlight Highlights (Like Image 3)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('🚀', style: TextStyle(fontSize: 18)),
                            SizedBox(width: 8),
                            Text(
                              'E-Learning & Activities',
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
                          child: const Text('View Board', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
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
                          subtitle: 'Verify Digital Marksheet & Honors',
                          tag: 'SSLC',
                          gradient: const [Color(0xFF047857), Color(0xFF064E3B)],
                          icon: Icons.workspace_premium_rounded,
                          onTap: () => Navigator.pushNamed(context, '/sslc'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'Live Sports & Arts Fest',
                          subtitle: 'Track House Points & Event Schedule',
                          tag: 'FEST 2026',
                          gradient: const [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                          icon: Icons.emoji_events_rounded,
                          onTap: () => Navigator.pushNamed(context, '/events'),
                        ),
                        const SizedBox(width: 12),
                        _buildCarouselBanner(
                          title: 'School Holidays & Calendar',
                          subtitle: 'Upcoming Festivals & Vacation Dates',
                          tag: 'HOLIDAYS',
                          gradient: const [Color(0xFFEA580C), Color(0xFFC2410C)],
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

class _ParentVM {
  final ParentDashboardData? data;
  final UserModel? user;
  final bool isLoading;
  final String? error;

  _ParentVM({
    this.data,
    this.user,
    required this.isLoading,
    this.error,
  });
}