import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'spot_details.dart';
import 'supabase_config.dart';
import 'services/image_helper.dart';
import 'widgets/food_loading.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'services/notification_service.dart';
import 'services/favorite_service.dart';
import 'services/spot_status_service.dart';

class ExplorePageContent extends StatefulWidget {
  final bool isActive;
  const ExplorePageContent({super.key, this.isActive = false});

  @override
  State<ExplorePageContent> createState() => _ExplorePageContentState();
}

class _ExplorePageContentState extends State<ExplorePageContent> {
  final List<String> _hintTexts = [
    'Find your favorite restaurant...',
    'Discover new dining spots...',
    'Search by location or area...',
    'Look for specific dishes...',
    'Explore nearby cafes...',
    'Find the best cuisine...',
    'Search for trending places...',
    'Discover hidden gems...',
    'Find perfect dinner spots...',
    'Explore local favorites...',
  ];
  int _hintIndex = 0;
  String _currentHint = "Find your favorite restaurant...";
  Timer? _hintTimer;
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  final FocusNode _searchFocusNode = FocusNode(); // Focus node for search bar

  // Filtering state
  String _selectedCategory = 'All';
  bool _showOnlyOpen = false;
  double _minRating = 0.0;
  double _currentMaxPrice = 10000;
  final double _maxPossiblePrice = 10000;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  bool _isSearchFocused = false;
  final Set<String> _savedSpots = <String>{};
  bool _isLoading = true;

