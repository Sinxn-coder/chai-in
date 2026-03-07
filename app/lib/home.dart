import 'dart:async';
import 'package:flutter/material.dart';
import 'widgets/spot_card.dart';
import 'spot_details.dart';
import 'profile.dart';
import 'supabase_config.dart';
import 'widgets/food_loading.dart';
import 'services/spot_status_service.dart';

class HomePageContent extends StatefulWidget {
  const HomePageContent({super.key});

  @override
  State<HomePageContent> createState() => _HomePageContentState();
}

class _HomePageContentState extends State<HomePageContent> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _trendingSpots = [];
  List<Map<String, dynamic>> _newlyAddedSpots = [];

  // Refresh method for swipe down refresh
  Future<void> _refreshData() async {
    await _fetchHomeData();
  }

  Future<void> _fetchHomeData() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    try {
      // Fetch Trending (Featured or high rating)
      final trendingResponse = await SupabaseConfig.client
          .from('spots')
          .select()
          .eq('status', 'approved')
          .eq('is_featured', true)
          .limit(5);

      // Fetch Newly Added
      final newlyAddedResponse = await SupabaseConfig.client
          .from('spots')
          .select()
          .eq('status', 'approved')
          .order('created_at', ascending: false)
          .limit(5);

      if (mounted) {
        setState(() {
          _trendingSpots = _mapSpots(trendingResponse);
          _newlyAddedSpots = _mapSpots(newlyAddedResponse);
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching home data: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  List<Map<String, dynamic>> _mapSpots(dynamic data) {
    if (data == null) return [];
    final List<dynamic> list = data;
    return list.map((spot) {
      return {
        'id': spot['id'],
        'title': spot['name'],
        'location': spot['city'],
        'description': spot['description'] ?? '',
        'image': (spot['images'] != null && (spot['images'] as List).isNotEmpty)
            ? spot['images'][0]
            : '',
        'images': spot['images'] ?? [],
        'category': spot['category'] ?? 'Other',
        'rating': (spot['rating'] as num?)?.toDouble() ?? 0.0,
        'averageCost': spot['average_cost'] ?? 0,
        'specialDishes': spot['special_dishes'] ?? [],
        'features': spot['features'] ?? [],
        'phone': spot['phone'] ?? '',
        'whatsapp': spot['whatsapp'] ?? '',
        'instagram': spot['instagram'] ?? '',
        'openingTime': spot['opening_time'] ?? '',
        'closingTime': spot['closing_time'] ?? '',
        'is_24_hours': spot['is_24_hours'] ?? false,
        'isOpen': SpotStatusService.isSpotOpen(
          spot['opening_time'],
          spot['closing_time'],
          is24Hours: spot['is_24_hours'] ?? false,
        ),
        'status': SpotStatusService.getStatusString(
          spot['opening_time'],
          spot['closing_time'],
          is24Hours: spot['is_24_hours'] ?? false,
        ),
        'latitude': (spot['latitude'] as num?)?.toDouble(),
        'longitude': (spot['longitude'] as num?)?.toDouble(),
      };
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _fetchHomeData();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFFFBFBFB),
      child: RefreshIndicator(
        onRefresh: _refreshData,
        color: const Color(0xFFFF0000),
        child: _isLoading
            ? const Center(child: FoodLoading(size: 80))
            : SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Large Red Header
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.only(
                        top: 60.0,
                        left: 20.0,
                        right: 20.0,
                        bottom: 30.0,
                      ),
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Color(0xFFFF0000), Color(0xFFE60000)],
                        ),
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(40),
                          bottomRight: Radius.circular(40),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black12,
                            blurRadius: 20,
                            offset: Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Image.asset(
                                'assets/images/type_light.png',
                                height: 50,
                                fit: BoxFit.contain,
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
                                  padding: const EdgeInsets.all(2),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 10,
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: _buildAvatar(),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 30),
                          const Text(
                            'Find Your\nSpots!',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.w900,
                              height: 1.1,
                              fontFamily: 'MPLUSRounded1c',
                              letterSpacing: -1.0,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Discover the best dining experiences',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              fontFamily: 'MPLUSRounded1c',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 15),
                    // Trending Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Text(
                        'Trending Today',
                        style: TextStyle(
                          color: const Color(0xFF2D2D2D),
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          fontFamily: 'MPLUSRounded1c',
                          letterSpacing: -0.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 5),
                    SizedBox(
                      height: 280,
                      child: ListView.builder(
                        padding: const EdgeInsets.only(left: 20.0),
                        scrollDirection: Axis.horizontal,
                        clipBehavior: Clip.none,
                        itemCount: _trendingSpots.length,
                        itemBuilder: (context, index) {
                          final spot = _trendingSpots[index];
                          return SpotCard(
                            spot: spot,
                            heroTag: '${spot['title']}_trending',
                            margin: const EdgeInsets.only(right: 15),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => SpotDetailsPage(
                                    spot: spot,
                                    heroTag: '${spot['title']}_trending',
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 35),
                    // Newly Added Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Text(
                        'Newly Added',
                        style: TextStyle(
                          color: const Color(0xFF2D2D2D),
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          fontFamily: 'MPLUSRounded1c',
                          letterSpacing: -0.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 5),
                    SizedBox(
                      height: 280,
                      child: ListView.builder(
                        padding: const EdgeInsets.only(left: 20.0),
                        scrollDirection: Axis.horizontal,
                        clipBehavior: Clip.none,
                        itemCount: _newlyAddedSpots.length,
                        itemBuilder: (context, index) {
                          final spot = _newlyAddedSpots[index];
                          return SpotCard(
                            spot: spot,
                            heroTag: '${spot['title']}_newly_added',
                            margin: const EdgeInsets.only(right: 15),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => SpotDetailsPage(
                                    spot: spot,
                                    heroTag: '${spot['title']}_newly_added',
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 120), // Bottom padding for FAB/Nav
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildAvatar() {
    final user = SupabaseConfig.client.auth.currentUser;
    // We already have a profile check in home, let's just use current user metadata as fallback
    final googlePhoto = user?.userMetadata?['avatar_url'];

    // In a real app we'd fetch the latest profile from DB,
    // but for the header, we can just use the cached user object or icon.
    return Image.network(
      googlePhoto ?? '',
      width: 40,
      height: 40,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) => Image.asset(
        'assets/images/icon.png',
        width: 40,
        height: 40,
        fit: BoxFit.cover,
      ),
    );
  }
}
