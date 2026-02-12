import 'package:flutter/material.dart';

class SpotCard extends StatelessWidget {
  final Map<String, dynamic> spot;
  final double width;
  final double height;
  final EdgeInsetsGeometry margin;
  final VoidCallback? onTap;
  final bool enableResponsive;

  const SpotCard({
    super.key,
    required this.spot,
    this.width = 160,
    this.height = 240,
    this.margin = EdgeInsets.zero,
    this.onTap,
    this.enableResponsive = true,
  });

  @override
  Widget build(BuildContext context) {
    // Get screen width for responsive sizing
    final screenWidth = MediaQuery.of(context).size.width;
    final responsiveWidth = screenWidth * 0.4; // 40% of screen width
    final responsiveHeight = responsiveWidth * 1.5; // Maintain aspect ratio

    final cardWidth = enableResponsive ? responsiveWidth : width;
    final cardHeight = enableResponsive ? responsiveHeight : height;

    return Padding(
      padding: margin,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: cardWidth,
          height: cardHeight,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(25),
            child: Stack(
              children: [
                // Image
                Positioned.fill(
                  child: Image.network(spot['image']!, fit: BoxFit.cover),
                ),
                // Gradient Overlay
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.1),
                          Colors.black.withValues(alpha: 0.7),
                        ],
                        stops: const [0.6, 0.8, 1.0],
                      ),
                    ),
                  ),
                ),
                // Text Content
                Positioned(
                  bottom: responsiveHeight * 0.08, // Responsive bottom padding
                  left: responsiveWidth * 0.1, // Responsive left padding
                  right: responsiveWidth * 0.1, // Responsive right padding
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        spot['title']!,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize:
                              responsiveWidth * 0.11, // Responsive font size
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(
                        height: responsiveHeight * 0.02,
                      ), // Responsive spacing
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_rounded,
                            color: const Color(0xFFFF0000),
                            size:
                                responsiveWidth * 0.09, // Responsive icon size
                          ),
                          SizedBox(
                            width: responsiveWidth * 0.025,
                          ), // Responsive spacing
                          Expanded(
                            child: Text(
                              spot['location']!,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.9),
                                fontSize:
                                    responsiveWidth *
                                    0.09, // Responsive font size
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
