import '../supabase_config.dart';

class VisitService {
  /// Toggles the visited status for a spot
  static Future<bool> toggleVisit(String spotId) async {
    final userId = SupabaseConfig.client.auth.currentUser?.id;
    if (userId == null) return false;

    try {
      final response = await SupabaseConfig.client
          .from('visits')
          .select()
          .eq('user_id', userId)
          .eq('spot_id', spotId)
          .maybeSingle();

      if (response == null) {
        // Add visit
        await SupabaseConfig.client.from('visits').insert({
          'user_id': userId,
          'spot_id': spotId,
        });
        return true;
      } else {
        // Remove visit
        await SupabaseConfig.client
            .from('visits')
            .delete()
            .eq('user_id', userId)
            .eq('spot_id', spotId);
        return false;
      }
    } catch (e) {
      print('Error toggling visit: $e');
      return false;
    }
  }

  /// Checks if a spot is visited by the current user
  static Future<bool> isVisited(String spotId) async {
    final userId = SupabaseConfig.client.auth.currentUser?.id;
    if (userId == null) return false;

    try {
      final response = await SupabaseConfig.client
          .from('visits')
          .select()
          .eq('user_id', userId)
          .eq('spot_id', spotId)
          .maybeSingle();

      return response != null;
    } catch (e) {
      print('Error checking visit status: $e');
      return false;
    }
  }
}