  @override
  void didUpdateWidget(covariant ExplorePageContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!oldWidget.isActive && widget.isActive) {
      _fetchSpots(isSilent: true);
    }
  }

  List<Map<String, dynamic>> _allSpots = [];
  Position? _currentPosition;
  bool _isGettingLocation = false;

  List<String> _categories = ['Near Me'];

  // Refresh method for swipe down refresh
  Future<void> _refreshData() async {
    // Reset search hint animation
    setState(() {
      _hintIndex = 0;
      _currentHint = _hintTexts[_hintIndex];
    });

    await _fetchSpots(isSilent: true);

    // Restart hint animation
    _startHintAnimation();
  }

  Future<void> _fetchSpots({bool isSilent = false}) async {
    if (!isSilent) {
      setState(() => _isLoading = true);
    }
    try {
      final response = await SupabaseConfig.client
          .from('spots')
          .select()
          .eq('status', 'approved')
          .order('created_at', ascending: false);

      final favIds = await FavoriteService.getFavoriteSpotIds();

      final List<dynamic> data = response;
      setState(() {
        _savedSpots.clear();
        _savedSpots.addAll(favIds);
        _allSpots = data.map((spot) {
          return {
            'id': spot['id'],
            'title': spot['name'],
            'location': spot['city'],
            'description': spot['description'] ?? '',
            'image':
                (spot['images'] != null && (spot['images'] as List).isNotEmpty)
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
            'is_24_hours': spot['is_24_hours'] ?? false,
            'isFeatured': spot['is_featured'] ?? false,
          };
        }).toList();
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching spots: $e');
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error fetching spots: $e')));
      }
    }
  }

  // Method to get price label based on current value
  String _getPriceLabel(double value) {
    switch (value.toInt()) {
      case 667:
        return '₹ 0 - 667';
      case 1334:
        return '₹ 667 - 1334';
      case 2001:
        return '₹ 1334 - 2001';
      case 2668:
        return '₹ 2001 - 2668';
      case 3335:
        return '₹ 2668 - 3335';
      case 4002:
        return '₹ 3335 - 4002';
      case 4669:
        return '₹ 4002 - 4669';
      case 5336:
        return '₹ 4669 - 5336';
      case 6003:
        return '₹ 5336 - 6003';
      case 6670:
        return '₹ 6003 - 6670';
      case 7337:
        return '₹ 6670 - 7337';
      case 8004:
        return '₹ 7337 - 8004';
      case 8671:
        return '₹ 8004 - 8671';
      case 9338:
        return '₹ 8671 - 9338';
      case 10000:
        return '₹ 9338 - 10000';
      default:
        return '₹ 0 - 667';
    }
  }

  // Method to get price display based on current value
  String _getPriceDisplay(double value) {
    switch (value.toInt()) {
      case 667:
        return '₹ 350'; // Good budget price
      case 1334:
        return '₹ 1000'; // Round thousand
      case 2001:
        return '₹ 1500'; // Round thousand
      case 2668:
        return '₹ 2500'; // Round thousand
      case 3335:
        return '₹ 3000'; // Round thousand
      case 4002:
        return '₹ 3500'; // Round thousand
      case 4669:
        return '₹ 4000'; // Round thousand
      case 5336:
        return '₹ 5000'; // Round thousand
      case 6003:
        return '₹ 5500'; // Round thousand
      case 6670:
        return '₹ 6000'; // Round thousand
      case 7337:
        return '₹ 7000'; // Round thousand
      case 8004:
        return '₹ 7500'; // Round thousand
      case 8671:
        return '₹ 8000'; // Round thousand
      case 9338:
        return '₹ 9000'; // Round thousand
      case 10000:
        return '₹ 9500'; // Round thousand
      default:
        return '₹ 350';
    }
  }

  List<Map<String, dynamic>> get _filteredSpots {
    List<Map<String, dynamic>> spots = [];

    if (_searchQuery.isEmpty) {
      spots = _allSpots.where((spot) {
        final matchesCategory =
            _selectedCategory == 'All' ||
            _selectedCategory ==
                'Near Me' || // Near Me is handled by sorting/filtering below
            spot['category'] == _selectedCategory;
        final matchesOpen = !_showOnlyOpen || spot['isOpen'] == true;
        final matchesRating = (spot['rating'] ?? 0.0) >= _minRating;
        final matchesPrice = (spot['averageCost'] ?? 0.0) <= _currentMaxPrice;

        return matchesCategory && matchesOpen && matchesRating && matchesPrice;
      }).toList();
    } else {
      spots = _allSpots.where((spot) {
        final query = _searchQuery.toLowerCase();

        // Search in title
        final titleMatch =
            spot['title']?.toString().toLowerCase().contains(query) ?? false;

        // Search in location
        final locationMatch =
            spot['location']?.toString().toLowerCase().contains(query) ?? false;

        // Search in category
        final categoryMatch =
            spot['category']?.toString().toLowerCase().contains(query) ?? false;

        // Search in special dishes
        bool specialDishMatch = false;
        if (spot['specialDishes'] != null) {
          final dishes = spot['specialDishes'] as List<dynamic>;
          specialDishMatch = dishes.any(
            (dish) => dish.toString().toLowerCase().contains(query),
          );
        }

        // Check if any field matches
        final matchesSearch =
            titleMatch || locationMatch || categoryMatch || specialDishMatch;

        final matchesCategory =
            _selectedCategory == 'All' ||
            _selectedCategory == 'Near Me' ||
            spot['category'] == _selectedCategory;
        final matchesOpen = !_showOnlyOpen || spot['isOpen'] == true;
        final matchesRating = (spot['rating'] ?? 0.0) >= _minRating;
        final matchesPrice = (spot['averageCost'] ?? 0.0) <= _currentMaxPrice;

        return matchesSearch &&
            matchesCategory &&
            matchesOpen &&
            matchesRating &&
            matchesPrice;
      }).toList();
    }

    // Apply "Near Me" logic: 30km Filter + Distance Sorting
    if (_selectedCategory == 'Near Me') {
      if (_currentPosition == null)
        return []; // Don't show anything until location is known

      final Distance distanceCalc = const Distance();
      final userLatLng = LatLng(
        _currentPosition!.latitude,
        _currentPosition!.longitude,
      );

      return spots.where((spot) {
        if (spot['latitude'] == null || spot['longitude'] == null) return false;

        final spotLatLng = LatLng(spot['latitude'], spot['longitude']);
        final double distInMeters = distanceCalc.as(
          LengthUnit.Meter,
          userLatLng,
          spotLatLng,
        );

        spot['distance'] = distInMeters / 1000.0; // Store distance in km
        return spot['distance'] <= 30.0; // Only within 30km
      }).toList()..sort(
        (a, b) => (a['distance'] as double).compareTo(b['distance'] as double),
      );
    }

    return spots;
  }

  @override
  void initState() {
    super.initState();
    _fetchSpots();
    _fetchCategories();
    _startHintAnimation();
    _scrollController.addListener(() {
      setState(() {
        _isScrolled = _scrollController.offset > 50;
      });
    });
  }

  Future<void> _fetchCategories() async {
    try {
      final response = await SupabaseConfig.client
          .from('categories')
          .select('name')
          .order('name');

      if (mounted) {
        setState(() {
          final dbCategories = response
              .map((c) => c['name'] as String)
              .where((name) => name != 'All' && name != 'Near Me');
          _categories = ['Near Me', ...dbCategories];
        });
      }
    } catch (e) {
      debugPrint('Error fetching categories: $e');
    }
  }

  void _startHintAnimation() {
    _hintTimer?.cancel();
    _currentHint = "";
    int charIndex = 0;
    String suffix = _hintTexts[_hintIndex];

    _hintTimer = Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (charIndex < suffix.length) {
        if (mounted) {
          setState(() {
            charIndex++;
            _currentHint = suffix.substring(0, charIndex);
          });
        }
      } else {
        timer.cancel();
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              _currentHint = "$suffix...";
              _hintIndex = (_hintIndex + 1) % _hintTexts.length;
              charIndex = 0;
              suffix = _hintTexts[_hintIndex];
            });
            _startHintAnimation();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _hintTimer?.cancel();
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _handleNearMeSelection() async {
    setState(() => _isGettingLocation = true);
    try {
      bool serviceEnabled;
      LocationPermission permission;

      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          NotificationService.show(
            message: 'Location services are disabled.',
            type: NotificationType.error,
          );
        }
        setState(() {
          _selectedCategory = 'All';
          _isGettingLocation = false;
        });
        return;
      }

      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            NotificationService.show(
              message: 'Location permissions are denied.',
              type: NotificationType.error,
            );
          }
          setState(() {
            _selectedCategory = 'All';
            _isGettingLocation = false;
          });
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          NotificationService.show(
            message: 'Location permissions are permanently denied.',
            type: NotificationType.error,
          );
        }
        setState(() {
          _selectedCategory = 'All';
          _isGettingLocation = false;
        });
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 10),
      );
      setState(() {
        _currentPosition = position;
        _isGettingLocation = false;
      });
    } catch (e) {
      debugPrint('Error getting location: $e');
      if (mounted) {
        NotificationService.show(
          message: 'Error getting location: $e',
          type: NotificationType.error,
        );
      }
      setState(() {
        _selectedCategory = 'All';
        _isGettingLocation = false;
      });
    }
  }

  void _clearAllFilters() {
    setState(() {
      _searchController.clear();
      _searchQuery = '';
      _selectedCategory = 'All';
      _showOnlyOpen = false;
      _minRating = 0.0;
      _currentMaxPrice = _maxPossiblePrice;
    });
  }

  // Helper method to create status indicator with unique style
  Widget _buildStatusIndicator(bool isOpen, String status) {
    if (isOpen) {
      // Open status - diamond shape with gradient
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF4CAF50), Color(0xFF66BB6A)],
          ),
          borderRadius: BorderRadius.circular(6),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF4CAF50).withOpacity(0.3),
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
          color: Colors.white70,
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

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(25),
              topRight: Radius.circular(25),
            ),
          ),
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: 24 + MediaQuery.of(context).padding.bottom,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Filters',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      _clearAllFilters();
                      setModalState(() {});
                    },
                    child: const Text(
                      'Reset',
                      style: TextStyle(color: Color(0xFFFF0000)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text(
                'Status',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                title: const Text('Open Now'),
                value: _showOnlyOpen,
                activeTrackColor: const Color(0xFFFF0000),
                contentPadding: EdgeInsets.zero,
                onChanged: (val) {
                  setModalState(() => _showOnlyOpen = val);
                  setState(() {});
                },
              ),
              const SizedBox(height: 24),
              const Text(
                'Minimum Rating',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [0.0, 3.0, 4.0, 4.5].map((rating) {
                  final isSelected = _minRating == rating;
                  return GestureDetector(
                    onTap: () {
                      setModalState(() => _minRating = rating);
                      setState(() {});
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? const Color(0xFFFF0000)
                            : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? const Color(0xFFFF0000)
                              : const Color(0xFFE5E7EB),
                        ),
                      ),
                      child: Text(
                        rating == 0.0 ? 'Any' : '$rating+',
                        style: TextStyle(
                          color: isSelected
                              ? Colors.white
                              : const Color(0xFF6B7280),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Average Price',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    _getPriceDisplay(_currentMaxPrice),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFF0000),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: const Color(0xFFFF0000),
                  inactiveTrackColor: const Color(0xFFFF0000).withOpacity(0.1),
                  thumbColor: const Color(0xFFFF0000),
                  overlayColor: const Color(0xFFFF0000).withOpacity(0.1),
                  valueIndicatorColor: const Color(0xFFFF0000),
                  valueIndicatorTextStyle: const TextStyle(color: Colors.white),
                ),
                child: Slider(
                  value: _currentMaxPrice,
                  min: 0,
                  max: _maxPossiblePrice,
                  divisions: 14,
                  label: _getPriceLabel(_currentMaxPrice),
                  onChanged: (value) {
                    // Snap to nearest exact price point
                    final List<double> pricePoints = [
                      667,
                      1334,
                      2001,
                      2668,
                      3335,
                      4002,
                      4669,
                      5336,
                      6003,
                      6670,
                      7337,
                      8004,
                      8671,
                      9338,
                      10000,
                    ];

                    double snappedValue = pricePoints.first;
                    double minDistance = (value - pricePoints.first).abs();

                    for (final point in pricePoints) {
                      final distance = (value - point).abs();
                      if (distance < minDistance) {
                        minDistance = distance;
                        snappedValue = point;
                      }
                    }

                    // Ensure vibration works
                    if (snappedValue.toInt() != _currentMaxPrice.toInt()) {
                      HapticFeedback.vibrate();
                      HapticFeedback.heavyImpact();
                    }

                    setModalState(() {
                      _currentMaxPrice = snappedValue;
                    });
                    setState(() {});
                  },
                ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFF0000),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Show Results',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
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
                    GestureDetector(
                      onTap: () {
                        // Unfocus search when tapping outside
                        _searchFocusNode.unfocus();
                        setState(() {
                          _isSearchFocused = false;
                        });
                      },
                      child: Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 15,
                              spreadRadius: 2,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: TextField(
                          controller: _searchController,
                          focusNode: _searchFocusNode,
                          onTap: () {
                            setState(() {
                              _isSearchFocused = true;
                            });
                          },
                          onEditingComplete: () {
                            setState(() {
                              _isSearchFocused = false;
                            });
                          },
                          onSubmitted: (value) {
                            setState(() {
                              _isSearchFocused = false;
                            });
                          },
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
                            border: _isSearchFocused
                                ? OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(25),
                                    borderSide: const BorderSide(
                                      color: Color(0xFFFF0000),
                                      width: 2,
                                    ),
                                  )
                                : InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(25),
                              borderSide: const BorderSide(
                                color: Color(0xFFFF0000),
                                width: 2,
                              ),
                            ),
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
                            const Text(
                              'Explore All Spots',
                              style: TextStyle(
                                color: Color(0xFF1A1A1A),
                                fontSize: 34,
                                fontWeight: FontWeight.w800,
                                fontFamily: 'MPLUSRounded1c',
                                letterSpacing: -1.2,
                                height: 1.1,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Where every meal tells a story',
                              style: TextStyle(
                                color: const Color(0xFF6B7280),
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                letterSpacing: -0.2,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        // Search Bar with Animation
                        GestureDetector(
                          onTap: () {
                            // Unfocus search when tapping outside
                            _searchFocusNode.unfocus();
                            setState(() {
                              _isSearchFocused = false;
                            });
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            height: 60,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: _isSearchFocused
                                      ? const Color(0xFFFF0000).withOpacity(0.1)
                                      : Colors.black.withOpacity(0.08),
                                  blurRadius: _isSearchFocused ? 25 : 15,
                                  spreadRadius: _isSearchFocused ? 2 : 0,
                                  offset: _isSearchFocused
                                      ? const Offset(0, 8)
                                      : const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: TextField(
                              controller: _searchController,
                              focusNode: _searchFocusNode,
                              onTap: () {
                                setState(() {
                                  _isSearchFocused = true;
                                });
                              },
                              onEditingComplete: () {
                                setState(() {
                                  _isSearchFocused = false;
                                });
                              },
                              onChanged: (value) {
                                setState(() {
                                  _searchQuery = value;
                                });
                              },
                              decoration: InputDecoration(
                                hintText: _currentHint,
                                hintStyle: const TextStyle(
                                  color: Color(0xFF9CA3AF),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w400,
                                ),
                                prefixIcon: Icon(
                                  Icons.search_rounded,
                                  color: _isSearchFocused
                                      ? const Color(0xFFFF0000)
                                      : const Color(0xFF1A1A1A),
                                  size: 24,
                                ),
                                suffixIcon: Container(
                                  margin: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(
                                      0xFFFF0000,
                                    ).withOpacity(0.05),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: IconButton(
                                    icon: const Icon(
                                      Icons.tune_rounded,
                                      color: Color(0xFFFF0000),
                                      size: 20,
                                    ),
                                    onPressed: _showFilterSheet,
                                  ),
                                ),
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 18,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        // Category Chips
                        SizedBox(
                          height: 40,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _categories.length,
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            itemBuilder: (context, index) {
                              final category = _categories[index];
                              final isSelected = _selectedCategory == category;
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 4,
                                ),
                                child: ChoiceChip(
                                  label: Text(category),
                                  selected: isSelected,
                                  showCheckmark: false,
                                  onSelected: (selected) {
                                    setState(() {
                                      _selectedCategory = selected
                                          ? category
                                          : 'All';
                                    });
                                    if (selected && category == 'Near Me') {
                                      _handleNearMeSelection();
                                    }
                                  },
                                  selectedColor: const Color(0xFFFF0000),
                                  labelStyle: TextStyle(
                                    color: isSelected
                                        ? Colors.white
                                        : const Color(0xFF4B5563),
                                    fontWeight: isSelected
                                        ? FontWeight.w700
                                        : FontWeight.w500,
                                    fontSize: 13,
                                  ),
                                  backgroundColor: const Color(0xFFF3F4F6),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 8,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    side: BorderSide(
                                      color: isSelected
                                          ? const Color(0xFFFF0000)
                                          : Colors.transparent,
                                      width: 1,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          // Scrollable Card List
          Expanded(
            child: RefreshIndicator(
              onRefresh: _refreshData,
              child: _isLoading || _isGettingLocation
                  ? ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.4,
                          child: const Center(child: FoodLoading(size: 80)),
                        ),
                      ],
                    )
                  : _filteredSpots.isEmpty
                  ? ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [_buildEmptyState()],
                    )
                  : ListView.builder(
                      controller: _scrollController,
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.only(
                        left: 8.0,
                        right: 8.0,
                        top: 8.0,
                        bottom: 140.0,
                      ),
                      itemCount: _filteredSpots.length,
                      itemBuilder: (context, index) {
                        final spot = _filteredSpots[index];
                        return GestureDetector(
                          onTap: () async {
                            await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => SpotDetailsPage(
                                  spot: spot,
                                  heroTag: '${spot['title']}_explore',
                                ),
                              ),
                            );
                            _fetchSpots(isSilent: true);
                          },
                          child: _buildSpotCard(spot),
                        );
                      },
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpotCard(Map<String, dynamic> spot) {
    final spotId = spot['id']?.toString();
    final bool isSaved = _savedSpots.contains(spotId);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          Row(
            children: [
              // Image Section
              Stack(
                children: [
                  Hero(
                    tag: '${spot['title']}_explore',
                    child: ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(24),
                        bottomLeft: Radius.circular(24),
                      ),
                      child: ImageHelper.loadImage(
                        spot['image'] ?? '',
                        width: 130,
                        height: 150,
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
                        color: Colors.white.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.star_rounded,
                            color: Color(0xFFFFD700),
                            size: 14,
                          ),
                          const SizedBox(width: 2),
                          Text(
                            spot['rating']?.toString() ?? '0.0',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              // Details Section
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        spot['title'] ?? 'Unknown Spot',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1A1A1A),
                          letterSpacing: -0.5,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      // Location & Distance
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_rounded,
                            size: 14,
                            color: Color(0xFFFF0000),
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              spot.containsKey('distance')
                                  ? '${spot['distance'].toStringAsFixed(1)} km away'
                                  : (spot['location'] ?? ''),
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Price and Status
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '₹ ${spot['averageCost'] ?? 0}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFFF0000),
                            ),
                          ),
                          _buildStatusIndicator(
                            spot['isOpen'] ?? true,
                            spot['status'] ?? 'approved',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          // Favorite Button
          Positioned(
            top: 12,
            right: 12,
            child: GestureDetector(
              onTap: () async {
                if (spotId == null) return;
                try {
                  final isNowFav = await FavoriteService.toggleFavorite(spotId);
                  if (mounted) {
                    setState(() {
                      if (isNowFav) {
                        _savedSpots.add(spotId);
                      } else {
                        _savedSpots.remove(spotId);
                      }
                    });
                    NotificationService.show(
                      message: isNowFav ? 'Saved' : 'Removed',
                      type: NotificationType.success,
                    );
                  }
                } catch (e) {
                  debugPrint('Failed to toggle favorite: $e');
                }
              },
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.9),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: Icon(
                  isSaved
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                  size: 20,
                  color: const Color(0xFFFF0000),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          width: double.infinity,
          height: MediaQuery.of(context).size.height * 0.6,
          padding: const EdgeInsets.only(top: 40, bottom: 40),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // The image container
                SizedBox(
                  width: 320,
                  height: 320,
                  child: Image.asset(
                    'assets/images/empty_search.png',
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return const Icon(
                        Icons.search_off_rounded,
                        size: 100,
                        color: Color(0xFFFF0000),
                      );
                    },
                  ),
                ),
                Transform.translate(
                  offset: const Offset(0, -60),
                  child: Column(
                    children: [
                      const Text(
                        'No Spots Found',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1A1A1A),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Try adjusting your search criteria\nor select a different category.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 32),
                      // Only Clear Filters Button, nothing below
                      TextButton(
                        onPressed: _clearAllFilters,
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                          backgroundColor: const Color(
                            0xFFFF0000,
                          ).withOpacity(0.1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: const Text(
                          'Clear Filters',
                          style: TextStyle(
                            color: Color(0xFFFF0000),
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
