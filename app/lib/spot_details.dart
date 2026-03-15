import 'dart:async';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'services/notification_service.dart';
import 'services/image_helper.dart';
import 'services/favorite_service.dart';
import 'services/review_service.dart';
import 'services/feature_service.dart';
import 'services/visit_service.dart';
import 'services/spot_status_service.dart';
import 'services/suggestion_service.dart';
import 'supabase_config.dart';
import 'services/auth_gate.dart';

class SpotDetailsPage extends StatefulWidget {
  final Map<String, dynamic> spot;
  final String? heroTag;
  final String? highlightReviewId;

  const SpotDetailsPage({
    super.key,
    required this.spot,
    this.heroTag,
    this.highlightReviewId,
  });

  @override
  State<SpotDetailsPage> createState() => _SpotDetailsPageState();
}

class _SpotDetailsPageState extends State<SpotDetailsPage>
    with SingleTickerProviderStateMixin {
  late PageController _imageController;
  late AnimationController _highlightController;
  int _currentImageIndex = 0;
  bool _isSaved = false;
  bool _isVisited = false;
  bool _isImagesPaused = false;
  Timer? _carouselTimer;

  bool _showReviewsModal = false;
  String? _highlightedReviewId;
  final Map<String, GlobalKey> _reviewKeys = {};
  bool _showFeaturesModal = false;
  bool _showSocialModal = false;
  List<Map<String, dynamic>> _reviews = [];
  bool _isLoadingReviews = false;
  double _selectedRating = 0; // Start with 0
  bool _isReviewStep2 = false;
  bool _hasReviewed = false;
  bool _isEditing = false;
  String? _editingReviewId;
  final TextEditingController _reviewController = TextEditingController();
  final TextEditingController _suggestionController = TextEditingController();
  bool _isSubmittingSuggestion = false;

  double get _averageRating {
    if (_reviews.isEmpty)
      return (widget.spot['rating'] as num?)?.toDouble() ?? 5.0;
    final total = _reviews.fold<double>(
      0,
      (sum, r) => sum + (r['rating'] as num).toDouble(),
    );
    return total / _reviews.length;
  }

  bool _isSpotOpen(
    String? openStr,
    String? closeStr, {
    bool is24Hours = false,
  }) {
    return SpotStatusService.isSpotOpen(
      openStr,
      closeStr,
      is24Hours: is24Hours,
    );
  }

  IconData _getFeatureIcon(String feature) {
    final iconName = FeatureService.getIconName(feature);
    return FeatureService.getIconData(iconName);
  }

  Future<void> _scrollToReview(String reviewId) async {
    // Wait for the modal/list to be built
    await Future.delayed(const Duration(milliseconds: 600));
    final key = _reviewKeys[reviewId];
    if (key != null && key.currentContext != null) {
      Scrollable.ensureVisible(
        key.currentContext!,
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _loadReviews() async {
    final spotId = widget.spot['id'];
    if (spotId == null) return;

    setState(() => _isLoadingReviews = true);
    final reviews = await ReviewService.fetchReviewsForSpot(spotId);
    if (mounted) {
      setState(() {
        _reviews = reviews;
        _isLoadingReviews = false;
      });

      // If we have a highlight ID, scroll to it after loading
      if (widget.highlightReviewId != null) {
        _scrollToReview(widget.highlightReviewId!);
      }
    }
  }

  Future<void> _toggleReviewLike(int index) async {
    if (!await AuthGate.check(context,
        message: 'Sign in to like reviews!')) return;
    final review = _reviews[index];
    final reviewId = review['id'];
    if (reviewId == null) return;

    final result = await ReviewService.toggleLike(
      reviewId,
      review['isLiked'] ?? false,
    );

    if (result != null && mounted) {
      setState(() {
        _reviews[index]['isLiked'] = result['isLiked'];
        _reviews[index]['likes'] =
            (_reviews[index]['likes'] ?? 0) + result['change'];
      });
    }
  }

  Future<void> _deleteReview(int index) async {
    final review = _reviews[index];
    final reviewId = review['id'];
    if (reviewId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Review'),
        content: const Text('Are you sure you want to delete your review?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await ReviewService.deleteReview(reviewId);
      if (success && mounted) {
        NotificationService.show(
          message: 'Review deleted',
          type: NotificationType.success,
        );
        _loadReviews();
        _checkReviewedStatus(); // Allow user to review again
      }
    }
  }

  void _editReview(Map<String, dynamic> review) {
    setState(() {
      _selectedRating = (review['rating'] as num).toDouble();
      _reviewController.text = review['comment'] ?? '';
      _isReviewStep2 = false;
      _isEditing = true;
      _editingReviewId = review['id'];
      _hasReviewed = false;
    });
  }

  void _showSuggestEditDialog() async {
    if (!await AuthGate.check(context, message: 'Sign in to suggest edits and help the community!')) return;
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.5),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag Handle
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),

                  // Header
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.indigo.shade50,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(
                            Icons.edit_note_rounded,
                            color: Colors.indigo.shade600,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Suggest Edits',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF1E293B),
                                  letterSpacing: -0.5,
                                ),
                              ),
                              Text(
                                'Help us improve this spot',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: Icon(Icons.close_rounded, color: Colors.grey.shade400),
                        ),
                      ],
                    ),
                  ),

                  const Divider(height: 1),

                  // Content
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Description of changes',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFFE2E8F0),
                              width: 1.5,
                            ),
                          ),
                          child: TextField(
                            controller: _suggestionController,
                            maxLines: 4,
                            autofocus: true,
                            onChanged: (val) => setModalState(() {}),
                            style: const TextStyle(
                              fontSize: 15,
                              color: Color(0xFF0F172A),
                              height: 1.5,
                            ),
                            decoration: InputDecoration(
                              hintText: 'What should be corrected or added?',
                              hintStyle: TextStyle(
                                color: Colors.grey.shade400,
                                fontSize: 14,
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.all(20),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Icon(Icons.verified_user_outlined, size: 16, color: Colors.green.shade600),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Your contribution helps the community.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.green.shade700,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),

                        // Action Button
                        GestureDetector(
                          onTap: _isSubmittingSuggestion
                              ? null
                              : () async {
                                  final text = _suggestionController.text.trim();
                                  if (text.isNotEmpty) {
                                    setModalState(() => _isSubmittingSuggestion = true);
                                    final success = await SuggestionService.submitSuggestion(
                                      spotId: widget.spot['id'].toString(),
                                      suggestion: text,
                                    );
                                    if (mounted) {
                                      setModalState(() => _isSubmittingSuggestion = false);
                                      if (success) {
                                        NotificationService.show(
                                          message: 'Suggestion sent! Thank you.',
                                          type: NotificationType.success,
                                        );
                                        Navigator.pop(context);
                                        _suggestionController.clear();
                                      } else {
                                        NotificationService.show(
                                          message: 'Failed to send suggestion.',
                                          type: NotificationType.error,
                                        );
                                      }
                                    }
                                  } else {
                                    NotificationService.show(
                                      message: 'Please describe the changes',
                                      type: NotificationType.error,
                                    );
                                  }
                                },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            height: 56,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: _isSubmittingSuggestion
                                    ? [Colors.grey.shade300, Colors.grey.shade400]
                                    : [const Color(0xFF6366F1), const Color(0xFF4F46E5)],
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                              ),
                              borderRadius: BorderRadius.circular(18),
                              boxShadow: [
                                if (!_isSubmittingSuggestion)
                                  BoxShadow(
                                    color: Colors.indigo.withOpacity(0.2),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                              ],
                            ),
                            child: Center(
                              child: _isSubmittingSuggestion
                                  ? const SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      'Send Suggestion',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 0.2,
                                      ),
                                    ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _startCarouselTimer() {
    _carouselTimer?.cancel();
    final List<String> images =
        widget.spot['images'] != null &&
            (widget.spot['images'] as List).isNotEmpty
        ? List<String>.from(widget.spot['images'] as List)
        : [widget.spot['image'] ?? 'assets/images/land.png'];

    if (images.length <= 1) return;

    _carouselTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (!_isImagesPaused && mounted) {
        if (_imageController.hasClients) {
          _imageController.nextPage(
            duration: const Duration(milliseconds: 800),
            curve: Curves.easeInOutCubic,
          );
        }
      }
    });
  }

  @override
  void initState() {
    super.initState();
    FeatureService.initialize().then((_) {
      if (mounted) setState(() {});
    });

    _highlightController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    if (widget.highlightReviewId != null) {
      _showReviewsModal = true;
      _highlightedReviewId = widget.highlightReviewId;
      _highlightController.repeat(reverse: true);
      // Stop blinking and clear highlight after 4 seconds
      Timer(const Duration(seconds: 4), () {
        if (mounted) {
          _highlightController.stop();
          setState(() => _highlightedReviewId = null);
        }
      });
    }

    _loadReviews();
    final List<String> images =
        widget.spot['images'] != null &&
            (widget.spot['images'] as List).isNotEmpty
        ? List<String>.from(widget.spot['images'] as List)
        : [widget.spot['image'] ?? 'assets/images/land.png'];

    // Start in the middle of a very large count to allow "infinite" swiping both ways
    _imageController = PageController(initialPage: images.length * 100);
    // Only auto-swipe when there are multiple images
    if (images.length > 1) {
      _startCarouselTimer();
    }

    _checkInitialFavorite();
    _checkReviewedStatus();
    _checkInitialVisit();
  }

  Future<void> _checkReviewedStatus() async {
    final spotId = widget.spot['id'];
    if (spotId == null) return;

    final reviewed = await ReviewService.hasUserReviewedSpot(spotId);
    if (mounted) {
      setState(() => _hasReviewed = reviewed);
    }
  }

  Future<void> _checkInitialFavorite() async {
    final isFav = await FavoriteService.isFavorite(widget.spot['id']);
    if (mounted) {
      setState(() => _isSaved = isFav);
    }
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _highlightController.dispose();
    _imageController.dispose();
    _reviewController.dispose();
    _suggestionController.dispose();
    super.dispose();
  }

  Future<void> _checkInitialVisit() async {
    final visited = await VisitService.isVisited(widget.spot['id']);
    if (mounted) {
      setState(() => _isVisited = visited);
    }
  }

  Future<void> _toggleSaved() async {
    if (!await AuthGate.check(context, message: 'Sign in to save your favorite spots!')) return;
    
    final spotId = widget.spot['id']?.toString();
    print('DEBUG: Details bookmark tapped for spot: $spotId');
    if (spotId == null) return;

    try {
      final isNowFav = await FavoriteService.toggleFavorite(spotId);
      print('DEBUG: Details toggle result: $isNowFav');

      if (mounted) {
        setState(() => _isSaved = isNowFav);
        NotificationService.show(
          message: isNowFav ? 'Saved to favorites' : 'Removed from favorites',
          type: NotificationType.success,
        );
      }
    } catch (e) {
      debugPrint('DEBUG: Failed to toggle favorite: $e');
    }
  }

  Future<void> _toggleVisited() async {
    if (!await AuthGate.check(context, message: 'Sign in to track your visits!')) return;
    
    final spotId = widget.spot['id']?.toString();
    if (spotId == null) return;

    final isNowVisited = await VisitService.toggleVisit(spotId);
    if (mounted) {
      setState(() => _isVisited = isNowVisited);
      NotificationService.show(
        message: isNowVisited ? 'Marked as visited' : 'Removed from visited',
        type: NotificationType.success,
      );
    }
  }

  Future<void> _openDirections() async {
    if (!await AuthGate.canUseDirections(context)) return;

    final lat = widget.spot['latitude'];
    final lng = widget.spot['longitude'];

    if (lat != null && lng != null) {
      // List of URIs to try in order of preference
      final List<Uri> mapUris = [
        // 1. Android Specific Google Maps Navigation
        Uri.parse('google.navigation:q=$lat,$lng'),
        // 2. Universal Google Maps URL (Browser/App)
        Uri.parse(
          'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng',
        ),
        // 3. Apple Maps
        Uri.parse('https://maps.apple.com/?daddr=$lat,$lng'),
        // 4. Generic App Geo Link
        Uri.parse('geo:$lat,$lng'),
      ];

      bool launched = false;
      for (final uri in mapUris) {
        try {
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
            launched = true;
            break;
          }
        } catch (e) {
          debugPrint('Failed to launch entry $uri: $e');
        }
      }

      if (!launched) {
        // Ultimate fallback: Just try to launch the maps URL directly without canLaunch check
        // Some devices fail canLaunch but still launch successfully
        try {
          final fallbackUrl = Uri.parse(
            'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng',
          );
          await launchUrl(fallbackUrl, mode: LaunchMode.externalApplication);
        } catch (e) {
          NotificationService.show(
            message: 'Could not open map app. Please ensure one is installed.',
            type: NotificationType.error,
          );
        }
      }
    } else {
      NotificationService.show(
        message: 'Location coordinates not available',
        type: NotificationType.error,
      );
    }
  }

  Future<void> _submitReview() async {
    if (!await AuthGate.check(context, message: 'Sign in to share your experience with others!')) return;
    
    final content = _reviewController.text.trim();
    if (content.isEmpty) return;

    final spotId = widget.spot['id'];
    if (spotId == null) return;

    bool success = false;
    if (_isEditing && _editingReviewId != null) {
      success = await ReviewService.updateReview(
        reviewId: _editingReviewId!,
        content: content,
        rating: _selectedRating,
      );
    } else {
      final result = await ReviewService.addReview(
        spotId: spotId,
        content: content,
        rating: _selectedRating,
      );
      success = result != null;
    }

    if (success) {
      _reviewController.clear();
      setState(() {
        final wasEditing = _isEditing;
        _selectedRating = 0;
        _isReviewStep2 = false;
        _hasReviewed = true;
        _isEditing = false;
        _editingReviewId = null;

        NotificationService.show(
          message: wasEditing
              ? 'Review updated!'
              : 'Review added successfully!',
          type: NotificationType.success,
        );
      });
      await _loadReviews();
    }
  }

  @override
  Widget build(BuildContext context) {
    final spot = widget.spot;
    final List<String> specialDishes =
        spot['specialDishes'] != null &&
            (spot['specialDishes'] as List).isNotEmpty
        ? List<String>.from(spot['specialDishes'] as List)
        : const [];
    final List<String> features =
        spot['features'] != null && (spot['features'] as List).isNotEmpty
        ? List<String>.from(spot['features'] as List)
        : const [];
    final List<String> images =
        spot['images'] != null && (spot['images'] as List).isNotEmpty
        ? List<String>.from(spot['images'] as List)
        : [spot['image'] ?? 'assets/images/land.png'];

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 350,
                pinned: true,
                backgroundColor: Colors.white,
                elevation: 0,
                leading: GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    margin: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.3),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
                actions: [
                  GestureDetector(
                    onTap: _toggleSaved,
                    child: Container(
                      margin: const EdgeInsets.all(8),
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isSaved
                            ? Icons.bookmark_rounded
                            : Icons.bookmark_border_rounded,
                        color: Colors.white,
                        size: 22,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      // Image Carousel
                      Container(
                        height: 380,
                        width: double.infinity,
                        decoration: const BoxDecoration(
                          borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(32),
                            bottomRight: Radius.circular(32),
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(32),
                            bottomRight: Radius.circular(32),
                          ),
                          child: GestureDetector(
                            onTap: images.length > 1
                                ? () {
                                    setState(() {
                                      _isImagesPaused = !_isImagesPaused;
                                    });
                                  }
                                : null,
                            child: Stack(
                              children: [
                                PageView.builder(
                                  controller: _imageController,
                                  physics: images.length > 1
                                      ? const BouncingScrollPhysics()
                                      : const NeverScrollableScrollPhysics(),
                                  onPageChanged: (index) {
                                    setState(() {
                                      _currentImageIndex =
                                          index % images.length;
                                    });
                                    if (images.length > 1) {
                                      _startCarouselTimer();
                                    }
                                  },
                                  itemCount: 10000,
                                  itemBuilder: (context, index) {
                                    final realIndex = index % images.length;
                                    return Container(
                                      width: double.infinity,
                                      child: realIndex == 0
                                          ? Hero(
                                              tag:
                                                  widget.heroTag ??
                                                  (spot['title'] ?? 'Spot'),
                                              child: ImageHelper.loadImage(
                                                images[realIndex],
                                                fit: BoxFit.cover,
                                              ),
                                            )
                                          : ImageHelper.loadImage(
                                              images[realIndex],
                                              fit: BoxFit.cover,
                                            ),
                                    );
                                  },
                                ),
                                if (images.length > 1)
                                  Positioned(
                                    top: 12,
                                    right: 12,
                                    child: AnimatedOpacity(
                                      opacity: _isImagesPaused ? 1.0 : 0.0,
                                      duration: const Duration(
                                        milliseconds: 200,
                                      ),
                                      child: Container(
                                        padding: const EdgeInsets.all(6),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withOpacity(0.4),
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                        ),
                                        child: const Icon(
                                          Icons.pause_rounded,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                if (images.length > 1)
                                  Positioned(
                                    bottom: 12,
                                    left: 0,
                                    right: 0,
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: List.generate(images.length, (
                                        index,
                                      ) {
                                        return AnimatedContainer(
                                          duration: const Duration(
                                            milliseconds: 300,
                                          ),
                                          width: _currentImageIndex == index
                                              ? 24
                                              : 8,
                                          height: 8,
                                          margin: const EdgeInsets.symmetric(
                                            horizontal: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                            color: _currentImageIndex == index
                                                ? Colors.white
                                                : Colors.white.withOpacity(0.5),
                                            boxShadow: [
                                              if (_currentImageIndex == index)
                                                BoxShadow(
                                                  color: Colors.black
                                                      .withOpacity(0.2),
                                                  blurRadius: 4,
                                                  offset: const Offset(0, 2),
                                                ),
                                            ],
                                          ),
                                        );
                                      }),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 40.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Title and Rating
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        spot['title'] ?? 'Spot',
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF111827),
                                          letterSpacing: -0.5,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      GestureDetector(
                                        onTap: _openDirections,
                                        child: Row(
                                          children: [
                                            const Icon(
                                              Icons.location_on_rounded,
                                              size: 16,
                                              color: Color(0xFF6B7280),
                                            ),
                                            const SizedBox(width: 4),
                                            Expanded(
                                              child: Text(
                                                spot['location'] ?? 'Location',
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w500,
                                                  color: Color(0xFF6B7280),
                                                  height: 1.2,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 10,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFFF59E0B),
                                        Color(0xFFD97706),
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(
                                          0xFFF59E0B,
                                        ).withOpacity(0.2),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.star_rounded,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        _averageRating.toStringAsFixed(1),
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            // Status Chip
                            Builder(
                              builder: (context) {
                                final isOpen = _isSpotOpen(
                                  spot['openingTime'] ?? spot['opening_time'],
                                  spot['closingTime'] ?? spot['closing_time'],
                                  is24Hours: spot['is_24_hours'] ?? false,
                                );
                                final statusStr = isOpen
                                    ? (spot['is_24_hours'] == true
                                          ? 'Open 24/7'
                                          : 'Open Now')
                                    : 'Closed';
                                return Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isOpen
                                        ? const Color(
                                            0xFFD1FAE5,
                                          ).withOpacity(0.6)
                                        : const Color(
                                            0xFFFEE2E2,
                                          ).withOpacity(0.6),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: isOpen
                                          ? const Color(
                                              0xFF10B981,
                                            ).withOpacity(0.2)
                                          : const Color(
                                              0xFFEF4444,
                                            ).withOpacity(0.2),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: isOpen
                                              ? const Color(0xFF10B981)
                                              : const Color(0xFFEF4444),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        statusStr,
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: isOpen
                                              ? const Color(0xFF065F46)
                                              : const Color(0xFF991B1B),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 32),
                            // Modular Hub Grid
                            GridView.count(
                              padding: EdgeInsets.zero,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              crossAxisCount: 2,
                              mainAxisSpacing: 16,
                              crossAxisSpacing: 16,
                              childAspectRatio: 1.3,
                              children: [
                                _buildHubCard(
                                  title: 'Special Menu',
                                  subtitle: 'Explore dishes',
                                  icon: Icons.restaurant_menu_rounded,
                                  color: const Color(0xFFE11D48),
                                  onTap: () => _showDishesPopup(specialDishes),
                                ),
                                _buildHubCard(
                                  title: 'Reviews',
                                  subtitle: '${_reviews.length} Experiences',
                                  icon: Icons.reviews_rounded,
                                  color: const Color(0xFF3B82F6),
                                  onTap: () =>
                                      setState(() => _showReviewsModal = true),
                                ),
                                _buildHubCard(
                                  title: 'Features',
                                  subtitle: 'WiFi, AC & more',
                                  icon: Icons.grid_view_rounded,
                                  color: const Color(0xFFF59E0B),
                                  onTap: () =>
                                      setState(() => _showFeaturesModal = true),
                                ),
                                _buildHubCard(
                                  title: 'Interact',
                                  subtitle: 'Social & Actions',
                                  icon: Icons.bolt_rounded,
                                  color: const Color(0xFF8B5CF6),
                                  onTap: () =>
                                      setState(() => _showSocialModal = true),
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),
                            // About Section (Core)
                            const Text(
                              'About',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF111827),
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              spot['description'] ??
                                  'Explore the unique offerings of this amazing spot.',
                              style: TextStyle(
                                fontSize: 15,
                                color: const Color(0xFF4B5563).withOpacity(0.9),
                                height: 1.7,
                                letterSpacing: 0.1,
                              ),
                            ),
                            const SizedBox(height: 40),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          if (_showReviewsModal)
            GestureDetector(
              onTap: () => setState(() => _showReviewsModal = false),
              child: Container(
                color: Colors.black.withOpacity(0.5),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: GestureDetector(
                    onTap: () {},
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeOut,
                      height: MediaQuery.of(context).size.height * 0.85,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(32),
                          topRight: Radius.circular(32),
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            margin: const EdgeInsets.only(top: 12),
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E7EB),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
                            child: Row(
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Reviews',
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF111827),
                                      ),
                                    ),
                                    Text(
                                      '${_reviews.length} Experiences shared',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Color(0xFF6B7280),
                                      ),
                                    ),
                                  ],
                                ),
                                const Spacer(),
                                IconButton(
                                  onPressed: () =>
                                      setState(() => _showReviewsModal = false),
                                  icon: const Icon(Icons.close),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: _isLoadingReviews
                                ? const Center(
                                    child: CircularProgressIndicator(
                                      color: Color(0xFFFF0000),
                                    ),
                                  )
                                : _reviews.isEmpty
                                ? Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.rate_review_outlined,
                                          size: 64,
                                          color: Colors.grey[300],
                                        ),
                                        const SizedBox(height: 16),
                                        Text(
                                          'No reviews yet',
                                          style: TextStyle(
                                            fontSize: 16,
                                            color: Colors.grey[500],
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                : ListView.builder(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 24,
                                    ),
                                    itemCount: _reviews.length,
                                    itemBuilder: (context, index) {
                                      final review = _reviews[index];
                                      final reviewId = review['id']?.toString();

                                      // Create or get the GlobalKey for this review
                                      if (reviewId != null &&
                                          !_reviewKeys.containsKey(reviewId)) {
                                        _reviewKeys[reviewId] = GlobalKey();
                                      }

                                      final isHighlighted =
                                          reviewId == _highlightedReviewId;

                                      return AnimatedBuilder(
                                        animation: _highlightController,
                                        builder: (context, child) {
                                          final pulseValue = isHighlighted
                                              ? _highlightController.value
                                              : 0.0;
                                          return Container(
                                            key: reviewId != null
                                                ? _reviewKeys[reviewId]
                                                : null,
                                            margin: const EdgeInsets.only(
                                              bottom: 20,
                                            ),
                                            padding: const EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              color: isHighlighted
                                                  ? const Color(
                                                      0xFFFFF1F2,
                                                    ).withOpacity(
                                                      0.4 + (pulseValue * 0.5),
                                                    )
                                                  : const Color(0xFFF9FAFB),
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                              border: Border.all(
                                                color: isHighlighted
                                                    ? const Color(
                                                        0xFFFF0000,
                                                      ).withOpacity(
                                                        0.2 +
                                                            (pulseValue * 0.4),
                                                      )
                                                    : Colors.transparent,
                                                width: 1.5,
                                              ),
                                              boxShadow: isHighlighted
                                                  ? [
                                                      BoxShadow(
                                                        color:
                                                            const Color(
                                                              0xFFFF0000,
                                                            ).withOpacity(
                                                              0.05 +
                                                                  (pulseValue *
                                                                      0.1),
                                                            ),
                                                        blurRadius: 10,
                                                        spreadRadius: 2,
                                                      ),
                                                    ]
                                                  : null,
                                            ),
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    CircleAvatar(
                                                      backgroundColor:
                                                          const Color(
                                                            0xFFE5E7EB,
                                                          ),
                                                      radius: 18,
                                                      backgroundImage:
                                                          (review['avatar'] !=
                                                                  null &&
                                                              review['avatar']
                                                                  .toString()
                                                                  .startsWith(
                                                                    'http',
                                                                  ))
                                                          ? NetworkImage(
                                                              review['avatar'],
                                                            )
                                                          : null,
                                                      child:
                                                          (review['avatar'] ==
                                                                  null ||
                                                              !review['avatar']
                                                                  .toString()
                                                                  .startsWith(
                                                                    'http',
                                                                  ))
                                                          ? Text(
                                                              review['userName']?[0] ??
                                                                  'U',
                                                              style: const TextStyle(
                                                                fontSize: 12,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                                color: Color(
                                                                  0xFF374151,
                                                                ),
                                                              ),
                                                            )
                                                          : null,
                                                    ),
                                                    const SizedBox(width: 12),
                                                    Expanded(
                                                      child: Column(
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        children: [
                                                          Text(
                                                            review['userName'] ??
                                                                'User',
                                                            style:
                                                                const TextStyle(
                                                                  fontSize: 15,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w700,
                                                                  color: Color(
                                                                    0xFF111827,
                                                                  ),
                                                                ),
                                                          ),
                                                          Text(
                                                            review['date'] ??
                                                                'Just now',
                                                            style:
                                                                const TextStyle(
                                                                  fontSize: 12,
                                                                  color: Color(
                                                                    0xFF9CA3AF,
                                                                  ),
                                                                ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                    Row(
                                                      children: [
                                                        ...List.generate(
                                                          5,
                                                          (i) => Icon(
                                                            Icons.star_rounded,
                                                            size: 16,
                                                            color:
                                                                i <
                                                                    (review['rating'] ??
                                                                        5)
                                                                ? const Color(
                                                                    0xFFF59E0B,
                                                                  )
                                                                : const Color(
                                                                    0xFFE5E7EB,
                                                                  ),
                                                          ),
                                                        ),
                                                        if (review['user_id'] ==
                                                            SupabaseConfig
                                                                .currentUserId) ...[
                                                          const SizedBox(
                                                            width: 4,
                                                          ),
                                                          PopupMenuButton<
                                                            String
                                                          >(
                                                            padding:
                                                                EdgeInsets.zero,
                                                            elevation: 8,
                                                            offset:
                                                                const Offset(
                                                                  0,
                                                                  42,
                                                                ),
                                                            shape: RoundedRectangleBorder(
                                                              borderRadius:
                                                                  BorderRadius.circular(
                                                                    20,
                                                                  ),
                                                              side: const BorderSide(
                                                                color: Color(
                                                                  0xFFF3F4F6,
                                                                ),
                                                                width: 1,
                                                              ),
                                                            ),
                                                            color: Colors.white,
                                                            onSelected: (value) {
                                                              if (value ==
                                                                  'edit') {
                                                                _editReview(
                                                                  review,
                                                                );
                                                              } else if (value ==
                                                                  'delete') {
                                                                _deleteReview(
                                                                  index,
                                                                );
                                                              }
                                                            },
                                                            itemBuilder: (context) => [
                                                              PopupMenuItem(
                                                                value: 'edit',
                                                                height: 48,
                                                                child: Row(
                                                                  children: [
                                                                    Container(
                                                                      padding:
                                                                          const EdgeInsets.all(
                                                                            8,
                                                                          ),
                                                                      decoration: BoxDecoration(
                                                                        color: const Color(
                                                                          0xFFEFF6FF,
                                                                        ),
                                                                        borderRadius:
                                                                            BorderRadius.circular(
                                                                              10,
                                                                            ),
                                                                      ),
                                                                      child: const Icon(
                                                                        Icons
                                                                            .edit_rounded,
                                                                        size:
                                                                            14,
                                                                        color: Color(
                                                                          0xFF2563EB,
                                                                        ),
                                                                      ),
                                                                    ),
                                                                    const SizedBox(
                                                                      width: 12,
                                                                    ),
                                                                    const Text(
                                                                      'Edit',
                                                                      style: TextStyle(
                                                                        fontSize:
                                                                            14,
                                                                        fontWeight:
                                                                            FontWeight.w600,
                                                                        color: Color(
                                                                          0xFF1F2937,
                                                                        ),
                                                                      ),
                                                                    ),
                                                                  ],
                                                                ),
                                                              ),
                                                              PopupMenuItem(
                                                                value: 'delete',
                                                                height: 48,
                                                                child: Row(
                                                                  children: [
                                                                    Container(
                                                                      padding:
                                                                          const EdgeInsets.all(
                                                                            8,
                                                                          ),
                                                                      decoration: BoxDecoration(
                                                                        color: const Color(
                                                                          0xFFFEF2F2,
                                                                        ),
                                                                        borderRadius:
                                                                            BorderRadius.circular(
                                                                              10,
                                                                            ),
                                                                      ),
                                                                      child: const Icon(
                                                                        Icons
                                                                            .delete_outline_rounded,
                                                                        size:
                                                                            14,
                                                                        color: Color(
                                                                          0xFFDC2626,
                                                                        ),
                                                                      ),
                                                                    ),
                                                                    const SizedBox(
                                                                      width: 12,
                                                                    ),
                                                                    const Text(
                                                                      'Delete',
                                                                      style: TextStyle(
                                                                        fontSize:
                                                                            14,
                                                                        fontWeight:
                                                                            FontWeight.w600,
                                                                        color: Color(
                                                                          0xFFDC2626,
                                                                        ),
                                                                      ),
                                                                    ),
                                                                  ],
                                                                ),
                                                              ),
                                                            ],
                                                            child: Icon(
                                                              Icons
                                                                  .more_vert_rounded,
                                                              size: 18,
                                                              color: Colors
                                                                  .grey[400],
                                                            ),
                                                          ),
                                                        ],
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                                if (review['comment'] !=
                                                    null) ...[
                                                  const SizedBox(height: 12),
                                                  Text(
                                                    review['comment'],
                                                    style: const TextStyle(
                                                      fontSize: 14,
                                                      color: Color(0xFF4B5563),
                                                      height: 1.5,
                                                    ),
                                                  ),
                                                ],
                                                const SizedBox(height: 12),
                                                Row(
                                                  children: [
                                                    const Spacer(),
                                                    const Text(
                                                      'Was this helpful?',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        color: Color(
                                                          0xFF9CA3AF,
                                                        ),
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                    const SizedBox(width: 8),
                                                    GestureDetector(
                                                      onTap: () =>
                                                          _toggleReviewLike(
                                                            index,
                                                          ),
                                                      child: Container(
                                                        padding:
                                                            const EdgeInsets.symmetric(
                                                              horizontal: 12,
                                                              vertical: 6,
                                                            ),
                                                        decoration: BoxDecoration(
                                                          color:
                                                              (review['isLiked'] ??
                                                                  false)
                                                              ? const Color(
                                                                  0xFFFFF1F2,
                                                                )
                                                              : const Color(
                                                                  0xFFF3F4F6,
                                                                ),
                                                          borderRadius:
                                                              BorderRadius.circular(
                                                                20,
                                                              ),
                                                        ),
                                                        child: Row(
                                                          children: [
                                                            Icon(
                                                              (review['isLiked'] ??
                                                                      false)
                                                                  ? Icons
                                                                        .favorite_rounded
                                                                  : Icons
                                                                        .favorite_border_rounded,
                                                              size: 14,
                                                              color:
                                                                  (review['isLiked'] ??
                                                                      false)
                                                                  ? const Color(
                                                                      0xFFE11D48,
                                                                    )
                                                                  : const Color(
                                                                      0xFF9CA3AF,
                                                                    ),
                                                            ),
                                                            const SizedBox(
                                                              width: 6,
                                                            ),
                                                            Text(
                                                              '${review['likes'] ?? 0}',
                                                              style: TextStyle(
                                                                fontSize: 12,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w700,
                                                                color:
                                                                    (review['isLiked'] ??
                                                                        false)
                                                                    ? const Color(
                                                                        0xFFE11D48,
                                                                      )
                                                                    : const Color(
                                                                        0xFF4B5563,
                                                                      ),
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          );
                                        },
                                      );
                                    },
                                  ),
                          ),
                          _hasReviewed
                              ? Container(
                                  width: double.infinity,
                                  padding: EdgeInsets.fromLTRB(
                                    24,
                                    16,
                                    24,
                                    MediaQuery.of(context).padding.bottom + 16,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.05),
                                        blurRadius: 10,
                                        offset: const Offset(0, -4),
                                      ),
                                    ],
                                  ),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 12,
                                      horizontal: 16,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF0FDF4),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(
                                        color: const Color(0xFFDCFCE7),
                                      ),
                                    ),
                                    child: const Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.check_circle_rounded,
                                          color: Color(0xFF16A34A),
                                          size: 18,
                                        ),
                                        SizedBox(width: 8),
                                        Text(
                                          'You have reviewed this spot',
                                          style: TextStyle(
                                            color: Color(0xFF166534),
                                            fontWeight: FontWeight.w600,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                )
                              : Container(
                                  padding: EdgeInsets.fromLTRB(
                                    24,
                                    16,
                                    24,
                                    MediaQuery.of(context).padding.bottom + 16,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.05),
                                        blurRadius: 10,
                                        offset: const Offset(0, -4),
                                      ),
                                    ],
                                  ),
                                  child: AnimatedSwitcher(
                                    duration: const Duration(milliseconds: 300),
                                    child: !_isReviewStep2
                                        ? Column(
                                            key: const ValueKey('step1'),
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Text(
                                                'Rate your experience',
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w700,
                                                  color: Color(0xFF111827),
                                                  letterSpacing: -0.3,
                                                ),
                                              ),
                                              const SizedBox(height: 12),
                                              Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: List.generate(
                                                  5,
                                                  (index) => GestureDetector(
                                                    onTap: () async {
                                                      if (!await AuthGate.check(
                                                        context,
                                                        message:
                                                            'Sign in to share your experience with others!',
                                                      )) return;
                                                      setState(
                                                        () => _selectedRating =
                                                            index + 1.0,
                                                      );
                                                    },
                                                    child: Padding(
                                                      padding:
                                                          const EdgeInsets.symmetric(
                                                            horizontal: 6,
                                                          ),
                                                      child: AnimatedScale(
                                                        scale:
                                                            (index <
                                                                _selectedRating)
                                                            ? 1.05
                                                            : 1.0,
                                                        duration:
                                                            const Duration(
                                                              milliseconds: 200,
                                                            ),
                                                        child: Icon(
                                                          Icons.star_rounded,
                                                          size: 40,
                                                          color:
                                                              (index <
                                                                  _selectedRating)
                                                              ? const Color(
                                                                  0xFFF59E0B,
                                                                )
                                                              : const Color(
                                                                  0xFFE5E7EB,
                                                                ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(height: 32),
                                              SizedBox(
                                                width: double.infinity,
                                                child: ElevatedButton(
                                                   onPressed: _selectedRating > 0
                                                      ? () async {
                                                          if (!await AuthGate
                                                              .check(
                                                            context,
                                                            message:
                                                                'Sign in to share your experience with others!',
                                                          )) return;
                                                          setState(
                                                            () =>
                                                                _isReviewStep2 =
                                                                    true,
                                                          );
                                                        }
                                                      : null,
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFFFF0000),
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding:
                                                        const EdgeInsets.symmetric(
                                                          vertical: 16,
                                                        ),
                                                    elevation: 0,
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            16,
                                                          ),
                                                    ),
                                                    disabledBackgroundColor:
                                                        const Color(0xFFF3F4F6),
                                                  ),
                                                  child: Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        _isEditing
                                                            ? 'Update Rating'
                                                            : 'Continue',
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.w700,
                                                          fontSize: 15,
                                                        ),
                                                      ),
                                                      const SizedBox(width: 6),
                                                      const Icon(
                                                        Icons
                                                            .arrow_forward_rounded,
                                                        size: 18,
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                        : Column(
                                            key: const ValueKey('step2'),
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                children: [
                                                  GestureDetector(
                                                    onTap: () => setState(
                                                      () => _isReviewStep2 =
                                                          false,
                                                    ),
                                                    child: Container(
                                                      padding:
                                                          const EdgeInsets.all(
                                                            6,
                                                          ),
                                                      decoration: BoxDecoration(
                                                        color: const Color(
                                                          0xFFF3F4F6,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius.circular(
                                                              10,
                                                            ),
                                                      ),
                                                      child: const Icon(
                                                        Icons
                                                            .arrow_back_ios_new_rounded,
                                                        size: 14,
                                                        color: Color(
                                                          0xFF4B5563,
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                  const SizedBox(width: 12),
                                                  const Text(
                                                    'Write a review',
                                                    style: TextStyle(
                                                      fontSize: 16,
                                                      fontWeight:
                                                          FontWeight.w700,
                                                      color: Color(0xFF111827),
                                                    ),
                                                  ),
                                                  const Spacer(),
                                                  Container(
                                                    padding:
                                                        const EdgeInsets.symmetric(
                                                          horizontal: 8,
                                                          vertical: 3,
                                                        ),
                                                    decoration: BoxDecoration(
                                                      color: const Color(
                                                        0xFFFFF7ED,
                                                      ),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            16,
                                                          ),
                                                    ),
                                                    child: Row(
                                                      children: [
                                                        const Icon(
                                                          Icons.star_rounded,
                                                          size: 12,
                                                          color: Color(
                                                            0xFFF59E0B,
                                                          ),
                                                        ),
                                                        const SizedBox(
                                                          width: 2,
                                                        ),
                                                        Text(
                                                          '${_selectedRating.toInt()}',
                                                          style:
                                                              const TextStyle(
                                                                fontSize: 11,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w700,
                                                                color: Color(
                                                                  0xFF92400E,
                                                                ),
                                                              ),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 16),
                                              Container(
                                                padding: const EdgeInsets.all(
                                                  12,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: const Color(
                                                    0xFFF3F4F6,
                                                  ),
                                                  borderRadius:
                                                      BorderRadius.circular(16),
                                                  border: Border.all(
                                                    color: const Color(
                                                      0xFFE5E7EB,
                                                    ),
                                                  ),
                                                ),
                                                child: TextField(
                                                  controller: _reviewController,
                                                  autofocus: true,
                                                  maxLines: 3,
                                                  style: const TextStyle(
                                                    fontSize: 14,
                                                    color: Color(0xFF1F2937),
                                                  ),
                                                  decoration: const InputDecoration(
                                                    hintText:
                                                        'Share your thoughts...',
                                                    border: InputBorder.none,
                                                    hintStyle: TextStyle(
                                                      fontSize: 13,
                                                      color: Color(0xFF9CA3AF),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(height: 16),
                                              SizedBox(
                                                width: double.infinity,
                                                child: ElevatedButton(
                                                  onPressed: () =>
                                                      _submitReview(),
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFFDC2626),
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding:
                                                        const EdgeInsets.symmetric(
                                                          vertical: 14,
                                                        ),
                                                    elevation: 0,
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            14,
                                                          ),
                                                    ),
                                                  ),
                                                  child: Text(
                                                    _isEditing
                                                        ? 'Update Review'
                                                        : 'Post',
                                                    style: const TextStyle(
                                                      fontWeight:
                                                          FontWeight.w700,
                                                      fontSize: 15,
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
                    ),
                  ),
                ),
              ),
            ),
          if (_showFeaturesModal)
            GestureDetector(
              onTap: () => setState(() => _showFeaturesModal = false),
              child: Container(
                color: Colors.black.withOpacity(0.5),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: GestureDetector(
                    onTap: () {},
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeOut,
                      height: MediaQuery.of(context).size.height * 0.45,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(32),
                          topRight: Radius.circular(32),
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            margin: const EdgeInsets.only(top: 12),
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E7EB),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(24, 20, 24, 20),
                            child: Row(
                              children: [
                                const Text(
                                  'Features',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                                const Spacer(),
                                IconButton(
                                  onPressed: () => setState(
                                    () => _showFeaturesModal = false,
                                  ),
                                  icon: const Icon(Icons.close),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: features.isEmpty
                                ? Center(
                                    child: Padding(
                                      padding: const EdgeInsets.all(32.0),
                                      child: Column(
                                        children: [
                                          Icon(
                                            Icons.grid_view_rounded,
                                            size: 48,
                                            color: const Color(0xFFE5E7EB),
                                          ),
                                          const SizedBox(height: 12),
                                          Text(
                                            'No specific features listed',
                                            style: TextStyle(
                                              color: const Color(0xFF9CA3AF),
                                              fontSize: 14,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  )
                                : Wrap(
                                    spacing: 12,
                                    runSpacing: 12,
                                    children: features.map((feature) {
                                      return _buildFeatureChip(
                                        _getFeatureIcon(feature),
                                        feature,
                                      );
                                    }).toList(),
                                  ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          if (_showSocialModal)
            GestureDetector(
              onTap: () => setState(() => _showSocialModal = false),
              child: Container(
                color: Colors.black.withOpacity(0.5),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: GestureDetector(
                    onTap: () {},
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeOut,
                      height: MediaQuery.of(context).size.height * 0.48,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(32),
                          topRight: Radius.circular(32),
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            margin: const EdgeInsets.only(top: 12),
                            width: 40,
                            height: 4,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E7EB),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(24, 20, 24, 10),
                            child: Row(
                              children: [
                                const Text(
                                  'Interact',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                                const Spacer(),
                                IconButton(
                                  onPressed: () =>
                                      setState(() => _showSocialModal = false),
                                  icon: const Icon(Icons.close),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: SingleChildScrollView(
                              padding: const EdgeInsets.fromLTRB(24, 4, 24, 24),
                              child: Column(
                                children: [
                                  _buildSocialButton(
                                    onTap: () async {
                                      final handle = spot['instagram'];
                                      if (handle == null || handle.isEmpty) {
                                        NotificationService.show(
                                          message:
                                              'Instagram link not available',
                                          type: NotificationType.info,
                                        );
                                        return;
                                      }

                                      String cleanHandle = handle.trim();
                                      if (cleanHandle.startsWith('@')) {
                                        cleanHandle = cleanHandle.substring(1);
                                      }

                                      final Uri instagramUrl =
                                          cleanHandle.startsWith('http')
                                          ? Uri.parse(cleanHandle)
                                          : Uri.parse(
                                              'https://www.instagram.com/$cleanHandle',
                                            );

                                      try {
                                        if (await canLaunchUrl(instagramUrl)) {
                                          await launchUrl(
                                            instagramUrl,
                                            mode:
                                                LaunchMode.externalApplication,
                                          );
                                        } else {
                                          NotificationService.show(
                                            message: 'Could not open Instagram',
                                            type: NotificationType.error,
                                          );
                                        }
                                      } catch (e) {
                                        NotificationService.show(
                                          message: 'Error opening Instagram',
                                          type: NotificationType.error,
                                        );
                                      }
                                    },
                                    icon: FontAwesomeIcons.instagram,
                                    color: const Color(0xFFE1306C),
                                    label: 'Follow on Instagram',
                                  ),
                                  const SizedBox(height: 12),
                                  _buildSocialButton(
                                    onTap: () async {
                                      final number = spot['whatsapp'];
                                      if (number == null || number.isEmpty) {
                                        NotificationService.show(
                                          message:
                                              'WhatsApp number not available',
                                          type: NotificationType.info,
                                        );
                                        return;
                                      }

                                      // Clean number: remove all non-digits
                                      String cleanNumber = number.replaceAll(
                                        RegExp(r'\D'),
                                        '',
                                      );
                                      // If number starts with 0 and is likely 10-digit Indian number, add 91
                                      if (cleanNumber.length == 10) {
                                        cleanNumber = '91$cleanNumber';
                                      }

                                      final Uri whatsappUrl = Uri.parse(
                                        'https://wa.me/$cleanNumber',
                                      );
                                      try {
                                        if (await canLaunchUrl(whatsappUrl)) {
                                          await launchUrl(
                                            whatsappUrl,
                                            mode:
                                                LaunchMode.externalApplication,
                                          );
                                        } else {
                                          NotificationService.show(
                                            message: 'Could not open WhatsApp',
                                            type: NotificationType.error,
                                          );
                                        }
                                      } catch (e) {
                                        NotificationService.show(
                                          message: 'Error opening WhatsApp',
                                          type: NotificationType.error,
                                        );
                                      }
                                    },
                                    icon: FontAwesomeIcons.whatsapp,
                                    color: const Color(0xFF25D366),
                                    label: 'Contact via WhatsApp',
                                  ),
                                  const SizedBox(height: 12),
                                  _buildSocialButton(
                                    onTap: _toggleVisited,
                                    icon: _isVisited
                                        ? Icons.visibility
                                        : Icons.visibility_outlined,
                                    color: _isVisited
                                        ? const Color(0xFF10B981)
                                        : const Color(0xFF3B82F6),
                                    label: _isVisited
                                        ? 'You visited this spot'
                                        : 'Mark as visited',
                                    isMaterialIcon: true,
                                  ),
                                  const SizedBox(height: 12),
                                  _buildSocialButton(
                                    onTap: _showSuggestEditDialog,
                                    icon: Icons.edit_note_rounded,
                                    color: const Color(0xFF8B5CF6),
                                    label: 'Suggest an edit',
                                    isMaterialIcon: true,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar:
          (_showReviewsModal || _showFeaturesModal || _showSocialModal)
          ? null
          : _buildFloatingBottomBar(),
    );
  }

  void _showDishesPopup(List<String> dishes) {
    if (dishes.isEmpty) return;

    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Special Menu',
      barrierColor: Colors.black.withOpacity(0.5),
      transitionDuration: const Duration(milliseconds: 600),
      pageBuilder: (context, anim1, anim2) {
        return BackdropFilter(
          filter: ColorFilter.mode(
            Colors.black.withOpacity(0.1),
            BlendMode.darken,
          ),
          child: Dialog(
            backgroundColor: Colors.transparent,
            elevation: 0,
            insetPadding: const EdgeInsets.fromLTRB(0, 40, 80, 40),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Floating Content Cards (Each item is a card)
                Flexible(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: _buildSpecialDishesList(dishes, anim1),
                  ),
                ),
              ],
            ),
          ),
        );
      },
      transitionBuilder: (context, anim1, anim2, child) {
        return child;
      },
    );
  }

  Widget _buildHubCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.12),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
          border: Border.all(color: color.withOpacity(0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: Color(0xFF111827),
                letterSpacing: -0.2,
              ),
            ),
            const SizedBox(height: 1),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11,
                color: const Color(0xFF6B7280).withOpacity(0.8),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFloatingBottomBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF0000), Color(0xFFDC2626)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFF0000).withOpacity(0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _openDirections,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.directions_rounded, color: Colors.white),
                        SizedBox(width: 12),
                        Text(
                          'Get Directions',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Container(
                height: 56,
                width: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: IconButton(
                  onPressed: () {
                    final phone = widget.spot['phone'];
                    if (phone != null) launchUrl(Uri.parse('tel:$phone'));
                  },
                  icon: const Icon(
                    Icons.call_rounded,
                    color: Color(0xFF374151),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: const Color(0xFFF59E0B)),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: Color(0xFF374151),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSocialButton({
    required VoidCallback onTap,
    required IconData icon,
    required Color color,
    required String label,
    bool isMaterialIcon = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.06),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.1)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF374151),
                  letterSpacing: -0.2,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: color.withOpacity(0.4),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecialDishesList(
    List<String> dishes,
    Animation<double> animation,
  ) {
    return Column(
      children: dishes.asMap().entries.map((entry) {
        final index = entry.key;
        final dish = entry.value;
        return _StaggeredDishItem(
          index: index,
          animation: animation,
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              border: Border.all(color: const Color(0xFFF3F4F6)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF1F2),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.restaurant_menu_rounded,
                      color: Color(0xFFE11D48),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          dish,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFef2f2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.local_fire_department_rounded,
                                size: 14,
                                color: Color(0xFFE11D48),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Must try',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: const Color(0xFFE11D48),
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.2,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _StaggeredDishItem extends StatelessWidget {
  final Widget child;
  final int index;
  final Animation<double> animation;

  const _StaggeredDishItem({
    required this.child,
    required this.index,
    required this.animation,
  });

  @override
  Widget build(BuildContext context) {
    final staggerStart = (index * 0.1).clamp(0.0, 0.4);
    final staggerEnd = (staggerStart + 0.6).clamp(0.0, 1.0);

    final slideAnimation =
        Tween<Offset>(begin: const Offset(-1.0, 0), end: Offset.zero).animate(
          CurvedAnimation(
            parent: animation,
            curve: Interval(
              staggerStart,
              staggerEnd,
              curve: Curves.easeOutCubic,
            ),
          ),
        );

    return SlideTransition(position: slideAnimation, child: child);
  }
}
