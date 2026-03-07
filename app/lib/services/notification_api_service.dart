import 'package:flutter/foundation.dart';
import '../supabase_config.dart';

class NotificationApiService {
  static const String table = 'notifications';

  static Future<List<Map<String, dynamic>>> fetchNotifications() async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return [];

      final response = await SupabaseConfig.client
          .from(table)
          .select()
          .eq('user_id', user.id)
          .order('created_at', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('Error fetching notifications: $e');
      return [];
    }
  }

  static Future<void> markAsRead(String id) async {
    try {
      await SupabaseConfig.client
          .from(table)
          .update({'is_read': true})
          .eq('id', id);
    } catch (e) {
      debugPrint('Error marking notification as read: $e');
    }
  }

  static Future<void> markAllAsRead() async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return;

      await SupabaseConfig.client
          .from(table)
          .update({'is_read': true})
          .eq('user_id', user.id)
          .eq('is_read', false);
    } catch (e) {
      debugPrint('Error marking all notifications as read: $e');
    }
  }

  static Future<void> deleteNotification(String id) async {
    try {
      await SupabaseConfig.client.from(table).delete().eq('id', id);
    } catch (e) {
      debugPrint('Error deleting notification: $e');
    }
  }

  static Future<void> deleteMultipleNotifications(List<String> ids) async {
    try {
      await SupabaseConfig.client.from(table).delete().inFilter('id', ids);
    } catch (e) {
      debugPrint('Error deleting multiple notifications: $e');
    }
  }

  static Future<int> getUnreadCount() async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return 0;

      final response = await SupabaseConfig.client
          .from(table)
          .select('id')
          .eq('user_id', user.id)
          .eq('is_read', false);

      return (response as List).length;
    } catch (e) {
      debugPrint('Error getting unread count: $e');
      return 0;
    }
  }
}
