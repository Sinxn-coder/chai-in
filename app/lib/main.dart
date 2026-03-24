import 'package:flutter/material.dart';
import 'login.dart';
import 'main_container.dart';
import 'widgets/typing_text.dart';
import 'services/permission_service.dart';
import 'supabase_config.dart';
import 'services/system_service.dart';
import 'construction_page.dart';
import 'services/connectivity_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/auth_gate.dart';
import 'package:firebase_core/firebase_core.dart';
import 'services/push_notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await SupabaseConfig.initialize();
  await ConnectivityService().initialize();
  await PushNotificationService.initialize();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      title: 'Landing Page',
      theme: ThemeData(
        primaryColor: const Color(0xFFFF0000),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFFF0000)),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LandingPage(),
        '/login': (context) => const LoginPage(),
        '/home': (context) => const MainContainer(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  final PermissionService _permissionService = PermissionService();
  bool _isLoggedIn = false;
  bool _isProfileComplete = false;
  bool _isMaintenanceMode = false;

  @override
  void initState() {
    super.initState();
    // 1. Request permissions
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        _permissionService.requestAllPermissions(context);
      }
    });

    // 2. Check for existing session
    _checkSession();
  }

  Future<void> _checkSession() async {
    // 1. Check local cache first (for speed & offline)
    final prefs = await SharedPreferences.getInstance();
    final cachedUserId = prefs.getString('cached_user_id');
    final hasRecentSession = prefs.getBool('has_active_session') ?? false;

    if (hasRecentSession && cachedUserId != null) {
      if (mounted) {
        setState(() {
          _isLoggedIn = true;
          _isProfileComplete = true; // Assume complete if successfully cached
        });
      }
    }

    // 2. Real-time check if online
    if (ConnectivityService().isConnected.value) {
      final user = SupabaseConfig.client.auth.currentUser;

      if (user != null && mounted) {
        setState(() => _isLoggedIn = true);

        // Update cache
        await prefs.setString('cached_user_id', user.id);
        await prefs.setBool('has_active_session', true);

        // Check if profile is complete
        try {
          final data = await SupabaseConfig.client
              .from('users')
              .select()
              .eq('id', user.id)
              .maybeSingle();

          if (mounted && data != null) {
            // Check for banned status
            if (data['status'] == 'banned' || data['status'] == 'blocked') {
              debugPrint('Banned session detected: ${user.id}');
              await SupabaseConfig.client.auth.signOut();
              await prefs.clear();
              setState(() {
                _isLoggedIn = false;
                _isProfileComplete = false;
              });
              return;
            }

            setState(() {
              if (data['username'] != null && data['city'] != null) {
                _isProfileComplete = true;
                // Cache profile details
                prefs.setString('user_name', data['username'] ?? '');
                prefs.setString('full_name', data['full_name'] ?? '');
              }
            });
          }
        } catch (e) {
          debugPrint('Error checking session profile: $e');
        }
      } else if (user == null) {
        await prefs.clear();
        if (mounted) {
          setState(() {
            _isLoggedIn = false;
            _isProfileComplete = false;
          });
        }
      }
    }

    // 3. Guest bypass
    final guest = await AuthGate.isGuest();
    if (guest && mounted) {
      setState(() {
        _isLoggedIn = true;
        _isProfileComplete = true; // Guests bypass profile setup
      });
    }

    // Always check maintenance mode for faster transitions later
    if (ConnectivityService().isConnected.value) {
      try {
        final isMaintenance = await SystemService.isMaintenanceMode();
        if (mounted) {
          setState(() => _isMaintenanceMode = isMaintenance);
        }
      } catch (e) {
        debugPrint('Error pre-fetching maintenance mode: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    String buttonText = 'Get Started';
    if (_isLoggedIn) {
      if (_isProfileComplete) {
        buttonText = "Let's Explore";
      } else {
        buttonText = 'Complete Profile';
      }
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFFF0000),
              Color(0xFFE60000),
              Color(0xFFCC0000),
              Color(0xFFB30000),
              Color(0xFF990000),
            ],
            stops: [0.0, 0.25, 0.5, 0.75, 1.0],
          ),
        ),
        child: Stack(
          children: [
            // Top text
            // Typing text
            Positioned(
              top: 80,
              left: 40,
              child: const TypingText(
                text: 'Find Your\nSpots',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 62,
                  height: 1.0,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'MPLUSRounded1c',
                ),
                typingSpeed: Duration(milliseconds: 200),
                pauseDuration: Duration(seconds: 2),
                initialDelay: Duration(seconds: 1),
              ),
            ),
            // Center image
            Align(
              alignment: Alignment.center,
              child: Padding(
                padding: const EdgeInsets.only(top: 80.0),
                child: Image.asset(
                  'assets/images/land.png',
                  width: 700,
                  height: 700,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            // Bottom button
            Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.only(
                  left: 20.0,
                  right: 20.0,
                  bottom: 60.0,
                  top: 20.0,
                ),
                child: Container(
                  width: double.infinity,
                  height: 70,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: () async {
                        // Check for maintenance mode (using cached value for speed)
                        final userEmail = SupabaseConfig.client.auth.currentUser?.email;
                        
                        if (_isMaintenanceMode && userEmail != 'bytspot.in@gmail.com') {
                          if (mounted) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const ConstructionPage(),
                              ),
                            );
                          }
                          return;
                        }

                        // Guest check for "Get Started"
                        final guest = await AuthGate.isGuest();

                        if ((_isLoggedIn && _isProfileComplete) || guest) {
                          if (mounted) {
                            Navigator.pushReplacementNamed(context, '/home');
                          }
                        } else {
                          if (mounted) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const LoginPage(),
                              ),
                            );
                          }
                        }
                      },
                      child: Center(
                        child: Text(
                          buttonText,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Color(0xFFFF0000),
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
