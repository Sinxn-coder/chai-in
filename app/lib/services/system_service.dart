import '../supabase_config.dart';

class SystemService {
  /// Check if the app is in maintenance mode
  static Future<bool> isMaintenanceMode() async {
    try {
      final response = await SupabaseConfig.client
          .from('system_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .maybeSingle();

      if (response == null) return false;
      
      final value = response['value'];
      return value == true || value == 'true';
    } catch (e) {
      print('Error checking maintenance mode: $e');
      return false;
    }
  }
}
