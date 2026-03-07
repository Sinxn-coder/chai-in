import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String url = 'https://axitmdzhuwllrgbzxlzq.supabase.co';
  static const String anonKey =
      'sb_publishable_s3H1Bl16De43nODemXRNYw_rGDvfghZ';

  static Future<void> initialize() async {
    await Supabase.initialize(url: url, anonKey: anonKey);
  }

  static SupabaseClient get client => Supabase.instance.client;

  static String? get currentUserId => client.auth.currentUser?.id;
}
