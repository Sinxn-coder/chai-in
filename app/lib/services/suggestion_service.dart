import 'package:supabase_flutter/supabase_flutter.dart';

class SuggestionService {
  static final _supabase = Supabase.instance.client;

  /// Submits a new spot edit suggestion to Supabase.
  static Future<bool> submitSuggestion({
    required String spotId,
    required String suggestion,
  }) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      await _supabase.from('spot_suggestions').insert({
        'spot_id': spotId,
        'user_id': user.id,
        'suggestion': suggestion,
        'status': 'pending',
      });

      // Supabase insert doesn't return data by default in newer versions unless select() is called,
      // but if there's no error, it's a success.
      return true;
    } catch (e) {
      print('Error submitting suggestion: $e');
      return false;
    }
  }

  /// Fetches suggestions for a specific spot (useful for admins or the user who suggested).
  static Future<List<Map<String, dynamic>>> fetchSuggestionsForSpot(String spotId) async {
    try {
      final data = await _supabase
          .from('spot_suggestions')
          .select('*')
          .eq('spot_id', spotId)
          .order('created_at', ascending: false);
      
      return List<Map<String, dynamic>>.from(data);
    } catch (e) {
      print('Error fetching suggestions: $e');
      return [];
    }
  }
}
