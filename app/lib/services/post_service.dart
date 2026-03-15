import 'dart:io';
import '../supabase_config.dart';

class PostService {
  /// Fetch posts with author details and mentioned spot
  static Future<List<Map<String, dynamic>>> getPosts() async {
    try {
      final response = await SupabaseConfig.client
          .from('posts')
          .select('''
            *,
            author:user_id(username, full_name, avatar_url, email),
            spot:spot_id(id, name, city, images, rating)
          ''')
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
          .select('posts(*, author:user_id(username, full_name, avatar_url, email), spot:spot_id(id, name, city, images, rating))')
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
          .select('*, author:user_id(username, full_name, avatar_url, email), spot:spot_id(id, name, city, images, rating)')
          .eq('user_id', userId)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('Error fetching user posts: $e');
      return [];
    }
  }

  /// Creates a new community post
  static Future<bool> createPost({
    required String? content,
    required List<String> imagePaths,
    String? spotId,
    String? spotName,
  }) async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return false;

      final List<String> imageUrls = [];

      // 1. Upload images to 'posts' bucket
      if (imagePaths.isNotEmpty) {
        for (int i = 0; i < imagePaths.length; i++) {
          final file = File(imagePaths[i]);
          final String fileName =
              '${user.id}/${DateTime.now().millisecondsSinceEpoch}_$i.jpg';

          await SupabaseConfig.client.storage.from('posts').upload(fileName, file);

          final String publicUrl =
              SupabaseConfig.client.storage.from('posts').getPublicUrl(fileName);

          imageUrls.add(publicUrl);
        }
      }

      // 2. Insert post data
      await SupabaseConfig.client.from('posts').insert({
        'user_id': user.id,
        'content': content,
        'images': imageUrls,
        'spot_id': spotId,
        'spot_name': spotName,
      });

      return true;
    } catch (e) {
      print('Error creating post: $e');
      return false;
    }
  }

  /// Fetch spots by a list of exact names
  static Future<Map<String, Map<String, dynamic>>> getSpotsByNames(
    List<String> names,
  ) async {
    if (names.isEmpty) return {};

    try {
      final response = await SupabaseConfig.client
          .from('spots')
          .select('id, name, city, images, rating')
          .inFilter('name', names);

      final List<dynamic> data = response;
      final Map<String, Map<String, dynamic>> results = {};
      
      for (var spot in data) {
        final name = spot['name'] as String;
        results[name] = Map<String, dynamic>.from(spot);
      }
      
      return results;
    } catch (e) {
      print('Error fetching spots by names: $e');
      return {};
    }
  }

  /// Updates a post's content
  static Future<bool> updatePost(String postId, String newContent) async {
    try {
      await SupabaseConfig.client
          .from('posts')
          .update({'content': newContent})
          .eq('id', postId);
      return true;
    } catch (e) {
      print('Error updating post: $e');
      return false;
    }
  }

  /// Deletes a post and its associated images from storage
  static Future<bool> deletePost(String postId) async {
    try {
      // 1. Fetch post details to get image URLs
      final post = await SupabaseConfig.client
          .from('posts')
          .select('images')
          .eq('id', postId)
          .maybeSingle();

      if (post != null && post['images'] != null) {
        final List<dynamic> images = post['images'];
        if (images.isNotEmpty) {
          final List<String> pathsToDelete = [];
          
          for (var imageUrl in images) {
            // Extract the path after /public/posts/
            // URL format: .../storage/v1/object/public/posts/folder/image.jpg
            final String url = imageUrl.toString();
            final String marker = '/public/posts/';
            if (url.contains(marker)) {
              final String path = url.substring(url.indexOf(marker) + marker.length);
              pathsToDelete.add(path);
            }
          }

          if (pathsToDelete.isNotEmpty) {
            await SupabaseConfig.client.storage.from('posts').remove(pathsToDelete);
            print('Deleted ${pathsToDelete.length} images from storage');
          }
        }
      }

      // 2. Delete the post record (this will also trigger cascade deletes if set up)
      await SupabaseConfig.client.from('posts').delete().eq('id', postId);
      return true;
    } catch (e) {
      print('Error deleting post: $e');
      return false;
    }
  }
}
