import 'package:flutter/material.dart';
import 'spot_details.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  final List<Map<String, dynamic>> _favoriteSpots = [
    {
      'title': 'The Red Bistro',
      'location': 'Downtown Street',
      'image':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      'rating': '4.8',
      'isFavorite': true,
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
      'rating': '4.9',
      'isFavorite': true,
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
      'rating': '4.7',
      'isFavorite': true,
      'specialDishes': [
        'Artisan Coffee Blend',
        'Croissant Sandwich',
        'Red Velvet Cupcake',
      ],
    },
  ];

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
          left: 8.0,
          right: 8.0,
          bottom: 120.0,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Saved Spots',
                  style: TextStyle(
                    color: const Color(0xFF2D2D2D),
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    fontFamily: 'MPLUSRounded1c',
                    letterSpacing: -1.0,
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
            // Favorites List
            _favoriteSpots.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.bookmark_border,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'No favorites yet',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start adding your favorite spots!',
                          style: TextStyle(
                            color: Colors.grey[500],
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: EdgeInsets.zero,
                    itemCount: _favoriteSpots.length,
                    itemBuilder: (context, index) {
                      final spot = _favoriteSpots[index];
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
                          margin: const EdgeInsets.only(bottom: 6),
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
                                      spot['image'],
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
                                                spot['title'],
                                                style: const TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.w700,
                                                  color: Color(0xFF1A1A1A),
                                                  letterSpacing: -0.6,
                                                  height: 1.2,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              const SizedBox(height: 10),
                                              // Location with icon
                                              Row(
                                                children: [
                                                  Container(
                                                    padding:
                                                        const EdgeInsets.all(4),
                                                    decoration: BoxDecoration(
                                                      color: const Color(
                                                        0xFFFF0000,
                                                      ).withValues(alpha: 0.1),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            6,
                                                          ),
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
                                                      spot['location'],
                                                      style: TextStyle(
                                                        fontSize: 14,
                                                        color: Colors.grey[700],
                                                        fontWeight:
                                                            FontWeight.w600,
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
                                                    spot['rating'],
                                                    style: TextStyle(
                                                      fontSize: 13,
                                                      fontWeight:
                                                          FontWeight.w800,
                                                      color: Colors.grey[850],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              // Favorite icon on top right (filled)
                              Positioned(
                                top: 12,
                                right: 12,
                                child: const Icon(
                                  Icons.bookmark,
                                  size: 20,
                                  color: Color(0xFFFF0000),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
