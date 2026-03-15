import 'dart:async';
import 'package:flutter/foundation.dart';
import '../supabase_config.dart';

class UsageService {
  static final UsageService _instance = UsageService._internal();
  factory UsageService() => _instance;
  UsageService._internal();

  DateTime? _startTime;
  int _pendingMinutes = 0;
  Timer? _syncTimer;

  /// Starts tracking usage
  void startTracking() {
    debugPrint('Usage tracking started');
    _startTime = DateTime.now();
    
    // Start periodic sync every 5 minutes while active
    _syncTimer?.cancel();
    _syncTimer = Timer.periodic(const Duration(minutes: 5), (timer) {
      _accumulateAndSync();
    });
  }

  /// Stops tracking usage and syncs
  Future<void> stopTracking() async {
    debugPrint('Usage tracking stopped');
    _syncTimer?.cancel();
    await _accumulateAndSync();
    _startTime = null;
  }

  /// Accumulates time since last start/sync and sends to Supabase
  Future<void> _accumulateAndSync() async {
    if (_startTime == null) return;

    final now = DateTime.now();
    final difference = now.difference(_startTime!);
    final sessionMinutes = difference.inMinutes;
    
    // Update start time to now to avoid double counting in next sync
    _startTime = now;

    if (sessionMinutes > 0) {
      _pendingMinutes += sessionMinutes;
      await _syncToSupabase();
    }
  }

  /// Upserts the accumulated minutes to Supabase
  Future<void> _syncToSupabase() async {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null || _pendingMinutes <= 0) return;

    final today = DateTime.now().toIso8601String().split('T')[0];
    final minutesToSync = _pendingMinutes;

    try {
      // 1. Get current minutes for today
      final response = await SupabaseConfig.client
          .from('user_usage')
          .select('minutes')
          .eq('user_id', userId)
          .eq('usage_date', today)
          .maybeSingle();

      final currentMinutes = response?['minutes'] as int? ?? 0;
      final newTotal = currentMinutes + minutesToSync;

      // 2. Upsert (Increment)
      await SupabaseConfig.client.from('user_usage').upsert({
        'user_id': userId,
        'usage_date': today,
        'minutes': newTotal,
        'last_synced_at': DateTime.now().toIso8601String(),
      }, onConflict: 'user_id, usage_date');

      // Reset pending minutes on success
      _pendingMinutes -= minutesToSync;
      debugPrint('Usage synced: +$minutesToSync mins (Total: $newTotal)');
    } catch (e) {
      debugPrint('Error syncing usage: $e');
      // Keep pending minutes for next attempt
    }
  }
}
