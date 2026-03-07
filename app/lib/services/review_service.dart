import '../supabase_config.dart';
import 'notification_service.dart';

class ReviewService {
  static const String _table = 'reviews';
  static const String _likesTable = 'review_likes';

  // Get current user ID safely
  static String? get _userId => SupabaseConfig.client.auth.currentUser?.id;

  // Fetch reviews for a specific spot
  static Future<List<Map<String, dynamic>>> fetchReviewsForSpot(
    String spotId,
  ) async {
    try {
      final userId = _userId;

      // Fetch reviews with basic join to check if the current user liked them
      final response = await SupabaseConfig.client
          .from(_table)
          .select('*, public_users:user_id(full_name, avatar_url)')
          .eq('spot_id', spotId)
          .order('created_at', ascending: false);

      final List<dynamic> data = response as List<dynamic>;

      // If user is logged in, fetch their likes for these reviews
      Set<String> userLikedReviewIds = {};
      if (userId != null && data.isNotEmpty) {
        final reviewIds = data.map((r) => r['id'] as String).toList();
        final likesResponse = await SupabaseConfig.client
            .from(_likesTable)
            .select('review_id')
            .eq('user_id', userId)
            .filter('review_id', 'in', reviewIds);

        final List<dynamic> likesData = likesResponse as List<dynamic>;
        userLikedReviewIds = likesData
            .map((l) => l['review_id'] as String)
            .toSet();
      }

      return data.map((review) {
        final userData = review['public_users'] as Map<String, dynamic>?;
        return {
          'id': review['id'],
          'userName': userData?['full_name'] ?? 'User',
          'avatar': userData?['avatar_url'] ?? 'assets/images/icon.png',
          'comment': review['content'] ?? '',
          'rating': (review['rating'] as num?)?.toDouble() ?? 5.0,
          'date': _formatDate(review['created_at']),
          'likes': review['likes_count'] ?? 0,
          'isLiked': userLikedReviewIds.contains(review['id']),
          'user_id': review['user_id'],
        };
      }).toList();
    } catch (e) {
      print('DEBUG: Error fetching reviews: $e');
      return [];
    }
  }

