import 'dart:async';
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
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:js' as js;
import 'services/push_notification_service.dart';

// Global future to track initialization status
Future<void>? _initFuture;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase as early as possible for web session recovery
  await _safeInit('Supabase', () => SupabaseConfig.initialize());
  
  // Start the engine
  runApp(const MyApp());
  
  // Run other initializations in the background
  _initFuture = _initServices();
}

Future<void> _initServices() async {
  bool firebaseSucceeded = false;
  // 1. Core Firebase - Handle separately as it often fails on web without config
  try {
    if (kIsWeb) {
      debugPrint('Initializing Firebase for Web...');
      await Firebase.initializeApp();
      firebaseSucceeded = true;
      debugPrint('Firebase initialized successfully on Web');
    } else {
      await Firebase.initializeApp();
      firebaseSucceeded = true;
      debugPrint('Firebase initialized successfully');
    }
  } catch (e) {
    debugPrint('Firebase initialization skipped/failed: $e');
  }

  // 2. Initialize remaining services in parallel
  final List<Future<void>> services = [
    _safeInit('Connectivity', () => ConnectivityService().initialize()),
  ];

  // Only init PushNotifications if Firebase succeeded
  if (firebaseSucceeded) {
    services.add(_safeInit('PushNotifications', () => PushNotificationService.initialize()));
  } else {
    debugPrint('PushNotifications initialization skipped because Firebase is not available');
  }

  await Future.wait(services);
  debugPrint('Background services initialization sequence completed');
}

