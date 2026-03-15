import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/material.dart';
import 'dart:ui';
import 'services/notification_service.dart';
import 'services/image_helper.dart';
import 'services/post_service.dart';
import 'services/follow_service.dart';
import 'widgets/food_loading.dart';
import 'supabase_config.dart';
import 'profile.dart';
import 'user_profile.dart';
import 'create_post.dart';
import 'spot_details.dart';
import 'services/auth_gate.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({super.key});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  bool _isSearchFocused = false; // Track search bar focus state
  final FocusNode _searchFocusNode = FocusNode(); // Focus node for search bar
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  List<Map<String, dynamic>> get _filteredPosts {
    if (_searchQuery.isEmpty) return _posts;
    final query = _searchQuery.toLowerCase();
    return _posts.where((post) {
      final content = (post['content'] ?? '').toString().toLowerCase();
      final userName = (post['userName'] ?? '').toString().toLowerCase();
      return content.contains(query) || userName.contains(query);
    }).toList();
  }

  List<Map<String, dynamic>> _posts = [];
  List<Map<String, dynamic>> _foundUsers = [];
  Set<String> _followingIds = {};
  bool _isLoading = true;
  bool _isSearchingUsers = false;
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  RealtimeChannel? _followSubscription;

  @override
  void initState() {
    super.initState();
    _fetchPosts();
    _setupRealtimeFollows();
    _scrollController.addListener(() {
      if (mounted) {
        setState(() {
          _isScrolled = _scrollController.offset > 50;
        });
      }
    });
  }

  Future<void> _fetchPosts() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    try {
      debugPrint('Fetching posts and likes...');

      // Fetch posts, liked IDs, saved IDs, and following IDs in parallel
      final results = await Future.wait([
        PostService.getPosts(),
        PostService.getLikedPostIds(),
        PostService.getSavedPostIds(),
        FollowService.getFollowingIds(),
      ]);

      final List<Map<String, dynamic>> rawPosts =
          results[0] as List<Map<String, dynamic>>;
      final Set<String> likedPostIds = results[1] as Set<String>;
      final Set<String> savedPostIds = results[2] as Set<String>;
      final Set<String> followingIds = results[3] as Set<String>;

      if (mounted) {
        // Collect names of spots that are mentioned but not linked
        final unlinkedNames = rawPosts
            .where((p) => p['spot_id'] == null && p['spot_name'] != null)
            .map((p) => p['spot_name'] as String)
            .toSet()
            .toList();

        // Fetch spot details for those names
        final recoveredSpots = await PostService.getSpotsByNames(unlinkedNames);

        setState(() {
          _posts = rawPosts.map((post) {
            final author = post['author'] as Map<String, dynamic>?;
            
            // Try to link spot by name if it's missing but we found a match
            var spotData = post['spot'];
            final sName = post['spot_name'];
            if (spotData == null && sName != null && recoveredSpots.containsKey(sName)) {
              spotData = recoveredSpots[sName];
            }

            return {
              'id': post['id'],
              'userName': author?['username'] ?? author?['full_name'] ?? 'User',
              'userPfp': author?['avatar_url'],
              'time': _formatTimestamp(post['created_at']),
              'content': post['content'] ?? '',
              'images': List<String>.from(post['images'] ?? []),
              'currentImageIndex': 0,
              'likes': post['likes_count'] ?? 0,
              'isLiked': likedPostIds.contains(post['id'].toString()),
              'isSaved': savedPostIds.contains(post['id'].toString()),
              'isFollowing': followingIds.contains(post['user_id']?.toString()),
              'authorId': post['user_id']?.toString(),
              'authorEmail': author?['email'] ?? '',
              'spot': spotData,
              'spotName': sName,
              'showSpotPopup': false,
            };
          }).toList();
          _followingIds = followingIds;
          _isLoading = false;
        });
      }
    } catch (e, stack) {
      debugPrint('Error fetching posts: $e');
      debugPrint('Stack trace: $stack');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _searchUsers(String query) async {
    if (query.length < 2) {
      setState(() {
        _foundUsers = [];
        _isSearchingUsers = false;
      });
      return;
    }

    setState(() => _isSearchingUsers = true);
    final users = await FollowService.searchUsers(query);
    if (mounted) {
      setState(() {
        _foundUsers = users;
        _isSearchingUsers = false;
      });
    }
  }

  String _formatTimestamp(String timestamp) {
    try {
      final date = DateTime.parse(timestamp);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inMinutes < 1) return 'Just now';
      if (difference.inHours < 1) return '${difference.inMinutes}m ago';
      if (difference.inDays < 1) return '${difference.inHours}h ago';
      if (difference.inDays < 7) return '${difference.inDays}d ago';

      // Simpler fallback without intl
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return 'Some time ago';
    }
  }

  void _setupRealtimeFollows() {
    final currentUserId = SupabaseConfig.currentUserId;
    if (currentUserId == null) return;

    _followSubscription = SupabaseConfig.client
        .channel('public:follows')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'follows',
          callback: (payload) {
            debugPrint('Real-time follow change: ${payload.toString()}');
            final Map<String, dynamic> newRecord = payload.newRecord;
            final Map<String, dynamic> oldRecord = payload.oldRecord;

            // Only care about follows involving the current user as the follower
            if (newRecord['follower_id'] == currentUserId ||
                oldRecord['follower_id'] == currentUserId) {
              _fetchFollowingStatus();
            }
          },
        )
        .subscribe();
  }

  Future<void> _fetchFollowingStatus() async {
    final followingIds = await FollowService.getFollowingIds();
    if (mounted) {
      setState(() {
        _followingIds = followingIds;
        // Also update the isFollowing status in the posts list
        for (var post in _posts) {
          post['isFollowing'] = followingIds.contains(post['authorId']);
        }
      });
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _followSubscription?.unsubscribe();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _searchFocusNode.unfocus();
        setState(() {
          _isSearchFocused = false;
        });
      },
      behavior: HitTestBehavior.translucent,
      child: Stack(
        children: [
          Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(-0.5, -0.6),
              radius: 1.5,
              colors: [Color(0xFFFFFFFF), Color(0xFFFBFBFB)],
              stops: [0.0, 1.0],
            ),
          ),
          child: Column(
            children: [
              // Animated Header Section
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: EdgeInsets.only(
                  top: _isScrolled ? 40.0 : 60.0,
                  left: 12.0,
                  right: 12.0,
                  bottom: _isScrolled ? 10.0 : 20.0,
                ),
                child: AnimatedSize(
                  duration: const Duration(milliseconds: 300),
                  child: _isScrolled
                      ? // Collapsed state - only search bar with same style
                        GestureDetector(
                          onTap: () {
                            // Unfocus search when tapping outside
                            _searchFocusNode.unfocus();
                            setState(() {
                              _isSearchFocused = false;
                            });
                          },
                          child: Container(
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.08),
                                  blurRadius: 15,
                                  spreadRadius: 2,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: TextField(
                              controller: _searchController,
                              focusNode: _searchFocusNode,
                              onTap: () {
                                setState(() {
                                  _isSearchFocused = true;
                                });
                              },
                              onEditingComplete: () {
                                setState(() {
                                  _isSearchFocused = false;
                                });
                              },
                              onChanged: (value) {
                                setState(() {
                                  _searchQuery = value;
                                });
                                _searchUsers(value);
                              },
                              decoration: InputDecoration(
                                hintText: 'Search posts, users...',
                                hintStyle: const TextStyle(
                                  color: Color(0xFF9E9E9E),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                                prefixIcon: const Icon(
                                  Icons.search_rounded,
                                  color: Colors.black87,
                                  size: 24,
                                ),
                                border: _isSearchFocused
                                    ? OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(25),
                                        borderSide: const BorderSide(
                                          color: Color(0xFFFF0000),
                                          width: 2,
                                        ),
                                      )
                                    : InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                              ),
                            ),
                          ),
                        )
                      : // Expanded state - header text and search bar
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header with slide animation
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              height: _isScrolled ? 0 : 80,
                              child: AnimatedOpacity(
                                duration: const Duration(milliseconds: 200),
                                opacity: _isScrolled ? 0.0 : 1.0,
                                child: AnimatedSlide(
                                  duration: const Duration(milliseconds: 300),
                                  offset: _isScrolled
                                      ? const Offset(0, -1)
                                      : Offset.zero,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Community',
                                        style: TextStyle(
                                          color: const Color(0xFF2D2D2D),
                                          fontSize: 32,
                                          fontWeight: FontWeight.w900,
                                          fontFamily: 'MPLUSRounded1c',
                                          letterSpacing: -1.0,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'See what food lovers are sharing',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 16,
                                          fontWeight: FontWeight.w500,
                                          fontFamily: 'MPLUSRounded1c',
                                          letterSpacing: 0.2,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            // Search Bar with Animation
                            GestureDetector(
                              onTap: () {
                                // Unfocus search when tapping outside
                                _searchFocusNode.unfocus();
                                setState(() {
                                  _isSearchFocused = false;
                                });
                              },
                              child: Container(
                                height: 55,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.08),
                                      blurRadius: 15,
                                      spreadRadius: 2,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: TextField(
                                  controller: _searchController,
                                  focusNode: _searchFocusNode,
                                  onTap: () {
                                    setState(() {
                                      _isSearchFocused = true;
                                    });
                                  },
                                  onEditingComplete: () {
                                    setState(() {
                                      _isSearchFocused = false;
                                    });
                                  },
                                  onChanged: (value) {
                                    setState(() {
                                      _searchQuery = value;
                                    });
                                    _searchUsers(value);
                                  },
                                  decoration: InputDecoration(
                                    hintText: 'Search posts, users...',
                                    hintStyle: const TextStyle(
                                      color: Color(0xFF9E9E9E),
                                      fontSize: 18,
                                      fontWeight: FontWeight.w500,
                                    ),
                                    prefixIcon: const Icon(
                                      Icons.search_rounded,
                                      color: Colors.black87,
                                      size: 28,
                                    ),
                                    border: _isSearchFocused
                                        ? OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(
                                              25,
                                            ),
                                            borderSide: const BorderSide(
                                              color: Color(0xFFFF0000),
                                              width: 2,
                                            ),
                                          )
                                        : InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(
                                      vertical: 15,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              // Scrollable Posts List
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _fetchPosts,
                  color: const Color(0xFFFF0000),
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.only(
                      left: 12.0,
                      right: 12.0,
                      bottom: 120.0,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (_searchQuery.isNotEmpty) ...[
                          _buildUserSearchResults(),
                          const Divider(height: 30, thickness: 1),
                        ],
                        if (_isLoading)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.only(top: 100),
                              child: FoodLoading(size: 80),
                            ),
                          )
                        else if (_filteredPosts.isEmpty)
                          Center(
                            child: Padding(
                              padding: const EdgeInsets.only(top: 100),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.feed_outlined,
                                    size: 64,
                                    color: const Color(0xFFFF0000),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'No posts found',
                                    style: TextStyle(
                                      color: const Color(
                                        0xFFFF0000,
                                      ).withOpacity(0.6),
                                      fontSize: 18,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            padding: EdgeInsets.zero,
                            itemCount: _filteredPosts.length,
                            itemBuilder: (context, index) {
                              final post = _filteredPosts[index];
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // User Header
                                  Padding(
                                    padding: const EdgeInsets.only(
                                      top: 12.0,
                                      right: 12.0,
                                      bottom: 12.0,
                                    ),
                                    child: Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        // Profile Image
                                        Container(
                                          width: 40,
                                          height: 40,
                                          decoration: const BoxDecoration(
                                            shape: BoxShape.circle,
                                          ),
                                          child: GestureDetector(
                                            onTap: () {
                                              if (post['authorId'] != null) {
                                                final isSelf =
                                                    post['authorId'] ==
                                                    SupabaseConfig
                                                        .currentUserId;
                                                Navigator.push(
                                                  context,
                                                  MaterialPageRoute(
                                                    builder: (context) => isSelf
                                                        ? const ProfilePage()
                                                        : UserProfilePage(
                                                            userId:
                                                                post['authorId'],
                                                          ),
                                                  ),
                                                );
                                              }
                                            },
                                            child: ClipRRect(
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                              child: ImageHelper.loadImage(
                                                post['userPfp'] ?? '',
                                                bucket: 'profiles',
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        // User Info Column
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              GestureDetector(
                                                onTap: () {
                                                  if (post['authorId'] !=
                                                      null) {
                                                    final isSelf =
                                                        post['authorId'] ==
                                                        SupabaseConfig
                                                            .currentUserId;
                                                    Navigator.push(
                                                      context,
                                                      MaterialPageRoute(
                                                        builder: (context) =>
                                                            isSelf
                                                            ? const ProfilePage()
                                                            : UserProfilePage(
                                                                userId:
                                                                    post['authorId'],
                                                              ),
                                                      ),
                                                    );
                                                  }
                                                },
                                                child: Row(
                                                  children: [
                                                    Text(
                                                      post['userName'] ?? 'User',
                                                      style: const TextStyle(
                                                        fontSize: 14,
                                                        fontWeight: FontWeight.w700,
                                                        color: Color(0xFF1A1A1A),
                                                      ),
                                                    ),
                                                    if (post['authorEmail'] == 'bytspot.in@gmail.com')
                                                      const Padding(
                                                        padding: EdgeInsets.only(left: 4.0),
                                                        child: Icon(
                                                          Icons.check_circle,
                                                          size: 14,
                                                          color: Colors.blue,
                                                        ),
                                                      ),
                                                  ],
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                post['time'] ?? '',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.grey[500],
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        // Follow Button
                                        if (post['authorId'] !=
                                            SupabaseConfig.currentUserId)
                                          Padding(
                                            padding: const EdgeInsets.only(
                                              right: 8.0,
                                            ),
                                            child: TextButton(
                                              onPressed: () async {
                                                if (!await AuthGate.check(context, message: 'Sign in to follow other food explorers!')) return;
                                                
                                                final authorId =
                                                    post['authorId'];
                                                if (authorId == null) return;

                                                final currentlyFollowing =
                                                    _followingIds.contains(
                                                      authorId,
                                                    );
                                                final success =
                                                    await FollowService.toggleFollow(
                                                      authorId,
                                                    );

                                                if (success && mounted) {
                                                  setState(() {
                                                    if (currentlyFollowing) {
                                                      _followingIds.remove(
                                                        authorId,
                                                      );
                                                    } else {
                                                      _followingIds.add(
                                                        authorId,
                                                      );
                                                    }
                                                    // Update all posts from this author in current list
                                                    for (var p in _posts) {
                                                      if (p['authorId'] ==
                                                          authorId) {
                                                        p['isFollowing'] =
                                                            !currentlyFollowing;
                                                      }
                                                    }
                                                  });
                                                  NotificationService.show(
                                                    message: currentlyFollowing
                                                        ? 'Unfollowed user'
                                                        : 'Following user!',
                                                    type: NotificationType
                                                        .success,
                                                  );
                                                }
                                              },
                                              style: TextButton.styleFrom(
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 4,
                                                    ),
                                                minimumSize: Size.zero,
                                                tapTargetSize:
                                                    MaterialTapTargetSize
                                                        .shrinkWrap,
                                                backgroundColor:
                                                    _followingIds.contains(
                                                      post['authorId'],
                                                    )
                                                    ? const Color(
                                                        0xFFFF6D00,
                                                      ) // Vibrant Deep Orange
                                                    : const Color(
                                                        0xFFFF0000,
                                                      ).withOpacity(0.1),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(12),
                                                ),
                                              ),
                                              child: Text(
                                                _followingIds.contains(
                                                      post['authorId'],
                                                    )
                                                    ? 'Unfollow'
                                                    : 'Follow',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w700,
                                                  color:
                                                      _followingIds.contains(
                                                        post['authorId'],
                                                      )
                                                      ? Colors.white
                                                      : const Color(0xFFFF0000),
                                                ),
                                              ),
                                            ),
                                          ),
                                        // Save Icon
                                        GestureDetector(
                                          onTap: () async {
                                            if (!await AuthGate.check(context, message: 'Sign in to save posts you love!')) return;

                                            final postId = post['id']
                                                .toString();
                                            final success =
                                                await PostService.toggleSave(
                                                  postId,
                                                );
                                            if (mounted) {
                                              final mainIdx = _posts.indexWhere(
                                                (p) => p['id'] == post['id'],
                                              );
                                              if (mainIdx != -1) {
                                                setState(() {
                                                  _posts[mainIdx]['isSaved'] =
                                                      success;
                                                });
                                              }
                                              NotificationService.show(
                                                message: success
                                                    ? 'Post saved!'
                                                    : 'Post unsaved',
                                                type: success
                                                    ? NotificationType.success
                                                    : NotificationType.info,
                                              );
                                            }
                                          },
                                          child: Icon(
                                            (post['isSaved'] as bool)
                                                ? Icons.bookmark_rounded
                                                : Icons.bookmark_border_rounded,
                                            size: 16,
                                            color: const Color(0xFFFF0000),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Post Content
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12.0,
                                    ),
                                    child: Text(
                                      post['content'] ?? '',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[800],
                                        fontWeight: FontWeight.w400,
                                        height: 1.4,
                                      ),
                                    ),
                                  ),
                                  // Post Images
                                  if (post['images'] != null &&
                                      (post['images'] as List).isNotEmpty)
                                    Padding(
                                      padding: const EdgeInsets.fromLTRB(
                                        12.0,
                                        12.0,
                                        12.0,
                                        0,
                                      ),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(20),
                                        child: SizedBox(
                                          width: double.infinity,
                                          height: 350,
                                          child: Stack(
                                            children: [
                                              // Image Viewer
                                              PageView.builder(
                                                itemCount:
                                                    post['images'].length,
                                                onPageChanged: (imageIndex) {
                                                  setState(() {
                                                    final mainIdx = _posts
                                                        .indexWhere(
                                                          (p) =>
                                                              p['id'] ==
                                                              post['id'],
                                                        );
                                                    if (mainIdx != -1) {
                                                      _posts[mainIdx]['currentImageIndex'] =
                                                          imageIndex;
                                                    }
                                                  });
                                                },
                                                itemBuilder: (context, imageIndex) {
                                                  return ImageHelper.loadImage(
                                                    post['images'][imageIndex],
                                                    bucket: 'posts',
                                                    fit: BoxFit.cover,
                                                  );
                                                },
                                              ),
                                              // Image Indicators
                                              if (post['images'].length > 1)
                                                Positioned(
                                                  bottom: 10,
                                                  right: 10,
                                                  child: Container(
                                                    padding:
                                                        const EdgeInsets.symmetric(
                                                          horizontal: 8,
                                                          vertical: 4,
                                                        ),
                                                    decoration: BoxDecoration(
                                                      color: Colors.black
                                                          .withOpacity(0.6),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            12,
                                                          ),
                                                    ),
                                                    child: Text(
                                                      '${(post['currentImageIndex'] as int) + 1}/${post['images'].length}',
                                                      style: const TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 12,
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              // Dot Indicators
                                              if (post['images'].length > 1)
                                                Positioned(
                                                  bottom: 10,
                                                  left: 0,
                                                  right: 0,
                                                  child: Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: List.generate(
                                                      post['images'].length,
                                                      (dotIndex) => Container(
                                                        margin:
                                                            const EdgeInsets.symmetric(
                                                              horizontal: 4,
                                                            ),
                                                        width:
                                                            dotIndex ==
                                                                (post['currentImageIndex'] ??
                                                                    0)
                                                            ? 8
                                                            : 6,
                                                        height:
                                                            dotIndex ==
                                                                (post['currentImageIndex'] ??
                                                                    0)
                                                            ? 8
                                                            : 6,
                                                        decoration: BoxDecoration(
                                                          shape:
                                                              BoxShape.circle,
                                                          color:
                                                              dotIndex ==
                                                                  (post['currentImageIndex'] ??
                                                                      0)
                                                              ? Colors.white
                                                              : Colors.white
                                                                    .withOpacity(
                                                                      0.5,
                                                                    ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                               
                                               // Spot Tag Icon
                                               if (post['spotName'] != null || post['spot'] != null)
                                                 Positioned(
                                                   bottom: 12,
                                                   right: 12,
                                                   child: GestureDetector(
                                                     onTap: () {
                                                       setState(() {
                                                         final mainIdx = _posts.indexWhere((p) => p['id'] == post['id']);
                                                         if (mainIdx != -1) {
                                                           _posts[mainIdx]['showSpotPopup'] = !(post['showSpotPopup'] ?? false);
                                                         }
                                                       });
                                                     },
                                                     child: AnimatedContainer(
                                                       duration: const Duration(milliseconds: 200),
                                                       padding: const EdgeInsets.all(8),
                                                       decoration: BoxDecoration(
                                                         color: (post['showSpotPopup'] ?? false) 
                                                           ? const Color(0xFFFF0000)
                                                           : Colors.black.withOpacity(0.6),
                                                         shape: BoxShape.circle,
                                                         boxShadow: [
                                                           BoxShadow(
                                                             color: Colors.black.withOpacity(0.2),
                                                             blurRadius: 8,
                                                             offset: const Offset(0, 2),
                                                           ),
                                                         ],
                                                       ),
                                                       child: const Icon(
                                                         Icons.location_on_rounded,
                                                         size: 18,
                                                         color: Colors.white,
                                                       ),
                                                     ),
                                                   ),
                                                 ),
                                               
                                                // Spot Popup
                                                if (post['showSpotPopup'] ?? false)
                                                  Positioned(
                                                    bottom: 57,
                                                    right: 12,
                                                    child: ClipRRect(
                                                      borderRadius: BorderRadius.circular(20),
                                                      child: BackdropFilter(
                                                        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                                                        child: AnimatedOpacity(
                                                          duration: const Duration(milliseconds: 300),
                                                          opacity: (post['showSpotPopup'] ?? false) ? 1.0 : 0.0,
                                                          child: Container(
                                                            width: 200,
                                                            padding: const EdgeInsets.all(16),
                                                            decoration: BoxDecoration(
                                                              color: Colors.white.withOpacity(0.85),
                                                              borderRadius: BorderRadius.circular(20),
                                                              border: Border.all(
                                                                color: Colors.white.withOpacity(0.5),
                                                                width: 1.5,
                                                              ),
                                                              boxShadow: [
                                                                BoxShadow(
                                                                  color: Colors.black.withOpacity(0.1),
                                                                  blurRadius: 20,
                                                                  offset: const Offset(0, 10),
                                                                ),
                                                              ],
                                                            ),
                                                            child: Column(
                                                              crossAxisAlignment: CrossAxisAlignment.start,
                                                              mainAxisSize: MainAxisSize.min,
                                                              children: [
                                                                Row(
                                                                  children: [
                                                                    Expanded(
                                                                      child: Text(
                                                                        post['spotName'] ?? post['spot']?['name'] ?? 'Spot',
                                                                        style: const TextStyle(
                                                                          fontWeight: FontWeight.w900,
                                                                          fontSize: 14,
                                                                          color: Color(0xFF1A1A1A),
                                                                          letterSpacing: -0.2,
                                                                        ),
                                                                        maxLines: 1,
                                                                        overflow: TextOverflow.ellipsis,
                                                                      ),
                                                                    ),
                                                                  ],
                                                                ),
                                                                const SizedBox(height: 4),
                                                                Row(
                                                                  children: [
                                                                    Icon(
                                                                      Icons.location_on_rounded,
                                                                      size: 10,
                                                                      color: Colors.grey[600],
                                                                    ),
                                                                    const SizedBox(width: 4),
                                                                    Text(
                                                                      post['spot'] != null ? 'Verified Spot' : 'Location Mention',
                                                                      style: TextStyle(
                                                                        fontSize: 10,
                                                                        fontWeight: FontWeight.w600,
                                                                        color: Colors.grey[600],
                                                                        letterSpacing: 0.1,
                                                                      ),
                                                                    ),
                                                                  ],
                                                                ),
                                                                const SizedBox(height: 12),
                                                                if (post['spot'] != null)
                                                                  SizedBox(
                                                                    width: double.infinity,
                                                                    child: Container(
                                                                      decoration: BoxDecoration(
                                                                        borderRadius: BorderRadius.circular(12),
                                                                        boxShadow: [
                                                                          BoxShadow(
                                                                            color: const Color(0xFFFF0000).withOpacity(0.3),
                                                                            blurRadius: 10,
                                                                            offset: const Offset(0, 4),
                                                                          ),
                                                                        ],
                                                                      ),
                                                                      child: ElevatedButton(
                                                                        onPressed: () {
                                                                          Navigator.push(
                                                                            context,
                                                                            MaterialPageRoute(
                                                                              builder: (context) => SpotDetailsPage(
                                                                                spot: post['spot'],
                                                                              ),
                                                                            ),
                                                                          );
                                                                        },
                                                                        style: ElevatedButton.styleFrom(
                                                                          backgroundColor: const Color(0xFFFF0000),
                                                                          foregroundColor: Colors.white,
                                                                          elevation: 0,
                                                                          padding: const EdgeInsets.symmetric(vertical: 10),
                                                                          shape: RoundedRectangleBorder(
                                                                            borderRadius: BorderRadius.circular(12),
                                                                          ),
                                                                        ),
                                                                        child: const Text(
                                                                          'View Details',
                                                                          style: TextStyle(
                                                                            fontSize: 12,
                                                                            fontWeight: FontWeight.w800,
                                                                          ),
                                                                        ),
                                                                      ),
                                                                    ),
                                                                  )
                                                                else
                                                                  Container(
                                                                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 10),
                                                                    decoration: BoxDecoration(
                                                                      color: Colors.grey[100]!.withOpacity(0.5),
                                                                      borderRadius: BorderRadius.circular(10),
                                                                    ),
                                                                    child: Row(
                                                                      children: [
                                                                        Icon(Icons.info_outline_rounded, size: 12, color: Colors.grey[600]),
                                                                        const SizedBox(width: 6),
                                                                        Expanded(
                                                                          child: Text(
                                                                            'Linking pending...',
                                                                            style: TextStyle(
                                                                              fontSize: 10,
                                                                              color: Colors.grey[700],
                                                                              fontWeight: FontWeight.w500,
                                                                              fontStyle: FontStyle.italic,
                                                                            ),
                                                                          ),
                                                                        ),
                                                                      ],
                                                                    ),
                                                                  ),
                                                              ],
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                             ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  // Engagement Bar
                                  Padding(
                                    padding: const EdgeInsets.all(12.0),
                                    child: Row(
                                      children: [
                                        Row(
                                          children: [
                                            GestureDetector(
                                              onTap: () async {
                                                if (!await AuthGate.check(context, message: 'Sign in to like posts!')) return;

                                                final postId = post['id']
                                                    .toString();
                                                final bool currentlyLiked =
                                                    post['isLiked'] as bool;

                                                // Find post index for state update
                                                final mainIdx = _posts
                                                    .indexWhere(
                                                      (p) =>
                                                          p['id'] == post['id'],
                                                    );
                                                if (mainIdx == -1) return;

                                                // Optimistic UI update
                                                setState(() {
                                                  _posts[mainIdx]['isLiked'] =
                                                      !currentlyLiked;
                                                  _posts[mainIdx]['likes'] =
                                                      currentlyLiked
                                                      ? (_posts[mainIdx]['likes']
                                                                as int) -
                                                            1
                                                      : (_posts[mainIdx]['likes']
                                                                as int) +
                                                            1;
                                                });

                                                // Network call
                                                final success =
                                                    await PostService.toggleLike(
                                                      postId,
                                                    );

                                                if (mounted) {
                                                  setState(() {
                                                    _posts[mainIdx]['isLiked'] =
                                                        success;
                                                  });
                                                }
                                              },
                                              child: Icon(
                                                (post['isLiked'] as bool)
                                                    ? Icons.favorite
                                                    : Icons.favorite_border,
                                                size: 20,
                                                color: (post['isLiked'] as bool)
                                                    ? Colors.red
                                                    : Colors.grey[600],
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Text(
                                              post['likes'].toString(),
                                              style: TextStyle(
                                                fontSize: 13,
                                                color: Colors.grey[700],
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        // Create Post FAB
        Positioned(
          bottom: 100,
          right: 20,
          child: FloatingActionButton(
            onPressed: () async {
              if (!await AuthGate.check(context, message: 'Sign in to share your food experiences!')) return;
              
              final result = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const CreatePostPage()),
              );
              if (result == true) {
                _fetchPosts();
              }
            },
            backgroundColor: const Color(0xFFFF0000),
            elevation: 8,
            child: const Icon(Icons.add_a_photo_rounded, color: Colors.white),
          ),
        ),
      ],
    ),
  );
}

  Widget _buildUserSearchResults() {
    if (_isSearchingUsers) {
      return const Padding(
        padding: EdgeInsets.all(20),
        child: Center(
          child: CircularProgressIndicator(color: Color(0xFFFF0000)),
        ),
      );
    }

    if (_foundUsers.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 10),
          child: Text(
            'Users',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1A1A1A),
            ),
          ),
        ),
        SizedBox(
          height: 90,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _foundUsers.length,
            itemBuilder: (context, index) {
              final user = _foundUsers[index];
              final userId = user['id']?.toString();
              if (userId == null) return const SizedBox.shrink();

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => UserProfilePage(userId: userId),
                    ),
                  );
                },
                child: Container(
                  width: 80,
                  margin: const EdgeInsets.only(right: 15),
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          CircleAvatar(
                            radius: 25,
                            backgroundColor: Colors.grey[200],
                            backgroundImage: user['avatar_url'] != null
                                ? NetworkImage(user['avatar_url'])
                                : null,
                            child: user['avatar_url'] == null
                                ? const Icon(Icons.person, color: Colors.grey)
                                : null,
                          ),
                          if (_followingIds.contains(userId))
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(2),
                                decoration: const BoxDecoration(
                                  color: Colors.green,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.check,
                                  size: 10,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 5),
                      Text(
                        user['username'] ?? user['full_name'] ?? 'User',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