  // Fetch reviews for the current user
  static Future<List<Map<String, dynamic>>> fetchUserReviews() async {
    final userId = _userId;
    if (userId == null) return [];

    try {
      final response = await SupabaseConfig.client
          .from(_table)
          .select('*, spot:spots(*)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      final List<dynamic> data = response as List<dynamic>;

      return data.map((review) {
        final spotData = review['spot'] as Map<String, dynamic>?;
        final images = List<String>.from(spotData?['images'] ?? []);

        // Format spotData for SpotDetailsPage consistency (uses 'title' etc.)
        final formattedSpot = spotData != null
            ? {
                'id': spotData['id'],
                'title': spotData['name'],
                'location':
                    spotData['city'] ??
                    spotData['location'] ??
                    'Unknown Location',
                'description': spotData['description'] ?? '',
                'images': spotData['images'] ?? [],
                'image': images.isNotEmpty
                    ? images[0]
                    : 'assets/images/land.png',
                'rating': (spotData['rating'] as num?)?.toDouble() ?? 0.0,
                'category': spotData['category'] ?? 'Other',
                'specialDishes': spotData['special_dishes'] ?? [],
                'features': spotData['features'] ?? [],
                'opening_time': spotData['opening_time'],
                'closing_time': spotData['closing_time'],
                'phone': spotData['phone'] ?? '',
                'whatsapp': spotData['whatsapp'] ?? '',
                'instagram': spotData['instagram'] ?? '',
                'latitude': (spotData['latitude'] as num?)?.toDouble(),
                'longitude': (spotData['longitude'] as num?)?.toDouble(),
              }
            : null;

        return {
          'id': review['id'],
          'spotName': spotData?['name'] ?? 'Unknown Spot',
          'spotImage': images.isNotEmpty ? images[0] : 'assets/images/land.png',
          'rating': (review['rating'] as num?)?.toDouble() ?? 5.0,
          'comment': review['content'] ?? '',
          'date': _formatDate(review['created_at']),
          'helpful': review['likes_count'] ?? 0,
          'isHelpful': false,
          'spotData': formattedSpot,
        };
      }).toList();
    } catch (e) {
      print('DEBUG: Error fetching user reviews: $e');
      return [];
    }
  }

  // Check if current user has already reviewed this spot
  static Future<bool> hasUserReviewedSpot(String spotId) async {
    final userId = _userId;
    if (userId == null) return false;

    try {
      final response = await SupabaseConfig.client
          .from(_table)
          .select('id')
          .eq('spot_id', spotId)
          .eq('user_id', userId)
          .maybeSingle();

      return response != null;
    } catch (e) {
      print('DEBUG: Error checking if reviewed: $e');
      return false;
    }
  }

  // Add a new review
  static Future<Map<String, dynamic>?> addReview({
    required String spotId,
    required String content,
    required double rating,
  }) async {
    final userId = _userId;
    if (userId == null) {
      NotificationService.show(
        message: 'Please login to add a review',
        type: NotificationType.error,
      );
      return null;
    }

    try {
      // Check if already reviewed before attempting insert
      if (await hasUserReviewedSpot(spotId)) {
        NotificationService.show(
          message: 'You have already reviewed this spot.',
          type: NotificationType.info,
        );
        return null;
      }

      final response = await SupabaseConfig.client
          .from(_table)
          .insert({
            'spot_id': spotId,
            'user_id': userId,
            'content': content,
            'rating': rating.toInt(),
          })
          .select()
          .single();

      return response;
    } catch (e) {
      print('DEBUG: Error adding review: $e');

      // Specifically handle unique constraint violation (code 23505)
      final errorMsg = e.toString();
      if (errorMsg.contains('23505') ||
          errorMsg.contains('unique_user_review')) {
        NotificationService.show(
          message: 'You have already reviewed this spot.',
          type: NotificationType.info,
        );
      } else {
        NotificationService.show(
          message: 'Could not add review. Please try again.',
          type: NotificationType.error,
        );
      }
      return null;
    }
  }

  // Toggle like on a review
  static Future<Map<String, dynamic>?> toggleLike(
    String reviewId,
    bool currentlyLiked,
  ) async {
    final userId = _userId;
    if (userId == null) {
      NotificationService.show(
        message: 'Please login to like reviews',
        type: NotificationType.error,
      );
      return null;
    }

    try {
      if (currentlyLiked) {
        await SupabaseConfig.client.from(_likesTable).delete().match({
          'user_id': userId,
          'review_id': reviewId,
        });
        return {'isLiked': false, 'change': -1};
      } else {
        await SupabaseConfig.client.from(_likesTable).insert({
          'user_id': userId,
          'review_id': reviewId,
        });
        return {'isLiked': true, 'change': 1};
      }
    } catch (e) {
      print('DEBUG: Error toggling review like: $e');
      return null;
    }
  }

  // Delete a review
  static Future<bool> deleteReview(String reviewId) async {
    final userId = _userId;
    if (userId == null) return false;

    try {
      await SupabaseConfig.client
          .from(_table)
          .delete()
          .eq('id', reviewId)
          .eq('user_id', userId);
      return true;
    } catch (e) {
      print('DEBUG: Error deleting review: $e');
      return false;
    }
  }

  // Update an existing review
  static Future<bool> updateReview({
    required String reviewId,
    required String content,
    required double rating,
  }) async {
    final userId = _userId;
    if (userId == null) return false;

    try {
      final response = await SupabaseConfig.client
          .from(_table)
          .update({'content': content, 'rating': rating.toInt()})
          .eq('id', reviewId)
          .eq('user_id', userId)
          .select();

      final List<dynamic> data = response as List<dynamic>;
      return data.isNotEmpty;
    } catch (e) {
      print('DEBUG: Error updating review: $e');
      NotificationService.show(
        message: 'Could not update review. Please try again.',
        type: NotificationType.error,
      );
      return false;
    }
  }

  // Simple date formatter
  static String _formatDate(String? dateStr) {
    if (dateStr == null) return 'Recent';
    try {
      final date = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(date);

      if (diff.inDays > 365) return '${(diff.inDays / 365).floor()}y ago';
      if (diff.inDays > 30) return '${(diff.inDays / 30).floor()}mo ago';
      if (diff.inDays > 0) return '${diff.inDays}d ago';
      if (diff.inHours > 0) return '${diff.inHours}h ago';
      if (diff.inMinutes > 0) return '${diff.inMinutes}m ago';
      return 'Just now';
    } catch (e) {
      return 'Recent';
    }
  }
}
