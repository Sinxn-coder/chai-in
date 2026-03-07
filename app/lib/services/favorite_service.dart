import '../supabase_config.dart';
import 'notification_service.dart';

class FavoriteService {
  static const String _table = 'favorites';

  // Get current user ID safely
  static String? get _userId => SupabaseConfig.client.auth.currentUser?.id;

  // Toggle favorite status
  static Future<bool> toggleFavorite(String spotId) async {
    final userId = _userId;
    print('DEBUG: toggleFavorite for spot: $spotId by user: $userId');
    if (userId == null) {
      print('DEBUG: toggleFavorite failed - No User');
      return false;
    }

    try {
      final isFav = await isFavorite(spotId);
      print('DEBUG: Currently favorite: $isFav');

      if (isFav) {
        // Remove from favorites
        await SupabaseConfig.client.from(_table).delete().match({
          'user_id': userId,
          'spot_id': spotId,
        });
        print('DEBUG: Removed from favorites');
        return false;
      } else {
        // Add to favorites
        await SupabaseConfig.client.from(_table).insert({
          'user_id': userId,
          'spot_id': spotId,
        });
        print('DEBUG: Added to favorites');
        return true;
      }
    } catch (e) {
      print('DEBUG: Error toggling favorite: $e');
      NotificationService.show(
        message: 'Could not toggle favorite. Error: $e',
        type: NotificationType.error,
      );
      return false;
    }
  }

  // Check if a spot is favorited
  static Future<bool> isFavorite(String spotId) async {
    final userId = _userId;
    if (userId == null) return false;

    try {
      final response = await SupabaseConfig.client.from(_table).select().match({
        'user_id': userId,
        'spot_id': spotId,
      }).maybeSingle();

      final result = response != null;
      print('DEBUG: isFavorite($spotId) check: $result');
      return result;
    } catch (e) {
      print('DEBUG: Error checking favorite: $e');
      return false;
    }
  }

  // Get all favorited spot IDs for the current user
  static Future<Set<String>> getFavoriteSpotIds() async {
    final userId = _userId;
    if (userId == null) return {};

    try {
      final response = await SupabaseConfig.client
          .from(_table)
          .select('spot_id')
          .eq('user_id', userId);

      final List<dynamic> data = response as List<dynamic>;

      final ids = data
          .map((item) => item['spot_id']?.toString())
          .where((id) => id != null)
          .cast<String>()
          .toSet();

      print('DEBUG: Found ${ids.length} favorite IDs');
      return ids;
    } catch (e) {
      print('DEBUG: Error fetching favorite IDs: $e');
      return {};
    }
  }

  // Get full details of favorited spots
  static Future<List<Map<String, dynamic>>> getFavoriteSpots() async {
    final userId = _userId;
    print('DEBUG: Fetching favorites for user: $userId');
    if (userId == null) {
      print('DEBUG: UserId is null, returning empty list');
      return [];
    }

    try {
      // Joining with spots table
      // Standard Supabase join syntax for many-to-one
      final response = await SupabaseConfig.client
          .from(_table)
          .select('*, spots(*)')
          .eq('user_id', userId);

      print('DEBUG: Raw favorites data received: $response');

      final List<dynamic> data = response as List<dynamic>;

      final List<Map<String, dynamic>> spots = [];
      for (var item in data) {
        if (item['spots'] != null) {
          // Supabase join structure can be Map or List depending on relationship detection
          if (item['spots'] is Map) {
            spots.add(item['spots'] as Map<String, dynamic>);
          } else if (item['spots'] is List &&
              (item['spots'] as List).isNotEmpty) {
            spots.add((item['spots'] as List).first as Map<String, dynamic>);
          }
        }
      }

      print('DEBUG: Processed ${spots.length} favorited spots');
      return spots;
    } catch (e) {
      print('DEBUG: Error fetching favorite spots: $e');
      return [];
    }
  }
}
