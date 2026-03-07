import '../supabase_config.dart';

class PostService {
  /// Fetch posts with author details
  static Future<List<Map<String, dynamic>>> getPosts() async {
    try {
      final response = await SupabaseConfig.client
          .from('posts')
          .select('*, author:user_id(username, full_name, avatar_url)')
          .order('created_at', ascending: false);

      final List<Map<String, dynamic>> data = List<Map<String, dynamic>>.from(
        response,
      );
      return data;
    } catch (e, stack) {
      print('Error fetching posts: $e');
      print('Stack trace: $stack');
      return [];
    }
  }

  /// Get IDs of posts liked by the current user
  static Future<Set<String>> getLikedPostIds() async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return {};

    try {
      final response = await SupabaseConfig.client
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId);

      final List<dynamic> data = response;
      return data.map((item) => item['post_id'].toString()).toSet();
    } catch (e) {
      print('Error fetching liked post IDs: $e');
      return {};
    }
  }

  /// Toggle like status for a post
  static Future<bool> toggleLike(String postId) async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return false;

    try {
      // Check if already liked
      final existing = await SupabaseConfig.client
          .from('post_likes')
          .select()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

      if (existing != null) {
        // Unlike
        await SupabaseConfig.client
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);
        return false; // Not liked anymore
      } else {
        // Like
        await SupabaseConfig.client.from('post_likes').insert({
          'post_id': postId,
          'user_id': userId,
        });
        return true; // Liked
      }
    } catch (e) {
      print('Error toggling post like: $e');
      return false;
    }
  }

  /// Get IDs of posts saved by the current user
  static Future<Set<String>> getSavedPostIds() async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return {};

    try {
      final response = await SupabaseConfig.client
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', userId);

      final List<dynamic> data = response;
      return data.map((item) => item['post_id'].toString()).toSet();
    } catch (e) {
      print('Error fetching saved post IDs: $e');
      return {};
    }
  }

  /// Fetch posts saved by the current user
  static Future<List<Map<String, dynamic>>> getSavedPosts() async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return [];

    try {
      final response = await SupabaseConfig.client
          .from('saved_posts')
          .select('posts(*, author:user_id(username, full_name, avatar_url))')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      final List<dynamic> data = response;
      return data.map((item) => item['posts'] as Map<String, dynamic>).toList();
    } catch (e, stack) {
      print('Error fetching saved posts: $e');
      print('Stack trace: $stack');
      return [];
    }
  }

  /// Toggle save status for a post
  static Future<bool> toggleSave(String postId) async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return false;

    try {
      final existing = await SupabaseConfig.client
          .from('saved_posts')
          .select()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

      if (existing != null) {
        // Unsave
        await SupabaseConfig.client
            .from('saved_posts')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);
        return false;
      } else {
        // Save
        await SupabaseConfig.client.from('saved_posts').insert({
          'post_id': postId,
          'user_id': userId,
        });
        return true;
      }
    } catch (e) {
      print('Error toggling post save: $e');
      return false;
    }
  }

  /// Fetch posts by a specific user ID
  static Future<List<Map<String, dynamic>>> getPostsByUserId(
    String userId,
  ) async {
    try {
      final response = await SupabaseConfig.client
          .from('posts')
          .select('*, author:user_id(username, full_name, avatar_url)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching user posts: $e');
      return [];
    }
  }
}
