// lib/widgets/common/cartoon_curved_header.dart
import 'package:flutter/material.dart';

class WaveClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final path = Path();
    path.lineTo(0, size.height - 28);

    final firstControlPoint = Offset(size.width * 0.25, size.height + 4);
    final firstEndPoint = Offset(size.width * 0.55, size.height - 14);
    path.quadraticBezierTo(
      firstControlPoint.dx,
      firstControlPoint.dy,
      firstEndPoint.dx,
      firstEndPoint.dy,
    );

    final secondControlPoint = Offset(size.width * 0.85, size.height - 32);
    final secondEndPoint = Offset(size.width, size.height - 6);
    path.quadraticBezierTo(
      secondControlPoint.dx,
      secondControlPoint.dy,
      secondEndPoint.dx,
      secondEndPoint.dy,
    );

    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

class CartoonCurvedHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  final List<String> classBadges;
  final List<Color> gradientColors;
  final VoidCallback? onSearchTap;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onMenuTap;
  final bool showSearchBar;
  final String searchPlaceholder;
  final Widget? leadingAvatar;

  const CartoonCurvedHeader({
    super.key,
    required this.title,
    this.subtitle = '',
    this.classBadges = const [],
    this.gradientColors = const [Color(0xFFDC2626), Color(0xFFB91C1C)], // Red gradient like reference
    this.onSearchTap,
    this.onNotificationTap,
    this.onMenuTap,
    this.showSearchBar = false,
    this.searchPlaceholder = 'Search students, classes, exams...',
    this.leadingAvatar,
  });

  @override
  Widget build(BuildContext context) {
    return ClipPath(
      clipper: WaveClipper(),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: gradientColors.last.withValues(alpha: 0.3),
              blurRadius: 16,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 44),
        child: SafeArea(
          bottom: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Menu & Notification Bell
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (onMenuTap != null)
                    IconButton(
                      icon: const Icon(Icons.menu_rounded, color: Colors.white, size: 26),
                      onPressed: onMenuTap,
                      tooltip: 'Open Menu',
                    )
                  else
                    const SizedBox(width: 40),
                  
                  // School Tag Pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                    ),
                    child: const Text(
                      'PPMHSS KONDOTTY',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),

                  if (onNotificationTap != null)
                    Stack(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 26),
                          onPressed: onNotificationTap,
                        ),
                        Positioned(
                          top: 10,
                          right: 10,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFFFBBF24),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    )
                  else
                    const SizedBox(width: 40),
                ],
              ),

              const SizedBox(height: 8),

              // Hero User Avatar + Name + Class Pills (Like Image 2)
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Illustrated Teacher/Student Avatar
                  leadingAvatar ??
                      Container(
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
                          child: Text(
                            '👩‍🏫',
                            style: TextStyle(fontSize: 30),
                          ),
                        ),
                      ),

                  const SizedBox(width: 14),

                  // User Info & Badges
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (subtitle.isNotEmpty)
                          Text(
                            subtitle,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.85),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        Text(
                          title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.3,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),

                        // Class Pills Grid (Like 9 A, 8 A, 5 5A in reference)
                        if (classBadges.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 6,
                            runSpacing: 4,
                            children: classBadges.map((c) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.18),
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: Colors.white.withValues(alpha: 0.6), width: 1.2),
                                ),
                                child: Text(
                                  c,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 0.4,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),

              // Search Bar (Like Image 3)
              if (showSearchBar) ...[
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: onSearchTap,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search_rounded, color: Color(0xFF94A3B8), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            searchPlaceholder,
                            style: const TextStyle(
                              color: Color(0xFF94A3B8),
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
