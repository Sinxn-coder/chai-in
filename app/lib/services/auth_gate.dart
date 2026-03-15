import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../supabase_config.dart';
import '../login.dart';

class AuthGate {
  static const String _isGuestKey = 'is_guest';
  static const String _directionUsageKey = 'direction_usage_count';
  static const int maxGuestDirections = 5;

  /// Check if the current user is a guest
  static Future<bool> isGuest() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_isGuestKey) ?? false;
  }

  /// Set guest status
  static Future<void> setGuestStatus(bool isGuest) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_isGuestKey, isGuest);
    if (!isGuest) {
      await prefs.remove(_directionUsageKey);
    }
  }

  /// Centralized requirement check for actions
  static Future<bool> check(BuildContext context, {String message = 'Please sign in to continue'}) async {
    final guest = await isGuest();
    final hasSession = SupabaseConfig.client.auth.currentSession != null;

    if (!hasSession || guest) {
      if (context.mounted) {
        _showLoginPrompt(context, message);
      }
      return false;
    }
    return true;
  }

  /// Check direction usage for guests
  static Future<bool> canUseDirections(BuildContext context) async {
    final guest = await isGuest();
    if (!guest) return true;

    final prefs = await SharedPreferences.getInstance();
    int count = prefs.getInt(_directionUsageKey) ?? 0;

    if (count >= maxGuestDirections) {
      if (context.mounted) {
        _showLoginPrompt(
          context, 
          'You\'ve reached the guest limit for directions. Sign in to get unlimited access!',
        );
      }
      return false;
    }

    // Increment count
    await prefs.setInt(_directionUsageKey, count + 1);
    return true;
  }

  static void _showLoginPrompt(BuildContext context, String message) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(32),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 50,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            const SizedBox(height: 30),
            const Icon(Icons.lock_person_rounded, size: 60, color: Color(0xFFFF0000)),
            const SizedBox(height: 20),
            const Text(
              'Sign In Required',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF1A1A1A)),
            ),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey[600], height: 1.5),
            ),
            const SizedBox(height: 35),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Close sheet
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginPage()),
                    (route) => false,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF0000),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                  elevation: 0,
                ),
                child: const Text(
                  'Sign In Now',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Maybe Later', style: TextStyle(color: Colors.grey[500])),
            ),
          ],
        ),
      ),
    );
  }
}
