import 'package:flutter/material.dart';
import '../supabase_config.dart';

class FeatureService {
  static Map<String, String> _featureIcons = {};

  /// Fetches all features and their icon names from Supabase
  static Future<void> initialize() async {
    try {
      final data = await SupabaseConfig.client
          .from('features')
          .select('name, icon_name');

      _featureIcons = {
        for (var item in (data as List))
          (item['name'] as String): (item['icon_name'] as String? ?? 'star'),
      };
    } catch (e) {
      debugPrint('Error initializing FeatureService: $e');
    }
  }

  /// Returns the icon name for a given feature name
  static String getIconName(String featureName) {
    if (_featureIcons.isEmpty) {
      debugPrint('WARNING: FeatureService not initialized or empty');
      return 'star';
    }

    final searchName = featureName.toLowerCase().trim();
    debugPrint(
      'DEBUG: Looking up icon for feature: "$featureName" (search: "$searchName")',
    );

    // 1. Try exact match (case-insensitive)
    for (var entry in _featureIcons.entries) {
      if (entry.key.toLowerCase().trim() == searchName) {
        debugPrint('DEBUG: Exact match found: ${entry.key} -> ${entry.value}');
        return entry.value;
      }
    }

    // 2. Try partial match (contains)
    for (var entry in _featureIcons.entries) {
      final key = entry.key.toLowerCase();
      if (searchName.contains(key) || key.contains(searchName)) {
        debugPrint(
          'DEBUG: Partial match found: ${entry.key} -> ${entry.value}',
        );
        return entry.value;
      }
    }

    debugPrint(
      'DEBUG: No match found for "$featureName", falling back to "star"',
    );
    return 'star';
  }

  /// Helper to convert icon name to IconData
  static IconData getIconData(String iconName) {
    switch (iconName.toLowerCase()) {
      case 'wifi':
        return Icons.wifi_rounded;
      case 'parking':
        return Icons.local_parking_rounded;
      case 'ac':
        return Icons.ac_unit_rounded;
      case 'chair':
        return Icons.chair_alt_rounded;
      case 'clean':
        return Icons.wash_rounded;
      case 'card':
        return Icons.payments_rounded;
      case 'music':
        return Icons.music_note_rounded;
      case 'outdoor':
        return Icons.deck_rounded;
      case 'pet':
        return Icons.pets_rounded;
      case 'takeout':
        return Icons.takeout_dining_rounded;
      case 'valet':
        return Icons.minor_crash_rounded;
      case 'delivery':
        return Icons.delivery_dining_rounded;
      case 'coffee':
        return Icons.coffee_rounded;
      case 'food':
        return Icons.restaurant_rounded;
      default:
        return Icons.star_outline_rounded;
    }
  }
}
