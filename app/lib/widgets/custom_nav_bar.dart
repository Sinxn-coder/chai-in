import 'package:flutter/material.dart';
import '../add_spot.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  void _navigateToAddSpot(BuildContext context) {
    Navigator.of(
      context,
    ).push(_RippleTransition(builder: (context) => const AddSpotPage()));
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return SizedBox(
      width: size.width,
      height: 95, // Slightly decreased height
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            bottom: 0,
            left: 0,
            child: CustomPaint(
              size: Size(size.width, 75), // Slightly decreased height
              painter: BNBCustomPainter(),
            ),
          ),
          Positioned(
            top: 0, // Floating slightly above
            left: size.width / 2 - 30,
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(
                      alpha: 0.4,
                    ), // Increased opacity
                    blurRadius: 15, // Increased blur
                    spreadRadius: 3, // Increased spread
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Material(
                color: const Color(0xFFFF0000), // Match Login button
                shape: const CircleBorder(),
                elevation: 0, // Using Container shadow instead
                child: InkWell(
                  onTap: () {
                    _navigateToAddSpot(context);
                  },
                  customBorder: const CircleBorder(),
                  child: SizedBox(
                    width: 60,
                    height: 60,
                    child: Center(
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Vertical bar
                          Container(
                            width: 5,
                            height: 28,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                          // Horizontal bar
                          Container(
                            width: 28,
                            height: 5,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 10,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_outlined, 'Home'),
                _buildNavItem(1, Icons.explore_outlined, 'Explore'),
                const SizedBox(width: 60), // Space for floating button
                _buildNavItem(2, Icons.bookmark_border, 'Favorites'),
                _buildNavItem(3, Icons.groups_outlined, 'Community'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final bool isActive = currentIndex == index;
    final IconData activeIcon = _getActiveIcon(index);
    final IconData displayIcon = isActive ? activeIcon : icon;

    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 65,
        height: 50,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(displayIcon, color: Colors.white, size: 26),
            const SizedBox(height: 4),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: isActive ? 5 : 0,
              height: isActive ? 5 : 0,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getActiveIcon(int index) {
    switch (index) {
      case 0:
        return Icons.home;
      case 1:
        return Icons.explore;
      case 2:
        return Icons.bookmark;
      case 3:
        return Icons.groups;
      default:
        return Icons.home;
    }
  }
}

class BNBCustomPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color =
          const Color(0xFFFF0000) // Match Login button
      ..style = PaintingStyle.fill;

    Path path = Path();
    // Translation of the web SVG path
    // ViewBox was 400x120. Scale accordingly.
    double sw = size.width / 400;

    path.moveTo(0, 0); // Start at top left corner (sharp)
    path.lineTo(130 * sw, 0); // Notch starts slightly earlier

    // The Notch - deeper and wider for better spacing
    path.cubicTo(150 * sw, 0, 160 * sw, 12 * sw, 170 * sw, 28 * sw);
    path.cubicTo(180 * sw, 52 * sw, 220 * sw, 52 * sw, 230 * sw, 28 * sw);
    path.cubicTo(240 * sw, 12 * sw, 250 * sw, 0, 270 * sw, 0);

    path.lineTo(size.width, 0); // Line to top right corner (sharp)
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawShadow(
      path,
      Colors.black.withValues(alpha: 0.3), // Darker shadow
      8,
      true,
    );
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

class _RippleTransition extends PageRouteBuilder {
  final Widget Function(BuildContext) builder;

  _RippleTransition({required this.builder})
    : super(
        pageBuilder: (context, animation, secondaryAnimation) =>
            builder(context),
        transitionDuration: const Duration(milliseconds: 400),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return _RippleTransitionAnimation(animation: animation, child: child);
        },
      );
}

class _RippleTransitionAnimation extends StatelessWidget {
  final Animation<double> animation;
  final Widget child;

  const _RippleTransitionAnimation({
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        final progress = animation.value;

        return Stack(
          children: [
            // Red circle that expands to cover full screen
            if (progress <= 0.8)
              Positioned.fill(
                child: CustomPaint(
                  painter: _RipplePainter(
                    progress:
                        progress / 0.8, // Normalize to 0-1 for full coverage
                    center: Offset(
                      MediaQuery.of(context).size.width / 2,
                      MediaQuery.of(context).size.height - 100,
                    ),
                  ),
                ),
              ),
            // Page content that appears after circle covers screen
            if (progress > 0.8)
              Opacity(
                opacity: (progress - 0.8) / 0.2, // Fade in from 0 to 1
                child: child,
              ),
          ],
        );
      },
    );
  }
}

class _RipplePainter extends CustomPainter {
  final double progress;
  final Offset center;

  _RipplePainter({required this.progress, required this.center});

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0 || progress >= 1.0) return;

    final paint = Paint()
      ..color = const Color(0xFFFF0000)
      ..style = PaintingStyle.fill;

    // Calculate ripple radius based on progress
    final maxRadius = (size.width * 1.5)
        .toDouble(); // Ensure it covers entire screen
    final currentRadius = maxRadius * progress;

    // Draw single expanding circle with pure red color
    canvas.drawCircle(center, currentRadius, paint);
  }

  @override
  bool shouldRepaint(_RipplePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
