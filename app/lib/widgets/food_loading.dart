import 'package:flutter/material.dart';
import 'dart:math' as math;

class FoodLoading extends StatefulWidget {
  final double size;
  const FoodLoading({super.key, this.size = 100});

  @override
  State<FoodLoading> createState() => _FoodLoadingState();
}

class _FoodLoadingState extends State<FoodLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  
  // Animation phases
  late Animation<double> _rotation;
  late Animation<double> _bite1;
  late Animation<double> _bite2;
  late Animation<double> _bite3;
  late Animation<double> _reset;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat();

    // Rotation Animation: Slight clockwise, then counter, then full spin
    _rotation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 0.4).chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 20, // 0.0 -> 0.6s
      ),
      TweenSequenceItem(
        tween: Tween(begin: 0.4, end: -0.4).chain(CurveTween(curve: Curves.easeInOut)),
        weight: 20, // 0.6s -> 1.2s
      ),
      TweenSequenceItem(
        tween: Tween(begin: -0.4, end: 0.2).chain(CurveTween(curve: Curves.easeInOut)),
        weight: 20, // 1.2s -> 1.8s
      ),
      TweenSequenceItem(
        tween: Tween(begin: 0.2, end: 2 * math.pi).chain(CurveTween(curve: Curves.elasticOut)),
        weight: 40, // 1.8s -> 3.0s
      ),
    ]).animate(_controller);

    // Bite Progressions (0.0 to 1.0 for each bite)
    _bite1 = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.15, curve: Curves.easeIn)),
    );
    _bite2 = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.25, 0.4, curve: Curves.easeIn)),
    );
    _bite3 = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.45, 0.6, curve: Curves.easeIn)),
    );

    // Reset/Healing (Regrowing during the big spin)
    _reset = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.7, 0.95, curve: Curves.easeInOut)),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _rotation.value,
          child: CustomPaint(
            size: Size(widget.size, widget.size),
            painter: DonutPainter(
              bite1: _bite1.value,
              bite2: _bite2.value,
              bite3: _bite3.value,
              reset: _reset.value,
              crumbProgress: _controller.value,
            ),
          ),
        );
      },
    );
  }
}

class DonutPainter extends CustomPainter {
  final double bite1;
  final double bite2;
  final double bite3;
  final double reset;
  final double crumbProgress;

  DonutPainter({
    required this.bite1,
    required this.bite2,
    required this.bite3,
    required this.reset,
    required this.crumbProgress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final holeRadius = radius * 0.35;

    // Paints
    final doughPaint = Paint()..color = const Color(0xFFFFD1A9);
    final frostingPaint = Paint()..color = const Color(0xFFFF0000); // App Red frosting
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.1)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);

    // Draw main donut shape with bites subtracted
    Path donutPath = Path()
      ..addOval(Rect.fromCircle(center: center, radius: radius))
      ..addOval(Rect.fromCircle(center: center, radius: holeRadius));
    donutPath.fillType = PathFillType.evenOdd;

    // Define bite spots
    List<Offset> bites = [
      Offset(center.dx + radius * 0.8, center.dy - radius * 0.4),
      Offset(center.dx - radius * 0.8, center.dy - radius * 0.2),
      Offset(center.dx, center.dy + radius * 0.8),
    ];

    List<double> biteProgress = [bite1, bite2, bite3];
    List<double> biteSizes = [radius * 0.35, radius * 0.4, radius * 0.45];

    Path bitingPath = Path();
    for (int i = 0; i < bites.length; i++) {
      if (biteProgress[i] > 0) {
        // Calculate bite size (it gets smaller during reset/regrow)
        double currentBiteSize = biteSizes[i] * biteProgress[i] * (1.0 - reset);
        if (currentBiteSize > 0) {
          bitingPath.addOval(Rect.fromCircle(center: bites[i], radius: currentBiteSize));
        }
      }
    }

