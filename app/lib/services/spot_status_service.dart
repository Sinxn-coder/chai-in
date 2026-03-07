import 'package:flutter/foundation.dart';

class SpotStatusService {
  /// Calculates if a spot is currently open based on its operating hours.
  static bool isSpotOpen(
    String? openStr,
    String? closeStr, {
    bool is24Hours = false,
  }) {
    if (is24Hours) return true;
    if (openStr == null ||
        closeStr == null ||
        openStr.isEmpty ||
        closeStr.isEmpty) {
      return true; // Default to open if no hours provided
    }

    try {
      final now = DateTime.now();
      final currentTimeInMinutes = now.hour * 60 + now.minute;

      int parseTime(String timeStr) {
        timeStr = timeStr.trim().toUpperCase();
        String ampm = '';
        String rawTime = timeStr;

        if (timeStr.endsWith('PM')) {
          ampm = 'PM';
          rawTime = timeStr.replaceAll('PM', '').trim();
        } else if (timeStr.endsWith('AM')) {
          ampm = 'AM';
          rawTime = timeStr.replaceAll('AM', '').trim();
        }

        final timeParts = rawTime.split(':');
        int hour = int.tryParse(timeParts[0]) ?? 0;
        int minute = timeParts.length > 1
            ? (int.tryParse(timeParts[1]) ?? 0)
            : 0;

        if (ampm == 'PM' && hour < 12) hour += 12;
        if (ampm == 'AM' && hour == 12) hour = 0;

        final result = hour * 60 + minute;
        return result;
      }

      final openMinutes = parseTime(openStr);
      final closeMinutes = parseTime(closeStr);

      if (closeMinutes < openMinutes) {
        // Handle overnight hours (e.g., 06:00 PM to 02:00 AM)
        return currentTimeInMinutes >= openMinutes ||
            currentTimeInMinutes <= closeMinutes;
      }

      return currentTimeInMinutes >= openMinutes &&
          currentTimeInMinutes <= closeMinutes;
    } catch (e) {
      debugPrint('Error parsing time in SpotStatusService: $e');
      return true; // Default to open on error
    }
  }

  /// Returns a human-readable status string (e.g., "Open Now", "Closed", "Open 24/7").
  static String getStatusString(
    String? openStr,
    String? closeStr, {
    bool is24Hours = false,
  }) {
    final isOpen = isSpotOpen(openStr, closeStr, is24Hours: is24Hours);
    if (isOpen) {
      return is24Hours ? 'Open 24/7' : 'Open Now';
    } else {
      return 'Closed';
    }
  }
}
