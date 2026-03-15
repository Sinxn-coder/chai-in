import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/foundation.dart';
import '../supabase_config.dart';
import 'notification_service.dart';

class PushNotificationService {
  static final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    // 1. Request Permission (iOS/Android 13+)
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      debugPrint('User granted notification permission');
    }

    // 2. Initialize Local Notifications (for foreground)
    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings initSettings = InitializationSettings(android: androidSettings);
    await _localNotifications.initialize(initSettings);

    // 3. Setup Handlers
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationClick);
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 4. Initial Token Sync
    await syncTokenWithSupabase();
  }

  static Future<void> syncTokenWithSupabase() async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return;

      final token = await _fcm.getToken();
      if (token == null) return;

      debugPrint('Syncing FCM Token: $token');

      await SupabaseConfig.client.from('user_fcm_tokens').upsert({
        'user_id': user.id,
        'token': token,
        'device_type': defaultTargetPlatform.name.toLowerCase(),
        'last_seen': DateTime.now().toIso8601String(),
      }, onConflict: 'user_id, token');
      
    } catch (e) {
      debugPrint('Error syncing FCM token: $e');
    }
  }

  static void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('Foreground Message: ${message.notification?.title}');
    
    // Show in-app notification using our existing NotificationService
    if (message.notification != null) {
      NotificationService.show(
        message: '${message.notification!.title}: ${message.notification!.body}',
        type: NotificationType.info,
      );
      
      // Also show system notification for consistency
      _showLocalNotification(message);
    }
  }

  static void _handleNotificationClick(RemoteMessage message) {
    debugPrint('Notification clicked: ${message.data}');
    // TODO: Handle navigation based on message.data
  }

  static Future<void> _showLocalNotification(RemoteMessage message) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'high_importance_channel',
      'High Importance Notifications',
      importance: Importance.max,
      priority: Priority.high,
    );
    const NotificationDetails details = NotificationDetails(android: androidDetails);

    await _localNotifications.show(
      message.hashCode,
      message.notification?.title,
      message.notification?.body,
      details,
    );
  }
}

// Global background handler
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint("Handling a background message: ${message.messageId}");
}