Future<void> _safeInit(String name, Future<void> Function() initFunc) async {
  try {
    await initFunc();
    debugPrint('$name initialized successfully');
  } catch (e) {
    debugPrint('Error initializing $name: $e');
  }
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
      initialRoute: _resolveInitialRoute(),
      routes: {
        '/': (context) => const LandingPage(),
        '/login': (context) => const LoginPage(),
        '/home': (context) => const MainContainer(),
      },
      debugShowCheckedModeBanner: false,
    );
  }

  String _resolveInitialRoute() {
    if (!kIsWeb) {
      return '/';
    }

    final fragment = Uri.base.fragment.trim();
    if (fragment.startsWith('/login')) {
      return '/login';
    }
    if (fragment.startsWith('/home')) {
      return '/home';
    }

    final isOAuthCallback =
        Uri.base.queryParameters.containsKey('code') ||
        fragment.contains('access_token') ||
        fragment.contains('refresh_token');

    if (isOAuthCallback) {
      return '/login';
    }

    return '/';
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
  bool _hasNavigated = false;
  bool _isImageLoaded = false;
  bool _isSessionChecked = false;
  bool _isSplashDismissed = false;
  Timer? _autoNavTimer;

  @override
  void initState() {
    super.initState();
    // Cache the background image instantly
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        await precacheImage(const AssetImage('assets/images/land.png'), context);
      } catch (e) {
        debugPrint('Image precache failed: $e');
      }
      _checkSession().then((_) {
        _isSessionChecked = true;
        _maybeDismissSplash();
      });
    });
  }

  void _maybeDismissSplash() {
    if (!kIsWeb || _isSplashDismissed) return;
    
    // Dismiss only when image is rendered AND session is checked
    if (_isImageLoaded && _isSessionChecked) {
      _isSplashDismissed = true;
      Future.delayed(const Duration(milliseconds: 200), () {
        js.context.callMethod('hideLoadingIndicator');
      });
    }
  }

  @override
  void dispose() {
    _autoNavTimer?.cancel();
    super.dispose();
  }

  void _startAutoNavTimer() {
    if (_hasNavigated) return;
    _autoNavTimer?.cancel();
    _autoNavTimer = Timer(const Duration(seconds: 2), () {
      if (mounted && _isLoggedIn && !_hasNavigated) {
        _navigateToNext(isAutomatic: true);
      }
    });
  }

  Future<void> _checkSession() async {
    // 1. Initialize SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    
    // 2. Web Optimization: Don't ask for permissions on startup.
    // Browsers block/hate multiple startup permission popups.
    // Permissions will be requested contextually when features are used.
    if (!kIsWeb) {
      _permissionService.requestAllPermissions(context);
    }

    // 2. Immediate UI check from cache
    final cachedUserId = prefs.getString('cached_user_id');
    final hasRecentSession = prefs.getBool('has_active_session') ?? false;

    if (hasRecentSession && cachedUserId != null) {
      if (mounted) {
        setState(() {
          _isLoggedIn = true;
          _isProfileComplete = true;
        });
        _startAutoNavTimer();
      }
    }

    // 3. For Web: Wait for session recovery if we see a code in URL
    if (kIsWeb) {
      final uri = Uri.base;
      if (uri.queryParameters.containsKey('code') || uri.fragment.contains('access_token')) {
        debugPrint('Web Auth Redirect detected. Waiting for session recovery...');
        // Give it a small delay for Supabase to recover the session from URL
        await Future.delayed(const Duration(milliseconds: 1500));
      }
    }

    // 4. Parallel non-blocking Network Checks (Wait for services first)
    unawaited(_runNetworkChecksAfterInit(prefs));
  }

  Future<void> _runNetworkChecksAfterInit(SharedPreferences prefs) async {
    // Vital: Wait for Firebase/Supabase/Connectivity to be ready
    if (_initFuture != null) {
      await _initFuture;
    }
    
    if (mounted) {
      unawaited(_runBackgroundChecks(prefs));
    }
  }

  Future<void> _runBackgroundChecks(SharedPreferences prefs) async {
    if (!ConnectivityService().isConnected.value) return;

    try {
      // Parallelize profile and maintenance checks
      final results = await Future.wait([
        SystemService.isMaintenanceMode(),
        _verifyNetworkSession(prefs),
      ]);

      if (mounted) {
        setState(() {
          _isMaintenanceMode = results[0] as bool;
        });
      }
    } catch (e) {
      debugPrint('Background startup checks failed: $e');
    }
  }

  Future<void> _verifyNetworkSession(SharedPreferences prefs) async {
    final user = SupabaseConfig.client.auth.currentUser;
    if (user == null) {
      await prefs.clear();
      if (mounted) {
        setState(() {
          _isLoggedIn = false;
          _isProfileComplete = false;
        });
      }
      return;
    }

    // We have a user, check profile
    try {
      final data = await SupabaseConfig.client
          .from('users')
          .select()
          .eq('id', user.id)
          .maybeSingle();

      if (data != null && mounted) {
        // Banned check
        if (data['status'] == 'banned' || data['status'] == 'blocked') {
          await SupabaseConfig.client.auth.signOut();
          await prefs.clear();
          setState(() {
            _isLoggedIn = false;
            _isProfileComplete = false;
          });
          return;
        }

        setState(() {
          _isLoggedIn = true;
          if (data['username'] != null && data['city'] != null) {
            _isProfileComplete = true;
            prefs.setString('user_name', data['username'] ?? '');
            prefs.setString('full_name', data['full_name'] ?? '');
            _startAutoNavTimer();
          }
        });
        
        // Push Notification Sync
        PushNotificationService.syncTokenWithSupabase();
      }
    } catch (e) {
      debugPrint('Error in network session verification: $e');
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
      backgroundColor: Colors.white,
      body: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        decoration: BoxDecoration(
          gradient: _isImageLoaded 
            ? const LinearGradient(
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
              )
            : null,
          color: _isImageLoaded ? null : Colors.white,
        ),
        child: Stack(
          children: [
            if (_isImageLoaded) ...[
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
                  typingSpeed: Duration(milliseconds: 100),
                  pauseDuration: Duration(seconds: 2),
                  initialDelay: Duration(milliseconds: 500),
                ),
              ),
            ],
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
                  frameBuilder: (context, child, frame, wasSynchronouslyLoaded) {
                    if (frame != null && !_isImageLoaded) {
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        if (mounted) {
                          setState(() => _isImageLoaded = true);
                          _maybeDismissSplash();
                        }
                      });
                    }
                    return child;
                  },
                ),
              ),
            ),
            // Bottom button
            if (_isLoggedIn && !_isProfileComplete && _isImageLoaded)
              // This is where it was stuck! Add the redirect prompt or just wait for timer.
              const SizedBox.shrink(),
            
            if (!(_isLoggedIn && _isProfileComplete && !_hasNavigated) && _isImageLoaded)
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
                      onTap: () => _navigateToNext(isAutomatic: false),
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

  Future<void> _navigateToNext({bool isAutomatic = false}) async {
    if (_hasNavigated) return;
    if (!mounted) return;

    // Safety: Ensure background services are ready before network calls
    if (_initFuture != null) await _initFuture;

    // Check for maintenance mode
    if (_isMaintenanceMode) {
      _hasNavigated = true;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const ConstructionPage()),
      );
      return;
    }

    // Guest check
    final guest = await AuthGate.isGuest();

    if ((_isLoggedIn && _isProfileComplete) || guest) {
      _hasNavigated = true;
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const MainContainer(),
            transitionDuration: const Duration(milliseconds: 800),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              final curve = CurvedAnimation(parent: animation, curve: Curves.easeOutQuart);
              return FadeTransition(
                opacity: Tween<double>(begin: 0.0, end: 1.0).animate(curve),
                child: ScaleTransition(
                  scale: Tween<double>(begin: 0.95, end: 1.0).animate(curve),
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.05),
                      end: Offset.zero,
                    ).animate(curve),
                    child: child,
                  ),
                ),
              );
            },
          ),
        );
      }
    } else if (!isAutomatic || (_isLoggedIn && !_isProfileComplete)) {
      // Manual click OR automatic redirect for incomplete profile
      _hasNavigated = true;
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    }
  }
}
