import 'supabase_config.dart';

class SupabaseTest {
  static Future<Map<String, dynamic>> testConnection() async {
    try {
      final response = await SupabaseConfig.client
          .from('test_table')
          .select('*')
          .limit(1);

      return {
        'success': true,
        'message':
            'Connected to Supabase (table doesn\'t exist yet - this is expected)',
        'data': response,
      };
    } catch (err) {
      return {'success': false, 'error': err.toString()};
    }
  }

  static Future<Map<String, dynamic>> testAuth() async {
    try {
      final session = SupabaseConfig.client.auth.currentSession;
      return {'success': true, 'authenticated': session != null};
    } catch (err) {
      return {'success': false, 'error': err.toString()};
    }
  }
}
