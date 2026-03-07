import 'package:flutter/material.dart';
import 'dart:math' as math;

class FoodLoading extends StatefulWidget {
  final double size;
  const FoodLoading({super.key, this.size = 80});

  @override
  State<FoodLoading> createState() => _FoodLoadingState();
}

class _FoodLoadingState extends State<FoodLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _outerRotation;
  late Animation<double> _innerRotation;
  late Animation<double> _pulseScale;
  late Animation<double> _iconOpacity;

  int _iconIndex = 0;
  final List<IconData> _loadingIcons = [
    Icons.local_pizza_rounded,
    Icons.lunch_dining_rounded,
    Icons.icecream_rounded,
    Icons.coffee_rounded,
    Icons.restaurant_rounded,
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat();

    // Smooth clockwise rotation for outer ring
    _outerRotation = Tween<double>(begin: 0, end: 2 * math.pi).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 1.0, curve: Curves.linear),
      ),
    );

    // Faster counter-clockwise rotation for inner ring
    _innerRotation = Tween<double>(begin: 2 * math.pi, end: 0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 1.0, curve: Curves.easeInOutSine),
      ),
    );

    // Heartbeat pulse effect
    _pulseScale = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(
          begin: 1.0,
          end: 1.1,
        ).chain(CurveTween(curve: Curves.easeOut)),
        weight: 20,
      ),
      TweenSequenceItem(
        tween: Tween(
          begin: 1.1,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.easeIn)),
        weight: 20,
      ),
      TweenSequenceItem(tween: ConstantTween<double>(1.0), weight: 60),
    ]).animate(_controller);

    // Icon fade in/out sync
    _iconOpacity = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(
          begin: 1.0,
          end: 0.0,
        ).chain(CurveTween(curve: Curves.easeIn)),
        weight: 10,
      ),
      TweenSequenceItem(tween: ConstantTween<double>(0.0), weight: 10),
      TweenSequenceItem(
        tween: Tween(
          begin: 0.0,
          end: 1.0,
        ).chain(CurveTween(curve: Curves.easeOut)),
        weight: 10,
      ),
      TweenSequenceItem(tween: ConstantTween<double>(1.0), weight: 70),
    ]).animate(_controller);

    _controller.addListener(() {
      // Cycle icons at a specific point in the animation
      if (_controller.value > 0.15 && _controller.value < 0.2) {
        final newIndex =
            (DateTime.now().millisecondsSinceEpoch ~/ 2000) %
            _loadingIcons.length;
        if (newIndex != _iconIndex) {
          setState(() {
            _iconIndex = newIndex;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _pulseScale.value,
            child: SizedBox(
              width: widget.size * 1.5,
              height: widget.size * 1.5,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Outer Elegant Ring
                  Transform.rotate(
                    angle: _outerRotation.value,
                    child: Container(
                      width: widget.size,
                      height: widget.size,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFFFF0000).withOpacity(0.1),
                          width: 2,
                        ),
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            top: -2,
                            left: widget.size / 2 - 4,
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Color(0xFFFF0000),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0xFFFF0000),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Inner Dynamic Ring
                  Transform.rotate(
                    angle: _innerRotation.value,
                    child: SizedBox(
                      width: widget.size * 0.7,
                      height: widget.size * 0.7,
                      child: CircularProgressIndicator(
                        value: 0.3,
                        strokeWidth: 3,
                        backgroundColor: Colors.transparent,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          const Color(0xFFFF0000).withOpacity(0.4),
                        ),
                        strokeCap: StrokeCap.round,
                      ),
                    ),
                  ),

                  // Central Pulsing Icon
                  Opacity(
                    opacity: _iconOpacity.value,
                    child: Container(
                      width: widget.size * 0.5,
                      height: widget.size * 0.5,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 15,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: Icon(
                        _loadingIcons[_iconIndex],
                        size: widget.size * 0.3,
                        color: const Color(0xFFFF0000),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class FoodLoadingScreen extends StatelessWidget {
  const FoodLoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FoodLoading(size: 80),
            SizedBox(height: 32),
            Text(
              'Preparing Perfection...',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1A1A1A),
                letterSpacing: 1.2,
                fontFamily: 'MPLUSRounded1c',
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Finding the best spots for you',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Color(0xFF6B7280),
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
