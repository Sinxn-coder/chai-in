import 'dart:async';
import 'package:flutter/material.dart';
import 'widgets/spot_card.dart';
import 'spot_details.dart';
import 'profile.dart';

class HomePageContent extends StatefulWidget {
  const HomePageContent({super.key});

  @override
  State<HomePageContent> createState() => _HomePageContentState();
}

class _HomePageContentState extends State<HomePageContent> {
  final List<String> _hintTexts = ['Foods', 'Spots', 'Locations'];
  int _hintIndex = 0;
  String _currentHint = "Search ";
  Timer? _hintTimer;
  bool _showNearMe = false; // Toggle between trending/newly added and near me

  final List<Map<String, dynamic>> _trendingSpots = [
    {
      'title': 'The Red Bistro',
      'location': 'Downtown Street',
      'image':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
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
      'specialDishes': [
        'Artisan Coffee Blend',
        'Croissant Sandwich',
        'Chocolate Mousse',
      ],
    },
    {
      'title': 'Green Garden',
      'location': 'East Park',
      'image':
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop',
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
      'specialDishes': ['BBQ Ribs', 'Grilled Steak', 'Loaded Nachos'],
    },
  ];

  final List<Map<String, dynamic>> _newlyAddedSpots = [
    {
      'title': 'The Blue Lagoon',
      'location': 'Harbor Side',
      'image':
          'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop',
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
      'specialDishes': ['Mountain Burger', 'Alpine Pasta', 'Peak View Dessert'],
    },
    {
      'title': 'Spice Route',
      'location': 'Old Town',
      'image':
          'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Spicy Curry Bowl', 'Tandoori Special', 'Mango Lassi'],
    },
    {
      'title': 'The Golden Leaf',
      'location': 'Central Square',
      'image':
          'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Golden Leaf Salad', 'Premium Steak', 'Golden Sundae'],
    },
    {
      'title': 'Oceanic Grill',
      'location': 'Beachfront',
      'image':
          'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': [
        'Grilled Fish Tacos',
        'Beachside Burger',
        'Tropical Smoothie',
      ],
    },
  ];

  final List<Map<String, dynamic>> _nearMeSpots = [
    {
      'title': 'Corner Cafe',
      'location': '0.5 km away',
      'image':
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Espresso Special', 'Fresh Sandwich', 'Homemade Soup'],
    },
    {
      'title': 'Street Food Corner',
      'location': '0.8 km away',
      'image':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Street Burger', 'Fried Noodles', 'Cold Coffee'],
    },
    {
      'title': 'Park View Restaurant',
      'location': '1.2 km away',
      'image':
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Park Special Pizza', 'View Salad', 'Fresh Juice'],
    },
    {
      'title': 'Local Dhaba',
      'location': '1.5 km away',
      'image':
          'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000&auto=format&fit=crop',
      'specialDishes': ['Traditional Thali', 'Butter Chicken', 'Sweet Lassi'],
    },
  ];

  @override
  void initState() {
    super.initState();
    _startHintAnimation();
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
              _currentHint = "Search $suffix...";
              _hintIndex = (_hintIndex + 1) % _hintTexts.length;
              charIndex = 0;
              suffix = _hintTexts[_hintIndex];
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
    super.dispose();
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
      child: SingleChildScrollView(
        padding: const EdgeInsets.only(
          top: 60.0,
          left: 12.0,
          right: 12.0,
          bottom: 120.0,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header (Now Scrollable)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Image.asset(
                      'assets/images/type_dark.png',
                      height: 55,
                      fit: BoxFit.contain,
                    ),
                    const Text(
                      'Find Your Spots!',
                      style: TextStyle(
                        color: Color(0xFF757575),
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'MPLUSRounded1c',
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ProfilePage(),
                      ),
                    );
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
                        width: 48,
                        height: 48,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
            // Search Area
            Row(
              children: [
                // Search Bar
                Expanded(
                  child: Container(
                    height: 55,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 20,
                          spreadRadius: 2,
                          offset: const Offset(0, 6),
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
                ),
                const SizedBox(width: 15),
                // Filter Button
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _showNearMe = !_showNearMe;
                    });
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: 55,
                    height: 55,
                    decoration: BoxDecoration(
                      color: _showNearMe
                          ? const Color(0xFFD32F2F)
                          : const Color(0xFFFF0000),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: _showNearMe
                          ? [
                              BoxShadow(
                                color: const Color(0xFFFF0000).withOpacity(0.6),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                              BoxShadow(
                                color: const Color(0xFFFF6B6B).withOpacity(0.4),
                                blurRadius: 15,
                                spreadRadius: 3,
                              ),
                              BoxShadow(
                                color: Colors.white.withOpacity(0.5),
                                blurRadius: 25,
                                spreadRadius: 2,
                              ),
                            ]
                          : [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                      gradient: _showNearMe
                          ? LinearGradient(
                              colors: [
                                const Color(0xFFFF8A80),
                                const Color(0xFFFF6B6B),
                                const Color(0xFFD32F2F),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              stops: [0.0, 0.5, 1.0],
                            )
                          : null,
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: AnimatedScale(
                            duration: const Duration(milliseconds: 200),
                            scale: _showNearMe ? 1.2 : 1.0,
                            child: AnimatedRotation(
                              duration: const Duration(milliseconds: 300),
                              turns: _showNearMe ? 0.1 : 0.0,
                              child: Icon(
                                Icons.location_on_rounded,
                                color: _showNearMe
                                    ? Colors.white
                                    : Colors.white,
                                size: 28,
                              ),
                            ),
                          ),
                        ),
                        if (_showNearMe)
                          Positioned.fill(
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 600),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 35),
            // Conditional Section Headers and Content
            if (_showNearMe) ...[
              Text(
                'Near Me',
                style: TextStyle(
                  color: const Color(0xFF2D2D2D),
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'MPLUSRounded1c',
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 20),
              // Near Me Cards
              // Near Me Cards
              GridView.builder(
                padding: EdgeInsets.zero,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: _nearMeSpots.length,
                itemBuilder: (context, index) {
                  final spot = _nearMeSpots[index];
                  return Center(
                    child: SpotCard(
                      spot: spot,
                      margin: EdgeInsets.zero,
                      enableResponsive: false,
                      width: double.infinity,
                      height: double.infinity,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SpotDetailsPage(spot: spot),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ] else ...[
              Text(
                'Trending Today',
                style: TextStyle(
                  color: const Color(0xFF2D2D2D),
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'MPLUSRounded1c',
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 20),
              // Trending Cards
              LayoutBuilder(
                builder: (context, constraints) {
                  final cardHeight =
                      constraints.maxWidth * 0.4 * 1.5; // Same as card height
                  return SizedBox(
                    height: cardHeight,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      clipBehavior: Clip.none,
                      itemCount: _trendingSpots.length,
                      itemBuilder: (context, index) {
                        final spot = _trendingSpots[index];
                        return SpotCard(
                          spot: spot,
                          margin: const EdgeInsets.only(right: 8),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    SpotDetailsPage(spot: spot),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
              Text(
                'Newly added',
                style: TextStyle(
                  color: const Color(0xFF2D2D2D),
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'MPLUSRounded1c',
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 20),
              // Newly Added Cards
              LayoutBuilder(
                builder: (context, constraints) {
                  final cardHeight =
                      constraints.maxWidth * 0.4 * 1.5; // Same as card height
                  return SizedBox(
                    height: cardHeight,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      clipBehavior: Clip.none,
                      itemCount: _newlyAddedSpots.length,
                      itemBuilder: (context, index) {
                        final spot = _newlyAddedSpots[index];
                        return SpotCard(
                          spot: spot,
                          margin: const EdgeInsets.only(right: 8),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    SpotDetailsPage(spot: spot),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
