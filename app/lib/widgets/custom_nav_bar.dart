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
    Navigator.of(context).push(_CircularRevealTransition(const AddSpotPage()));
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    final double bottomSystemInset = MediaQuery.of(context).padding.bottom;

    // Heuristic: If the bottom inset is > 35, it's highly likely 3-button software navigation.
    // If it's < 35, it's likely gesture navigation and we want the nav bar to sit tighter.
    final bool isThreeButtonNav = bottomSystemInset > 35;

    // For 3-button navigation, add the full inset so it sits completely ABOVE the buttons.
    // For gesture navigation, only add a fraction of it so it sits near the bottom.
    final double effectiveBottomPadding = isThreeButtonNav
        ? bottomSystemInset
        : (bottomSystemInset > 0 ? bottomSystemInset * 0.4 : 0);

    // Total height reduced from 75 to 65 base.
    final double navHeight = 65 + effectiveBottomPadding;
    final double stackHeight =
        25 + navHeight; // 25 for the floating button overshoot

    return SizedBox(
      width: size.width,
      height: stackHeight,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            bottom: 0,
            left: 0,
            child: CustomPaint(
              size: Size(size.width, navHeight),
              painter: BNBCustomPainter(bottomPadding: effectiveBottomPadding),
            ),
          ),
          Positioned(
            top: 5, // Floating slightly above
            left: size.width / 2 - 30,
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4), // Increased opacity
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
            bottom: isThreeButtonNav
                ? bottomSystemInset + 5
                : effectiveBottomPadding + 4,
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
        return Icons.home_rounded;
      case 1:
        return Icons.explore_rounded;
      case 2:
        return Icons.bookmark_rounded;
      case 3:
        return Icons.groups_rounded;
      default:
        return Icons.home_rounded;
    }
  }
}

class BNBCustomPainter extends CustomPainter {
  final double bottomPadding;

  BNBCustomPainter({this.bottomPadding = 0});

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color =
          const Color(0xFFFF0000) // Match Login button
      ..style = PaintingStyle.fill;

    Path path = Path();
    // Translation of the web SVG path
    // ViewBox was 400x120. Scale accordingly.
    double centerX = size.width / 2;

    path.moveTo(0, 0); // Start at top left corner
    path.lineTo(centerX - 70, 0); // Notch starts slightly earlier

    // The Notch - fixed depth (52px) and width (140px)
    path.cubicTo(centerX - 50, 0, centerX - 40, 12, centerX - 30, 28);
    path.cubicTo(centerX - 20, 52, centerX + 20, 52, centerX + 30, 28);
    path.cubicTo(centerX + 40, 12, centerX + 50, 0, centerX + 70, 0);

    path.lineTo(size.width, 0); // Line to top right corner (sharp)
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawShadow(
      path,
      Colors.black.withOpacity(0.3), // Darker shadow
      8,
      true,
    );
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

class _CircularRevealTransition extends PageRouteBuilder {
  final Widget page;

  _CircularRevealTransition(this.page)
    : super(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionDuration: const Duration(milliseconds: 600),
        reverseTransitionDuration: const Duration(milliseconds: 500),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return CircularRevealAnimation(animation: animation, child: child);
        },
      );
}

class CircularRevealAnimation extends StatelessWidget {
  final Animation<double> animation;
  final Widget child;

  const CircularRevealAnimation({
    super.key,
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        final double screenWidth = MediaQuery.of(context).size.width;
        final double screenHeight = MediaQuery.of(context).size.height;

        // Center point for the expansion (middle of FAB)
        final Offset center = Offset(screenWidth / 2, screenHeight - 60);

        return ClipPath(
          clipper: _CircularRevealClipper(
            fraction: animation.value,
            center: center,
          ),
          child: child,
        );
      },
    );
  }
}

class _CircularRevealClipper extends CustomClipper<Path> {
  final double fraction;
  final Offset center;

  _CircularRevealClipper({required this.fraction, required this.center});

  @override
  Path getClip(Size size) {
    final double maxRadius = _calculateMaxRadius(size, center);
    return Path()
      ..addOval(Rect.fromCircle(center: center, radius: maxRadius * fraction));
  }

  double _calculateMaxRadius(Size size, Offset center) {
    final double w = size.width;
    final double h = size.height;

    // Distances to corners
    final double d1 = center.distance;
    final double d2 = (center - Offset(w, 0)).distance;
    final double d3 = (center - Offset(0, h)).distance;
    final double d4 = (center - Offset(w, h)).distance;

    return [d1, d2, d3, d4].reduce((a, b) => a > b ? a : b);
  }

  @override
  bool shouldReclip(_CircularRevealClipper oldClipper) =>
      oldClipper.fraction != fraction || oldClipper.center != center;
}
