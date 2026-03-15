import 'package:flutter/material.dart';
import 'spot_details.dart';
import 'services/image_helper.dart';
import 'services/favorite_service.dart';
import 'widgets/food_loading.dart';
import 'services/auth_gate.dart';
import 'login.dart';

class FavoritesPage extends StatefulWidget {
  final VoidCallback? onExploreRequested;
  final bool isActive;
  const FavoritesPage({
    super.key,
    this.onExploreRequested,
    this.isActive = false,
  });

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  List<Map<String, dynamic>> _favoriteSpots = [];
  bool _isLoading = true;
  bool _isGuest = false;

  @override
  void initState() {
    super.initState();
    _checkGuestStatus();
  }

  Future<void> _checkGuestStatus() async {
    final guest = await AuthGate.isGuest();
    if (mounted) {
      setState(() => _isGuest = guest);
      if (!guest) {
        _loadFavorites();
      } else {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  void didUpdateWidget(covariant FavoritesPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!oldWidget.isActive && widget.isActive && !_isGuest) {
      _loadFavorites(isSilent: true);
    }
  }

  Future<void> _loadFavorites({bool isSilent = false}) async {
    print('DEBUG: FavoritesPage _loadFavorites started');
    if (!isSilent) setState(() => _isLoading = true);
    try {
      print('DEBUG: Calling FavoriteService.getFavoriteSpots()');
      final spots = await FavoriteService.getFavoriteSpots();
      print('DEBUG: Received ${spots.length} spots from service');
      if (mounted) {
        setState(() {
          _favoriteSpots = spots.map((spot) => _mapSpot(spot)).toList();
          _isLoading = false;
        });
        print('DEBUG: _loadFavorites complete. Loading set to false');
      }
    } catch (e) {
      print('DEBUG: Error in _loadFavorites: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // Map Supabase spot fields to UI internal format
  Map<String, dynamic> _mapSpot(Map<String, dynamic> spot) {
    return {
      'id': spot['id'],
      'title': spot['name'] ?? 'Untitled Spot',
      'location': spot['city'] ?? 'Unknown Location',
      'image': (spot['images'] != null && (spot['images'] as List).isNotEmpty)
          ? spot['images'][0]
          : '',
      'images': spot['images'] ?? [],
      'rating': (spot['rating'] as num?)?.toDouble().toString() ?? '0.0',
      'category': spot['category'] ?? 'Other',
      'isFavorite': true,
      'description': spot['description'] ?? '',
      'averageCost': spot['average_cost'] ?? 0,
      'phone': spot['phone'] ?? '',
      'whatsapp': spot['whatsapp'] ?? '',
      'instagram': spot['instagram'] ?? '',
      'openingTime': spot['opening_time'] ?? '',
      'closingTime': spot['closing_time'] ?? '',
      'latitude': (spot['latitude'] as num?)?.toDouble(),
      'longitude': (spot['longitude'] as num?)?.toDouble(),
      'is_24_hours': spot['is_24_hours'] ?? false,
    };
  }

  Future<void> _toggleFavorite(String spotId) async {
    final stillFav = await FavoriteService.toggleFavorite(spotId);
    if (!stillFav) {
      // If it was unsaved, remove from list
      if (mounted) {
        setState(() {
          _favoriteSpots.removeWhere((spot) => spot['id'] == spotId);
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Column(
        children: [
          // Elegant Fixed Header
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 10,
              bottom: 15,
              left: 20,
              right: 20,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF0000).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: const Icon(
                    Icons.bookmark_rounded,
                    color: Color(0xFFFF0000),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Your Favorites',
                      style: TextStyle(
                        color: Color(0xFF1A1A1A),
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    Text(
                      '${_favoriteSpots.length} saved places',
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: _isLoading
                ? const Center(child: FoodLoading())
                : RefreshIndicator(
                    onRefresh: _loadFavorites,
                    color: const Color(0xFFFF0000),
                    child: _isGuest
                        ? _buildGuestView()
                        : _favoriteSpots.isEmpty
                        ? SingleChildScrollView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            child: SizedBox(
                              height: MediaQuery.of(context).size.height * 0.7,
                              child: _buildEmptyState(),
                            ),
                          )
                        : GridView.builder(
                            padding: const EdgeInsets.fromLTRB(16, 20, 16, 120),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  childAspectRatio: 0.75,
                                  crossAxisSpacing: 16,
                                  mainAxisSpacing: 16,
                                ),
                            itemCount: _favoriteSpots.length,
                            itemBuilder: (context, index) {
                              final spot = _favoriteSpots[index];
                              return _buildGridSpotCard(spot);
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridSpotCard(Map<String, dynamic> spot) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SpotDetailsPage(
              spot: spot,
              heroTag: '${spot['id']}_favorites_grid',
            ),
          ),
        ).then((_) => _loadFavorites()); // Refresh when coming back
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Section
            Expanded(
              flex: 3,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Hero(
                    tag: '${spot['id']}_favorites_grid',
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(24),
                      ),
                      child: ImageHelper.loadImage(
                        spot['image'],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  // Rating Overlay
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.star_rounded,
                            color: Colors.amber,
                            size: 14,
                          ),
                          const SizedBox(width: 2),
                          Text(
                            spot['rating'],
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // Favorite toggle
                  Positioned(
                    top: 4,
                    right: 4,
                    child: IconButton(
                      icon: const Icon(
                        Icons.bookmark_rounded,
                        color: Color(0xFFFF0000),
                        size: 24,
                      ),
                      onPressed: () => _toggleFavorite(spot['id']),
                    ),
                  ),
                ],
              ),
            ),
            // Text Section
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          spot['title'],
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1A1A1A),
                            height: 1.2,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          spot['category'],
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_rounded,
                          size: 12,
                          color: const Color(0xFFFF0000).withOpacity(0.5),
                        ),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(
                            spot['location'],
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
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
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(35),
            decoration: BoxDecoration(
              color: const Color(0xFFFF0000).withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.bookmark_border_rounded,
              size: 70,
              color: const Color(0xFFFF0000).withOpacity(0.2),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Nothing saved yet',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Explore places you love and\nsave them for later!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              color: Colors.grey[500],
              height: 1.4,
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: widget.onExploreRequested,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFF0000),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
              elevation: 0,
            ),
            child: const Text(
              'Explore Spots',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGuestView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(35),
              decoration: BoxDecoration(
                color: const Color(0xFFFF0000).withOpacity(0.05),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.favorite_rounded,
                size: 70,
                color: const Color(0xFFFF0000).withOpacity(0.2),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Save Your Favorites',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Color(0xFF1A1A1A),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Sign in to save the food spots you love and keep them handy!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[500],
                height: 1.5,
              ),
            ),
            const SizedBox(height: 35),
            GestureDetector(
              onTap: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()),
                  (route) => false,
                );
              },
              child: Container(
                height: 60,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFFF0000),
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFF0000).withOpacity(0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'Sign In Now',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
