import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'dart:ui';
import 'main_container.dart';
import 'services/notification_service.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'supabase_config.dart';
import 'terms_and_conditions.dart';
import 'privacy.dart';
import 'widgets/food_loading.dart';

enum AuthState { initial, registering, welcomeBack }

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  AuthState _authState = AuthState.initial;
  bool _isLoading = false;
  bool _acceptedTerms = false;

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();

  Map<String, dynamic>? _existingProfile;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeIn,
    );
    _animationController.forward();
  }

  Future<void> _handleSignOut() async {
    setState(() => _isLoading = true);
    try {
      await SupabaseConfig.client.auth.signOut();
      final GoogleSignIn googleSignIn = GoogleSignIn();

      // Use disconnect() to clear the Google session and force account selection next time
      try {
        await googleSignIn.disconnect();
      } catch (e) {
        // disconnect() can fail if there's no active session, fallback to signOut()
        await googleSignIn.signOut();
      }

      if (mounted) {
        _animationController.reset();
        setState(() {
          _authState = AuthState.initial;
          _existingProfile = null;
          _fullNameController.clear();
          _usernameController.clear();
          _cityController.clear();
        });
        _animationController.forward();
      }
    } catch (e) {
      debugPrint('Error signing out: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    if (!_acceptedTerms) {
      NotificationService.show(
        message: 'Accpet terms and conditions to proceed',
        type: NotificationType.error,
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      const webClientId =
          '139410303233-knd9qh4d9eqlrflk81pdpg996f27aosj.apps.googleusercontent.com';
      const androidClientId =
          '139410303233-eqkm6u5c7iq5eh6fvuf81ldbi0r3g2po.apps.googleusercontent.com';

      final googleSignIn = GoogleSignIn(
        clientId: androidClientId,
        serverClientId: webClientId,
      );

      // Force sign out first to ensure account selection prompt
      await googleSignIn.signOut();

      final googleUser = await googleSignIn.signIn();
      if (googleUser == null) {
        setState(() => _isLoading = false);
        return;
      }

      final googleAuth = await googleUser.authentication;
      final accessToken = googleAuth.accessToken;
      final idToken = googleAuth.idToken;

      if (accessToken == null || idToken == null) {
        throw 'Missing tokens.';
      }

      final response = await SupabaseConfig.client.auth.signInWithIdToken(
        provider: OAuthProvider.google,
        idToken: idToken,
        accessToken: accessToken,
      );

      if (response.user != null) {
        await _checkUserProfile(response.user!);
      }
    } catch (e) {
      NotificationService.show(
        message: 'Auth Error: ${e.toString()}',
        type: NotificationType.error,
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _checkUserProfile(User user) async {
    try {
      debugPrint('Checking profile for user: ${user.id}');
      final data = await SupabaseConfig.client
          .from('users')
          .select()
          .eq('id', user.id)
          .maybeSingle();

      debugPrint('Profile data fetched: $data');

      if (data != null) {
        _existingProfile = data;
        _fullNameController.text =
            data['full_name'] ?? user.userMetadata?['full_name'] ?? '';
        _usernameController.text = data['username'] ?? '';
        _cityController.text = data['city'] ?? '';
        debugPrint(
          'Controllers populated: ${_fullNameController.text}, ${_usernameController.text}, ${_cityController.text}',
        );
      } else {
        debugPrint('No profile found in DB, using metadata');
        _fullNameController.text = user.userMetadata?['full_name'] ?? '';
      }

      if (data != null && data['username'] != null && data['city'] != null) {
        setState(() {
          _authState = AuthState.welcomeBack;
        });
      } else {
        setState(() {
          _authState = AuthState.registering;
        });
      }
      _animationController.forward();
    } catch (e) {
      debugPrint('Error checking profile: $e');
    }
  }

  Future<void> _completeRegistration() async {
    final user = SupabaseConfig.client.auth.currentUser;
    if (user == null) return;

    final newUsername = _usernameController.text.trim();
    final newFullName = _fullNameController.text.trim();
    final newCity = _cityController.text.trim();

    if (newUsername.isEmpty || newFullName.isEmpty || newCity.isEmpty) {
      NotificationService.show(
        message: 'Username, Full Name, and City are required',
        type: NotificationType.error,
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      // 1. Check if username is being changed and if it violates the 24h rule
      if (_existingProfile != null &&
          _existingProfile!['username'] != null &&
          _existingProfile!['username'] != newUsername) {
        final lastChanged = _existingProfile!['username_last_changed_at'];
        if (lastChanged != null) {
          final lastDate = DateTime.parse(lastChanged);
          final now = DateTime.now();
          final difference = now.difference(lastDate);

          if (difference.inHours < 24) {
            final remainingHours = 24 - difference.inHours;
            NotificationService.show(
              message:
                  'You can change your username again in $remainingHours hours',
              type: NotificationType.error,
            );
            setState(() => _isLoading = false);
            return;
          }
        }
      }

      // 2. Prepare update data
      final Map<String, dynamic> updateData = {
        'id': user.id,
        'email': user.email,
        'username': newUsername,
        'full_name': newFullName,
        'city': newCity,
        'avatar_url': user.userMetadata?['avatar_url'],
        'updated_at': DateTime.now().toIso8601String(),
      };

      // If username is new, update the timestamp
      if (_existingProfile == null ||
          _existingProfile!['username'] != newUsername) {
        updateData['username_last_changed_at'] = DateTime.now()
            .toIso8601String();
      }

      await SupabaseConfig.client.from('users').upsert(updateData);

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainContainer()),
        );
      }
    } on PostgrestException catch (e) {
      String message = 'Registration failed: ${e.message}';
      if (e.code == '23505') {
        // Unique constraint violation (23505 is PostgreSQL error code for unique_violation)
        message = 'This username is already taken. Please choose another one.';
      }
      NotificationService.show(message: message, type: NotificationType.error);
    } catch (e) {
      NotificationService.show(
        message: 'Registration failed: $e',
        type: NotificationType.error,
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _fullNameController.dispose();
    _cityController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFF0000), // Base Red
      resizeToAvoidBottomInset: false,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFFF1A1A),
              Color(0xFFFF0000),
              Color(0xFFE60000),
              Color(0xFFCC0000),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const Spacer(flex: 3),

              // Branded Circular Logo
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.15),
                ),
                child: Image.asset(
                  'assets/images/logo_light.png',
                  height: 120,
                  width: 120,
                  fit: BoxFit.contain,
                ),
              ),
              const SizedBox(height: 15),
              Image.asset(
                'assets/images/type_light.png',
                height: 40,
                fit: BoxFit.contain,
              ),

              const Spacer(flex: 4),

              // Glassmorphic Auth Container
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(30),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.2),
                          width: 1.5,
                        ),
                      ),
                      child: Column(
                        children: [
                          FadeTransition(
                            opacity: _fadeAnimation,
                            child: AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              child: _buildAuthView(),
                            ),
                          ),
                          if (_authState == AuthState.initial) ...[
                            const SizedBox(height: 25),
                            _buildLegalCheckbox(),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const Spacer(flex: 2),

              // Main Action Button (Floating Style)
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24.0,
                  vertical: 30,
                ),
                child: _buildActionButton(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAuthView() {
    switch (_authState) {
      case AuthState.initial:
        return Column(
          key: const ValueKey('initial'),
          children: [
            const Text(
              'Welcome Back',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Sign in to your account and explore the best food spots near you.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 15,
                color: Colors.white.withOpacity(0.8),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 35),
            _buildGoogleButton(),
          ],
        );

      case AuthState.registering:
        return Column(
          key: const ValueKey('registering'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'New Explorer',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              'Complete your profile to join us.',
              style: TextStyle(color: Colors.white.withOpacity(0.8)),
            ),
            const SizedBox(height: 25),
            _buildGlassField(
              _fullNameController,
              'Full Name',
              Icons.person_outline,
            ),
            const SizedBox(height: 15),
            _buildGlassField(
              _usernameController,
              'Username',
              Icons.alternate_email,
            ),
            const SizedBox(height: 15),
            _buildGlassField(
              _cityController,
              'Your City',
              Icons.location_on_outlined,
            ),
            const SizedBox(height: 15),
            Center(
              child: TextButton(
                onPressed: _handleSignOut,
                child: const Text(
                  'Use a different account?',
                  style: TextStyle(
                    color: Colors.white70,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ),
          ],
        );

      case AuthState.welcomeBack:
        return Column(
          key: const ValueKey('welcomeBack'),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(
              child: Text(
                'Welcome Back!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 5),
            Center(
              child: Text(
                'Verify or update your profile.',
                style: TextStyle(color: Colors.white.withOpacity(0.8)),
              ),
            ),
            const SizedBox(height: 25),
            _buildGlassField(
              _fullNameController,
              'Full Name',
              Icons.person_outline,
            ),
            const SizedBox(height: 15),
            _buildGlassField(
              _usernameController,
              'Username',
              Icons.alternate_email,
            ),
            const SizedBox(height: 15),
            _buildGlassField(
              _cityController,
              'Your City',
              Icons.location_on_outlined,
            ),
            const SizedBox(height: 15),
            Center(
              child: TextButton(
                onPressed: _handleSignOut,
                child: const Text(
                  'Sign out',
                  style: TextStyle(
                    color: Colors.white70,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ),
          ],
        );
    }
  }

  Widget _buildLegalCheckbox() {
    return Row(
      children: [
        SizedBox(
          width: 24,
          height: 24,
          child: Checkbox(
            value: _acceptedTerms,
            side: const BorderSide(color: Colors.white70, width: 1.5),
            activeColor: Colors.white,
            checkColor: const Color(0xFFFF0000),
            onChanged: (val) => setState(() => _acceptedTerms = val ?? false),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12.5,
              ),
              children: [
                const TextSpan(text: 'By signing in, I agree to the '),
                TextSpan(
                  text: 'Terms',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TermsAndConditionsPage(),
                      ),
                    ),
                ),
                const TextSpan(text: ' and '),
                TextSpan(
                  text: 'Privacy Policy',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PrivacyPage(),
                      ),
                    ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGoogleButton() {
    final bool canProceed = _acceptedTerms;

    return InkWell(
      onTap: _isLoading ? null : _handleGoogleSignIn,
      borderRadius: BorderRadius.circular(15),
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 300),
        opacity: canProceed ? 1.0 : 0.6,
        child: Container(
          height: 60,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              if (canProceed)
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
            ],
          ),
          child: _isLoading
              ? const Center(child: FoodLoading(size: 30))
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Safe Custom Google Icon (No Image.network SVG issues)
                    Container(
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: Colors.grey[200]!),
                      ),
                      child: const Center(
                        child: Text(
                          'G',
                          style: TextStyle(
                            color: Color(0xFF4285F4),
                            fontWeight: FontWeight.w900,
                            fontSize: 18,
                            fontFamily: 'Roboto',
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 15),
                    const Text(
                      'Continue with Google',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1A1A1A),
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildActionButton() {
    if (_authState == AuthState.initial) return const SizedBox.shrink();

    String text = 'Let\'s Go!';
    if (_authState == AuthState.registering) {
      text = 'Join the Community';
    }

    return InkWell(
      onTap: _isLoading ? null : _completeRegistration,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        height: 65,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Center(
          child: _isLoading
              ? const FoodLoading(size: 40)
              : Text(
                  text,
                  style: const TextStyle(
                    color: Color(0xFFFF0000),
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildGlassField(
    TextEditingController controller,
    String hint,
    IconData icon,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: TextField(
        controller: controller,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
          prefixIcon: Icon(icon, color: Colors.white70, size: 20),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            vertical: 18,
            horizontal: 20,
          ),
        ),
      ),
    );
  }
}