    // Draw Shadow
    canvas.drawPath(donutPath, shadowPaint);

    // Draw Dough
    canvas.drawPath(donutPath, doughPaint);

    // Draw Frosting (slightly smaller than dough for depth)
    Path frostingPath = Path()
      ..addOval(Rect.fromCircle(center: center, radius: radius * 0.85))
      ..addOval(Rect.fromCircle(center: center, radius: holeRadius * 1.2));
    frostingPath.fillType = PathFillType.evenOdd;
    canvas.drawPath(frostingPath, frostingPaint);

    // "Eat" the donut by drawing white circles (background color)
    // instead of using expensive Path.combine
    if (!bitingPath.getBounds().isEmpty) {
      final erasePaint = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.fill;
      canvas.drawPath(bitingPath, erasePaint);
    }

    // Draw Crumbs (breaking effect)
    _drawCrumbs(canvas, bites, biteProgress, biteSizes, center);
  }

  void _drawCrumbs(Canvas canvas, List<Offset> biteCenters, List<double> biteProgress, List<double> biteSizes, Offset donutCenter) {
    final crumbPaint = Paint()..color = const Color(0xFFFFD1A9);
    final rand = math.Random(42); // Seeded for consistency in current frame

    for (int i = 0; i < biteCenters.length; i++) {
      // Trigger crumbs when the bite starts
      double startTime = i == 0 ? 0.05 : (i == 1 ? 0.3 : 0.5);
      double activeProgress = (crumbProgress - startTime) * 8.0; // Fast burst

      if (activeProgress > 0 && activeProgress < 1.0) {
        for (int p = 0; p < 8; p++) {
          double angle = rand.nextDouble() * 2 * math.pi;
          double dist = biteSizes[i] * (0.5 + activeProgress * 2.0);
          Offset pos = Offset(
            biteCenters[i].dx + math.cos(angle) * dist,
            biteCenters[i].dy + math.sin(angle) * dist,
          );
          
          double crumbSize = 3.0 * (1.0 - activeProgress);
          canvas.drawCircle(pos, crumbSize, crumbPaint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(DonutPainter oldDelegate) => true;
}

class LetterAnimator extends StatelessWidget {
  final int index;
  final String char;
  final double animationValue;

  const LetterAnimator({
    super.key,
    required this.index,
    required this.char,
    required this.animationValue,
  });

  @override
  Widget build(BuildContext context) {
    // Delayed animation start for each letter
    final double delay = (index * 0.05) % 1.0;
    double value = (animationValue - delay);
    if (value < 0) value += 1.0;
    
    // Wave effect
    final double offset = math.sin(value * math.pi * 2) * 8;
    final double opacity = 0.5 + (math.sin(value * math.pi * 2) + 1) / 4;

    return Transform.translate(
      offset: Offset(0, offset),
      child: Opacity(
        opacity: opacity.clamp(0.0, 1.0),
        child: Text(
          char,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF1A1A1A),
            letterSpacing: 2,
            fontFamily: 'MPLUSRounded1c',
          ),
        ),
      ),
    );
  }
}

class FoodLoadingScreen extends StatefulWidget {
  const FoodLoadingScreen({super.key});

  @override
  State<FoodLoadingScreen> createState() => _FoodLoadingScreenState();
}

class _FoodLoadingScreenState extends State<FoodLoadingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  static const String message = "Preparing Perfection...";

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: SingleChildScrollView(
          physics: const NeverScrollableScrollPhysics(),
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const RepaintBoundary(
                    child: FoodLoading(size: 100),
                  ),
                  const SizedBox(height: 50),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Wrap(
                      alignment: WrapAlignment.center,
                      spacing: 0.0,
                      runSpacing: 4.0,
                      children: message.split('').asMap().entries.map((entry) {
                        return LetterAnimator(
                          index: entry.key,
                          char: entry.value,
                          animationValue: _controller.value,
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Finding the best spots for you',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF6B7280),
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

