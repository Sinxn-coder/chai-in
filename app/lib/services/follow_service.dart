import '../supabase_config.dart';

class FollowService {
  /// Follow a user
  static Future<bool> followUser(String targetUserId) async {
    final currentUserId = SupabaseConfig.currentUserId;
    if (currentUserId == null || currentUserId == targetUserId) return false;

    try {
      await SupabaseConfig.client.from('follows').insert({
        'follower_id': currentUserId,
        'following_id': targetUserId,
      });
      return true;
    } catch (e) {
      print('Error following user: $e');
      return false;
    }
  }

  /// Unfollow a user
  static Future<bool> unfollowUser(String targetUserId) async {
    final currentUserId = SupabaseConfig.currentUserId;
    if (currentUserId == null) return false;

    try {
      await SupabaseConfig.client
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);
      return true;
    } catch (e) {
      print('Error unfollowing user: $e');
      return false;
    }
  }

  /// Toggle follow status
  static Future<bool> toggleFollow(String targetUserId) async {
    final isFollowingUser = await isFollowing(targetUserId);
    if (isFollowingUser) {
      final success = await unfollowUser(targetUserId);
      return !success; // If unfollow succeeded, it's now false (not following)
    } else {
      return await followUser(targetUserId);
    }
  }

  /// Check if the current user is following the target user
  static Future<bool> isFollowing(String targetUserId) async {
    final currentUserId = SupabaseConfig.currentUserId;
    if (currentUserId == null) return false;

    try {
      final response = await SupabaseConfig.client
          .from('follows')
          .select()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();
      return response != null;
    } catch (e) {
      print('Error checking follow status: $e');
      return false;
    }
  }

  /// Get followers count for a user
  static Future<int> getFollowersCount(String userId) async {
    try {
      final response = await SupabaseConfig.client
          .from('follows')
          .select('follower_id')
          .eq('following_id', userId);
      return (response as List).length;
    } catch (e) {
      print('Error getting followers count: $e');
      return 0;
    }
  }

  /// Get following count for a user
  static Future<int> getFollowingCount(String userId) async {
    try {
      final response = await SupabaseConfig.client
          .from('follows')
          .select('following_id')
          .eq('follower_id', userId);
      return (response as List).length;
    } catch (e) {
      print('Error getting following count: $e');
      return 0;
    }
  }

  /// Search users by username, full name, or exact ID
  static Future<List<Map<String, dynamic>>> searchUsers(String query) async {
    try {
      var queryBuilder = SupabaseConfig.client.from('users').select();

      // If it looks like a UUID, search by ID as well
      final uuidRegex = RegExp(
        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        caseSensitive: false,
      );
      if (uuidRegex.hasMatch(query.trim())) {
        queryBuilder = queryBuilder.or(
          'id.eq.${query.trim()},username.ilike.%$query%,full_name.ilike.%$query%',
        );
      } else {
        queryBuilder = queryBuilder.or(
          'username.ilike.%$query%,full_name.ilike.%$query%',
        );
      }

      final response = await queryBuilder.limit(10);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error searching users: $e');
      return [];
    }
  }

  /// Get IDs of users the current user is following
  static Future<Set<String>> getFollowingIds() async {
    final currentUserId = SupabaseConfig.currentUserId;
    if (currentUserId == null) return {};

    try {
      final response = await SupabaseConfig.client
          .from('follows')
          .select('following_id')
          .eq('follower_id', currentUserId);

      final List<dynamic> data = response;
      return data.map((item) => item['following_id'].toString()).toSet();
    } catch (e) {
      print('Error fetching following IDs: $e');
      return {};
    }
  }
}
