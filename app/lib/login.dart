import 'package:flutter/material.dart';
import 'main_container.dart';
import 'widgets/app_background.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool isLogin = true;
  bool showContinueFields = false;
  bool showProfileFields = false;

  final TextEditingController _loginUsernameController =
      TextEditingController();
  final TextEditingController _loginFullNameController =
      TextEditingController();
  final TextEditingController _signupUsernameController =
      TextEditingController();
  final TextEditingController _signupFullNameController =
      TextEditingController();
  final TextEditingController _signupCityController = TextEditingController();

  void _simulateGoogleSignIn() {
    setState(() {
      _loginUsernameController.text = "Sinxn_coder";
      _loginFullNameController.text = "Sinan Coder";
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Auto-filled from Google Account'),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  void dispose() {
    _loginUsernameController.dispose();
    _loginFullNameController.dispose();
    _signupUsernameController.dispose();
    _signupFullNameController.dispose();
    _signupCityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: AppBackground(
        child: Stack(
          children: [
            // Header Section
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: MediaQuery.of(context).size.height * 0.4,
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Color(0xFFFF0000),
                      Color(0xFFE60000),
                      Color(0xFFCC0000),
                      Color(0xFFE60000),
                      Color(0xFFFF0000),
                    ],
                    stops: [0.0, 0.25, 0.5, 0.75, 1.0],
                  ),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(40),
                    bottomRight: Radius.circular(40),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFF0000).withValues(alpha: 0.2),
                      blurRadius: 15,
                      spreadRadius: 3,
                    ),
                    const BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: 20,
                      left: 0,
                      right: 0,
                      child: Center(
                        child: Image.asset(
                          'assets/images/logo_light.png',
                          width: 280,
                          height: 280,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    Positioned(
                      top: 190,
                      left: 0,
                      right: 0,
                      child: Center(
                        child: Image.asset(
                          'assets/images/type_light.png',
                          width: 180,
                          height: 60,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 8,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () => setState(() {
                              isLogin = true;
                              showContinueFields = false;
                              showProfileFields = false;
                            }),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 10,
                              ),
                              child: Text(
                                'Login',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                          Container(
                            width: 1,
                            height: 20,
                            color: Colors.grey[300],
                          ),
                          GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () => setState(() => isLogin = false),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 10,
                              ),
                              child: Text(
                                'Sign-up',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 300),
                      bottom: 0,
                      left: isLogin
                          ? (MediaQuery.of(context).size.width / 4) - 50
                          : (MediaQuery.of(context).size.width * 3 / 4) - 50,
                      child: Container(
                        width: 100,
                        height: 3,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(20),
                            topRight: Radius.circular(20),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content Region
            Positioned(
              top: MediaQuery.of(context).size.height * 0.4,
              left: 0,
              right: 0,
              bottom: 0,
              child: SingleChildScrollView(
                padding: EdgeInsets.only(
                  left: 40,
                  right: 40,
                  top: 20,
                  bottom: MediaQuery.of(context).viewInsets.bottom + 120,
                ),
                child: Column(
                  children: [
                    if (isLogin) ...[
                      const SizedBox(height: 30),
                      TextField(
                        controller: _loginUsernameController,
                        readOnly: true,
                        decoration: InputDecoration(
                          hintText: 'Username (Click Google Sign-In)',
                          hintStyle: TextStyle(color: Colors.grey[400]),
                          suffixIcon: Icon(
                            Icons.lock_outline,
                            size: 20,
                            color: Colors.grey[400],
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          focusedBorder: const UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Color(0xFFFF0000),
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _loginFullNameController,
                        readOnly: true,
                        decoration: InputDecoration(
                          hintText: 'Full Name (Click Google Sign-In)',
                          hintStyle: TextStyle(color: Colors.grey[400]),
                          suffixIcon: Icon(
                            Icons.lock_outline,
                            size: 20,
                            color: Colors.grey[400],
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          focusedBorder: const UnderlineInputBorder(
                            borderSide: BorderSide(
                              color: Color(0xFFFF0000),
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 50),
                      _buildGoogleButton(
                        text: 'Sign in with Google',
                        onTap: _simulateGoogleSignIn,
                      ),
                    ] else ...[
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 600),
                        transitionBuilder: (child, animation) =>
                            ScaleTransition(
                              scale: Tween<double>(begin: 0.8, end: 1.0)
                                  .animate(
                                    CurvedAnimation(
                                      parent: animation,
                                      curve: Curves.elasticOut,
                                    ),
                                  ),
                              child: SlideTransition(
                                position:
                                    Tween<Offset>(
                                      begin: const Offset(0.3, 0),
                                      end: Offset.zero,
                                    ).animate(
                                      CurvedAnimation(
                                        parent: animation,
                                        curve: Curves.easeOutCubic,
                                      ),
                                    ),
                                child: FadeTransition(
                                  opacity: animation,
                                  child: child,
                                ),
                              ),
                            ),
                        child: _buildSignupStep(),
                      ),
                    ],
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ),

            // Action Button
            Positioned(
              bottom: 50,
              left: 20,
              right: 20,
              child: GestureDetector(
                onTap: () {
                  if (isLogin) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MainContainer(),
                      ),
                    );
                    return;
                  }
                  setState(() {
                    if (!showContinueFields && !showProfileFields) {
                      showContinueFields = true;
                    } else if (showContinueFields && !showProfileFields) {
                      showProfileFields = true;
                      showContinueFields = false;
                    } else if (showProfileFields) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MainContainer(),
                        ),
                      );
                    }
                  });
                },
                child: Container(
                  height: 70,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF0000),
                    borderRadius: BorderRadius.circular(35),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      (isLogin || showProfileFields)
                          ? "Let's Explore"
                          : 'Continue',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
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

  Widget _buildSignupStep() {
    if (!showContinueFields && !showProfileFields) {
      return Column(
        key: const ValueKey('welcome'),
        children: [
          const SizedBox(height: 40),
          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: [Color(0xFF1F1F1F), Color(0xFF5D5D5D)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ).createShader(bounds),
            child: const Text(
              'Welcome',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 68,
                letterSpacing: -2.5,
                fontWeight: FontWeight.w900,
                fontFamily: 'Ubuntu',
                height: 1.0,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Find the right food spot,\nat the right time.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 22,
              letterSpacing: -0.5,
              fontWeight: FontWeight.w500,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 60),
          _buildGoogleButton(
            text: 'Sign up with Google',
            onTap: () => setState(() => showContinueFields = true),
          ),
        ],
      );
    } else if (showContinueFields) {
      return Column(
        key: const ValueKey('info'),
        children: [
          const SizedBox(height: 30),
          TextField(
            controller: _signupUsernameController,
            decoration: InputDecoration(
              hintText: 'Choose Username',
              hintStyle: TextStyle(color: Colors.grey[400]),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
              ),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFFFF0000), width: 2),
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: _signupFullNameController,
            decoration: InputDecoration(
              hintText: 'Enter Full Name',
              hintStyle: TextStyle(color: Colors.grey[400]),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
              ),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFFFF0000), width: 2),
              ),
            ),
          ),
        ],
      );
    } else {
      return Column(
        key: const ValueKey('profile'),
        children: [
          const SizedBox(height: 10),
          Center(
            child: Container(
              height: 120,
              width: 120,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(60),
                border: Border.all(color: const Color(0xFFFF0000), width: 2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.camera_alt, size: 35, color: Color(0xFFFF0000)),
                  SizedBox(height: 5),
                  Text(
                    'Add Photo',
                    style: TextStyle(
                      color: Color(0xFFFF0000),
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 30),
          TextField(
            controller: _signupCityController,
            decoration: InputDecoration(
              hintText: 'Enter Your City',
              hintStyle: TextStyle(color: Colors.grey[400]),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
              ),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFFFF0000), width: 2),
              ),
            ),
          ),
        ],
      );
    }
  }

  Widget _buildGoogleButton({
    required String text,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 60,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFFF0000), width: 2),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 3,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: const BoxDecoration(
                color: Color(0xFF4285F4),
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Text(
                  'G',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              text,
              style: const TextStyle(
                color: Colors.black87,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
