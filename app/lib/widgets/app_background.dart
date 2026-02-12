import 'package:flutter/material.dart';
import 'dart:ui';

class AppBackground extends StatefulWidget {
  final Widget child;

  const AppBackground({super.key, required this.child});

  @override
  State<AppBackground> createState() => _AppBackgroundState();
}

class _AppBackgroundState extends State<AppBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Base Background Color
        Container(color: const Color(0xFFF8F8F8)),
        // Animated Blobs
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Stack(
              children: [
                // Top Left Blob
                Positioned(
                  top: -100 + (40 * _controller.value),
                  left: -100 + (30 * _controller.value),
                  child: Transform.scale(
                    scale: 1.0 + (0.15 * _controller.value),
                    child: _Blob(
                      size: 400,
                      color: const Color(0xFFE53935).withValues(alpha: 0.08),
                    ),
                  ),
                ),
                // Bottom Right Blob
                Positioned(
                  bottom: -100 + (60 * (1 - _controller.value)),
                  right: -100 + (40 * (1 - _controller.value)),
                  child: Transform.scale(
                    scale: 1.15 - (0.15 * _controller.value),
                    child: _Blob(
                      size: 350,
                      color: const Color(0xFFE53935).withValues(alpha: 0.05),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
        // Grainy/Blur Overlay if needed for extra premium feel
        // BackdropFilter(
        //   filter: ImageFilter.blur(sigmaX: 50, sigmaY: 50),
        //   child: Container(color: Colors.transparent),
        // ),
        // Main Content
        widget.child,
      ],
    );
  }
}

class _Blob extends StatelessWidget {
  final double size;
  final Color color;

  const _Blob({required this.size, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [color, color.withValues(alpha: 0)],
          stops: const [0.0, 0.7],
        ),
      ),
      child: BackdropFilter(
        // This provides the extra soft blur used in the web's filter: blur(100px)
        filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
        child: Container(color: Colors.transparent),
      ),
    );
  }
}
