import 'package:flutter/material.dart';
import 'login.dart';
import 'main_container.dart';
import 'widgets/typing_text.dart';
import 'services/permission_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
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

  @override
  void initState() {
    super.initState();
    // Request permissions after a short delay to allow the UI to render
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        _permissionService.requestAllPermissions(context);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
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
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginPage(),
                          ),
                        );
                      },
                      child: const Center(
                        child: Text(
                          'Get Started',
                          style: TextStyle(
                            color: Color(0xFFFF0000),
                            fontSize: 22,
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
