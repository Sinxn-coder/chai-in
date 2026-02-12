import 'dart:async';
import 'package:flutter/material.dart';
import 'spot_details.dart';

class ExplorePageContent extends StatefulWidget {
  const ExplorePageContent({super.key});

  @override
  State<ExplorePageContent> createState() => _ExplorePageContentState();
}

class _ExplorePageContentState extends State<ExplorePageContent> {
  final List<String> _hintTexts = ['Foods', 'Spots', 'Locations'];
  int _hintIndex = 0;
  String _currentHint = "Search ";
  Timer? _hintTimer;
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  final Set<int> _savedSpots = <int>{};

  final List<Map<String, dynamic>> _allSpots = [
    {
      'title': 'The Red Bistro',
      'location': 'Downtown Street',
      'image':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': [
        'Signature Red Burger',
        'Spicy Chicken Wings',
        'Chocolate Lava Cake',
      ],
    },
    {
      'title': 'Skyline Lounge',
      'location': 'West Coast',
      'image':
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
      'isOpen': false,
      'status': 'Closed',
      'specialDishes': [
        'Skyline Special Cocktail',
        'Gourmet Seafood Platter',
        'Tiramisu Delight',
      ],
    },
    {
      'title': 'Cafe Horizon',
      'location': 'Uptown Gate',
      'image':
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': [
        'Artisan Coffee Blend',
        'Croissant Sandwich',
        'Red Velvet Cupcake',
      ],
    },
    {
      'title': 'Green Garden',
      'location': 'East Park',
      'image':
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': [
        'Garden Fresh Salad',
        'Vegetarian Pasta',
        'Green Smoothie Bowl',
      ],
    },
    {
      'title': 'Urban Grill',
      'location': 'South Side',
      'image':
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
      'isOpen': false,
      'status': 'Closed',
      'specialDishes': ['BBQ Ribs', 'Grilled Steak', 'Loaded Nachos'],
    },
    {
      'title': 'The Blue Lagoon',
      'location': 'Harbor Side',
      'image':
          'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': [
        'Fresh Seafood Platter',
        'Blue Lagoon Cocktail',
        'Lobster Thermidor',
      ],
    },
    {
      'title': 'Mountain View',
      'location': 'Peak Road',
      'image':
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': ['Mountain Burger', 'Alpine Pasta', 'Peak View Dessert'],
    },
    {
      'title': 'Spice Route',
      'location': 'Old Town',
      'image':
          'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=1000&auto=format&fit=crop',
      'isOpen': false,
      'status': 'Closes Soon',
      'specialDishes': ['Spicy Curry Bowl', 'Tandoori Special', 'Mango Lassi'],
    },
    {
      'title': 'The Golden Leaf',
      'location': 'Central Square',
      'image':
          'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': ['Golden Leaf Salad', 'Premium Steak', 'Golden Sundae'],
    },
    {
      'title': 'Oceanic Grill',
      'location': 'Beachfront',
      'image':
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
      'isOpen': true,
      'status': 'Open Now',
      'specialDishes': [
        'Grilled Fish Tacos',
        'Beachside Burger',
        'Tropical Smoothie',
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    _startHintAnimation();
    _scrollController.addListener(() {
      setState(() {
        _isScrolled = _scrollController.offset > 50;
      });
    });
  }

  void _startHintAnimation() {
    _hintTimer?.cancel();
    _currentHint = "Search ";
    int charIndex = 0;
    String suffix = _hintTexts[_hintIndex];

    _hintTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (charIndex < suffix.length) {
        if (mounted) {
          setState(() {
            charIndex++;
            _currentHint = "Search ${suffix.substring(0, charIndex)}";
          });
        }
      } else {
        timer.cancel();
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              _hintIndex = (_hintIndex + 1) % _hintTexts.length;
              _startHintAnimation();
            });
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _hintTimer?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  // Helper method to create status indicator with unique style
  Widget _buildStatusIndicator(bool isOpen, String status) {
    if (isOpen) {
      // Open status - diamond shape with gradient
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [const Color(0xFF4CAF50), const Color(0xFF66BB6A)],
          ),
          borderRadius: BorderRadius.circular(6),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF4CAF50).withValues(alpha: 0.3),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              status,
              style: const TextStyle(
                fontSize: 11,
                color: Colors.white,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
      );
    } else {
      // Closed status - chip style with subtle design
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.grey[300]!, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.access_time_filled_rounded,
              size: 12,
              color: Colors.grey[600],
            ),
            const SizedBox(width: 4),
            Text(
              status,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey[700],
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(-0.5, -0.6),
          radius: 1.5,
          colors: [Color(0xFFFFFFFF), Color(0xFFFBFBFB)],
          stops: [0.0, 1.0],
        ),
      ),
      child: Column(
        children: [
          // Animated Header Section
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            padding: EdgeInsets.only(
              top: _isScrolled ? 40.0 : 60.0,
              left: 20.0,
              right: 20.0,
              bottom: _isScrolled ? 10.0 : 20.0,
            ),
            child: AnimatedSize(
              duration: const Duration(milliseconds: 300),
              child: _isScrolled
                  ? // Collapsed state - only search bar with same style
                    Container(
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 15,
                            spreadRadius: 2,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: _currentHint,
                          hintStyle: const TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                          prefixIcon: const Icon(
                            Icons.search_rounded,
                            color: Colors.black87,
                            size: 24,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 12,
                          ),
                        ),
                      ),
                    )
                  : // Expanded state - header text and search bar
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Explore All Spots',
                              style: TextStyle(
                                color: const Color(0xFF2D2D2D),
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                fontFamily: 'MPLUSRounded1c',
                                letterSpacing: -1.0,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Where every meal tells a story',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                fontFamily: 'MPLUSRounded1c',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        // Search Bar with Animation
                        Container(
                          height: 55,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 15,
                                spreadRadius: 2,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: _currentHint,
                              hintStyle: const TextStyle(
                                color: Color(0xFF9E9E9E),
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                              prefixIcon: const Icon(
                                Icons.search_rounded,
                                color: Colors.black87,
                                size: 28,
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 15,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          // Scrollable Card List
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.only(
                left: 8.0,
                right: 8.0,
                bottom: 120.0,
              ),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: EdgeInsets.zero,
                itemCount: _allSpots.length,
                itemBuilder: (context, index) {
                  final spot = _allSpots[index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => SpotDetailsPage(spot: spot),
                        ),
                      );
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: const Color(
                            0xFFFF0000,
                          ).withValues(alpha: 0.15),
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 20,
                            spreadRadius: 0,
                            offset: const Offset(0, 4),
                          ),
                          BoxShadow(
                            color: const Color(
                              0xFFFF0000,
                            ).withValues(alpha: 0.05),
                            blurRadius: 15,
                            spreadRadius: -2,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          Row(
                            children: [
                              // Image on the left - touches top, left, bottom borders
                              ClipRRect(
                                borderRadius: BorderRadius.circular(20),
                                child: Image.network(
                                  spot['image']!,
                                  width: 120,
                                  height: 160,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              // Details on the right
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 16.0,
                                    horizontal: 12.0,
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            spot['title']!,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFF1A1A1A),
                                              letterSpacing: -0.6,
                                              height: 1.2,
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 10),
                                          // Location with icon and subtle divider
                                          Row(
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.all(
                                                  4,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: const Color(
                                                    0xFFFF0000,
                                                  ).withValues(alpha: 0.1),
                                                  borderRadius:
                                                      BorderRadius.circular(6),
                                                ),
                                                child: const Icon(
                                                  Icons.location_on_rounded,
                                                  size: 16,
                                                  color: Color(0xFFFF0000),
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              Expanded(
                                                child: Text(
                                                  spot['location']!,
                                                  style: TextStyle(
                                                    fontSize: 12,
                                                    color: Colors.grey[700],
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      // Rating row
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                          // Rating - simple linear style
                                          Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(
                                                Icons.star_rounded,
                                                size: 16,
                                                color: Colors.amber,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                '4.8',
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  fontWeight: FontWeight.w800,
                                                  color: Colors.grey[850],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      // Status indicator at bottom
                                      _buildStatusIndicator(
                                        spot['isOpen'],
                                        spot['status'],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          // Favorite icon on top right
                          Positioned(
                            top: 12,
                            right: 12,
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  if (_savedSpots.contains(index)) {
                                    _savedSpots.remove(index);
                                  } else {
                                    _savedSpots.add(index);
                                  }
                                });
                              },
                              child: Icon(
                                _savedSpots.contains(index)
                                    ? Icons.bookmark_rounded
                                    : Icons.bookmark_border_rounded,
                                size: 20,
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
            ),
          ),
        ],
      ),
    );
  }
}
