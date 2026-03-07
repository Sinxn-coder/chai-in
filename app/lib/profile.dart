import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:ui';
import 'saved_posts.dart';
import 'my_reviews.dart';
import 'settings.dart';
import 'help_support.dart';
import 'edit_profile.dart';
import 'login.dart';
import 'services/notification_service.dart';
import 'services/notification_api_service.dart';
import 'notifications.dart';
import 'supabase_config.dart';
import 'services/follow_service.dart';
import 'widgets/food_loading.dart';

class ProfilePage extends StatefulWidget {
  final String? userId;
  const ProfilePage({super.key, this.userId});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>
    with SingleTickerProviderStateMixin {
  Map<String, dynamic>? _userData;
  bool _isLoading = true;
  int _savedCount = 0;
  int _reviewCount = 0;
  int _followersCount = 0;
  int _followingCount = 0;
  bool _isFollowing = false;
  int _unreadNotifications = 0;
  late AnimationController _fadeController;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _fetchProfile();
    _fetchStats();
    _fetchUnreadCount();
    _checkFollowStatus();
  }

  Future<void> _checkFollowStatus() async {
    if (widget.userId == null || widget.userId == SupabaseConfig.currentUserId)
      return;
    final following = await FollowService.isFollowing(widget.userId!);
    if (mounted) {
      setState(() => _isFollowing = following);
    }
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  Future<void> _fetchStats() async {
    try {
      final userId = widget.userId ?? SupabaseConfig.currentUserId;
      if (userId == null) return;

      final savedResponse = await SupabaseConfig.client
          .from('favorites')
          .select('spot_id')
          .eq('user_id', userId);

      final reviewResponse = await SupabaseConfig.client
          .from('reviews')
          .select('id')
          .eq('user_id', userId);

      final followers = await FollowService.getFollowersCount(userId);
      final following = await FollowService.getFollowingCount(userId);

      if (mounted) {
        setState(() {
          _savedCount = (savedResponse as List).length;
          _reviewCount = (reviewResponse as List).length;
          _followersCount = followers;
          _followingCount = following;
        });
      }
    } catch (e) {
      debugPrint('Error fetching stats: $e');
    }
  }

  Future<void> _fetchUnreadCount() async {
    final count = await NotificationApiService.getUnreadCount();
    if (mounted) {
      setState(() {
        _unreadNotifications = count;
      });
    }
  }

  Future<void> _fetchProfile() async {
    try {
      final userId = widget.userId ?? SupabaseConfig.currentUserId;
      if (userId == null) return;

      final data = await SupabaseConfig.client
          .from('users')
          .select()
          .eq('id', userId)
          .maybeSingle();

      if (mounted) {
        setState(() {
          _userData = data;
          _isLoading = false;
        });
        _fadeController.forward();
      }
    } catch (e) {
      debugPrint('Error fetching profile: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleLogout() async {
    try {
      await SupabaseConfig.client.auth.signOut();
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
          (route) => false,
        );
        NotificationService.show(
          message: 'Logged out successfully',
          type: NotificationType.success,
        );
      }
    } catch (e) {
      NotificationService.show(
        message: 'Logout failed: $e',
        type: NotificationType.error,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const FoodLoadingScreen();
    }

    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 360;
    final user = SupabaseConfig.client.auth.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: SafeArea(
        top: false,
        child: FadeTransition(
          opacity: _fadeController,
          child: RefreshIndicator(
            onRefresh: () async {
              await _fetchProfile();
              await _fetchStats();
              await _fetchUnreadCount();
            },
            color: const Color(0xFFFF0000),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  // 1. Scrolling Header
                  Stack(
                    children: [
                      Container(
                        height: 240,
                        width: double.infinity,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [Color(0xFFFF0000), Color(0xFFC40000)],
                          ),
                          borderRadius: BorderRadius.only(
                            bottomLeft: Radius.circular(50),
                            bottomRight: Radius.circular(50),
                          ),
                        ),
                      ),
                      // Decorative Circle
                      Positioned(
                        top: -50,
                        right: -50,
                        child: Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(20),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                      Positioned(
                        top: 50,
                        left: 20,
                        child: GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.arrow_back,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // 2. Profile Content (Moved deeper into the header)
                  Transform.translate(
                    offset: const Offset(0, -140),
                    child: Column(
                      children: [
                        // Solid Profile Card
                        Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: isSmallScreen ? 15 : 20,
                          ),
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(30),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.08),
                                  blurRadius: 40,
                                  offset: const Offset(0, 20),
                                ),
                              ],
                            ),
                            padding: const EdgeInsets.all(25),
                            child: Column(
                              children: [
                                // Top Section: Avatar + Primary Info
                                Row(
                                  children: [
                                    // Profile Picture
                                    Container(
                                      width: 90,
                                      height: 90,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: const Color(0xFFF1F1F1),
                                          width: 4,
                                        ),
                                      ),
                                      child: ClipOval(
                                        child: _buildAvatar(user),
                                      ),
                                    ),
                                    const SizedBox(width: 20),
                                    // Name & Username
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            _userData?['full_name'] ??
                                                user?.userMetadata?['full_name'] ??
                                                'User',
                                            style: const TextStyle(
                                              fontSize: 24,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFF1A1A1A),
                                              fontFamily: 'MPLUSRounded1c',
                                              letterSpacing: -0.5,
                                            ),
                                          ),
                                          if (_userData?['username'] != null)
                                            Text(
                                              '@${_userData!['username']}',
                                              style: const TextStyle(
                                                fontSize: 15,
                                                color: Color(0xFFFF0000),
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 25),
                                // Location & Email Section
                                Container(
                                  padding: const EdgeInsets.all(15),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8F9FA),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Column(
                                    children: [
                                      _buildInfoRow(
                                        Icons.email_outlined,
                                        _userData?['email'] ??
                                            (widget.userId == null
                                                ? user?.email
                                                : '') ??
                                            '',
                                      ),
                                      if (_userData?['city'] != null) ...[
                                        const SizedBox(height: 10),
                                        _buildInfoRow(
                                          Icons.location_on_outlined,
                                          _userData!['city'],
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 25),
                                // Stats Row
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    if (widget.userId == null ||
                                        widget.userId ==
                                            SupabaseConfig.currentUserId) ...[
                                      _buildStatItem(
                                        'Saved',
                                        _savedCount,
                                        Icons.bookmark_outline_rounded,
                                      ),
                                      _buildStatDivider(),
                                    ],
                                    _buildStatItem(
                                      'Followers',
                                      _followersCount,
                                      Icons.people_outline_rounded,
                                    ),
                                    _buildStatDivider(),
                                    _buildStatItem(
                                      'Following',
                                      _followingCount,
                                      Icons.person_add_outlined,
                                    ),
                                    if (widget.userId == null ||
                                        widget.userId ==
                                            SupabaseConfig.currentUserId) ...[
                                      _buildStatDivider(),
                                      _buildStatItem(
                                        'Reviews',
                                        _reviewCount,
                                        Icons.reviews_outlined,
                                      ),
                                    ],
                                  ],
                                ),
                                const SizedBox(height: 30),
                                // Action Button
                                // Action Button (Edit Profile or Follow)
                                if (widget.userId == null ||
                                    widget.userId ==
                                        SupabaseConfig.currentUserId)
                                  GestureDetector(
                                    onTap: () async {
                                      HapticFeedback.lightImpact();
                                      await Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              const EditProfilePage(),
                                        ),
                                      );
                                      _fetchProfile();
                                      _fetchStats();
                                    },
                                    child: Container(
                                      height: 55,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFFF0000),
                                        borderRadius: BorderRadius.circular(20),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(
                                              0xFFFF0000,
                                            ).withOpacity(0.2),
                                            blurRadius: 15,
                                            offset: const Offset(0, 8),
                                          ),
                                        ],
                                      ),
                                      child: const Center(
                                        child: Text(
                                          'Edit Profile Settings',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 16,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ),
                                    ),
                                  )
                                else
                                  GestureDetector(
                                    onTap: () async {
                                      HapticFeedback.mediumImpact();
                                      final success =
                                          await FollowService.toggleFollow(
                                            widget.userId!,
                                          );
                                      if (success && mounted) {
                                        setState(() {
                                          _isFollowing = !_isFollowing;
                                          if (_isFollowing) {
                                            _followersCount++;
                                          } else {
                                            _followersCount--;
                                          }
                                        });
                                        NotificationService.show(
                                          message: _isFollowing
                                              ? 'Following!'
                                              : 'Unfollowed',
                                          type: NotificationType.success,
                                        );
                                      }
                                    },
                                    child: Container(
                                      height: 55,
                                      decoration: BoxDecoration(
                                        color: _isFollowing
                                            ? Colors.grey[200]
                                            : const Color(0xFFFF0000),
                                        borderRadius: BorderRadius.circular(20),
                                        border: _isFollowing
                                            ? Border.all(
                                                color: Colors.grey[300]!,
                                              )
                                            : null,
                                      ),
                                      child: Center(
                                        child: Text(
                                          _isFollowing ? 'Following' : 'Follow',
                                          style: TextStyle(
                                            color: _isFollowing
                                                ? Colors.grey[700]
                                                : Colors.white,
                                            fontSize: 16,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 25),
                        // Menu Items
                        Container(
                          margin: EdgeInsets.symmetric(
                            horizontal: isSmallScreen ? 15 : 20,
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(25),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              if (widget.userId == null ||
                                  widget.userId ==
                                      SupabaseConfig.currentUserId) ...[
                                _buildMenuItem(
                                  icon: Icons.bookmark_outline_rounded,
                                  title: 'Saved Posts',
                                  onTap: () {
                                    HapticFeedback.selectionClick();
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const SavedPostsPage(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  icon: Icons.reviews_outlined,
                                  title: 'My Reviews',
                                  onTap: () {
                                    HapticFeedback.selectionClick();
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const MyReviewsPage(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  icon: Icons.notifications_none_rounded,
                                  title: 'Notifications',
                                  badgeCount: _unreadNotifications,
                                  onTap: () async {
                                    HapticFeedback.selectionClick();
                                    await Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const NotificationsPage(),
                                      ),
                                    );
                                    _fetchUnreadCount();
                                  },
                                ),
                              ],
                              if (widget.userId == null ||
                                  widget.userId ==
                                      SupabaseConfig.currentUserId) ...[
                                _buildMenuItem(
                                  icon: Icons.settings_outlined,
                                  title: 'Settings',
                                  onTap: () {
                                    HapticFeedback.selectionClick();
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const SettingsPage(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  icon: Icons.help_outline_rounded,
                                  title: 'Help & Support',
                                  onTap: () {
                                    HapticFeedback.selectionClick();
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const HelpSupportPage(),
                                      ),
                                    );
                                  },
                                ),
                              ],
                              if (widget.userId == null ||
                                  widget.userId == SupabaseConfig.currentUserId)
                                _buildMenuItem(
                                  icon: Icons.logout_rounded,
                                  title: 'Logout',
                                  onTap: () {
                                    HapticFeedback.heavyImpact();
                                    _showLogoutDialog(context);
                                  },
                                  isLast: true,
                                )
                              else
                                const SizedBox.shrink(),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 50),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey[400]),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: Color(0xFF4B5563),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatDivider() {
    return Container(
      height: 35,
      width: 1.5,
      color: Colors.grey.withOpacity(0.15),
    );
  }

  Widget _buildStatItem(String label, int count, IconData icon) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFF0000).withAlpha(20),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: const Color(0xFFFF0000), size: 22),
        ),
        const SizedBox(height: 10),
        Text(
          count.toString(),
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF1A1A1A),
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    int badgeCount = 0,
    bool isLast = false,
  }) {
    final bool isLogout = title == 'Logout';
    final Color itemColor = isLogout
        ? const Color(0xFFFF0000)
        : const Color(0xFF1A1A1A);
    final Color iconColor = isLogout
        ? const Color(0xFFFF0000)
        : const Color(0xFF6B7280);

    return Column(
      children: [
        ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 4,
          ),
          leading: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isLogout
                  ? const Color(0xFFFF0000).withAlpha(20)
                  : const Color(0xFF1A1A1A).withAlpha(12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          title: Row(
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  color: itemColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
              if (badgeCount > 0) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF0000),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    badgeCount > 99 ? '99+' : badgeCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ],
          ),
          trailing: Icon(
            Icons.arrow_forward_ios,
            color: isLogout
                ? const Color(0xFFFF0000).withOpacity(0.5)
                : const Color(0xFF9CA3AF),
            size: 16,
          ),
          onTap: onTap,
        ),
        if (!isLast)
          const Divider(
            height: 1,
            color: Color(0xFFE5E7EB),
            indent: 16,
            endIndent: 16,
          ),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          'Logout',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontFamily: 'MPLUSRounded1c',
          ),
        ),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: TextStyle(
                color: Colors.grey[600],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _handleLogout();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF0000),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Logout',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAvatar(user) {
    final avatarUrl =
        _userData?['avatar_url'] ?? user?.userMetadata?['avatar_url'];

    if (avatarUrl == null || avatarUrl.isEmpty) {
      return Image.asset('assets/images/icon.png', fit: BoxFit.cover);
    }

    if (avatarUrl.startsWith('http')) {
      return Image.network(
        avatarUrl,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) =>
            Image.asset('assets/images/icon.png', fit: BoxFit.cover),
      );
    }

    return Image.asset('assets/images/icon.png', fit: BoxFit.cover);
  }
}
