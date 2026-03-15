import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:ui';
import 'services/image_helper.dart';
import 'services/post_service.dart';
import 'services/notification_service.dart';
import 'supabase_config.dart';
import 'user_profile.dart';
import 'profile.dart';
import 'services/auth_gate.dart';

class PostDetailsPage extends StatefulWidget {
  final List<Map<String, dynamic>> posts;
  final int initialIndex;

  const PostDetailsPage({
    super.key,
    required this.posts,
    required this.initialIndex,
  });

  @override
  State<PostDetailsPage> createState() => _PostDetailsPageState();
}

class _PostDetailsPageState extends State<PostDetailsPage> {
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: widget.posts.length,
            scrollDirection: Axis.vertical,
            itemBuilder: (context, index) {
              return PostDetailItem(post: widget.posts[index]);
            },
          ),
          // Shared Back Button
          Positioned(
            top: 40,
            left: 20,
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.4),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.arrow_back_ios_new_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class PostDetailItem extends StatefulWidget {
  final Map<String, dynamic> post;

  const PostDetailItem({super.key, required this.post});

  @override
  State<PostDetailItem> createState() => _PostDetailItemState();
}

class _PostDetailItemState extends State<PostDetailItem> {
  late bool _isLiked;
  late int _likesCount;
  late bool _isSaved;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _isLiked = widget.post['isLiked'] ?? false;
    _likesCount = widget.post['likes'] ?? 0;
    _isSaved = widget.post['isSaved'] ?? false;
  }

   Future<void> _handleLike() async {
    if (!await AuthGate.check(context,
        message: 'Sign in to like posts!')) return;
    HapticFeedback.mediumImpact();
    final newIsLiked = !_isLiked;
    final newLikesCount = _likesCount + (newIsLiked ? 1 : -1);

    setState(() {
      _isLiked = newIsLiked;
      _likesCount = newLikesCount;
    });

    // Persist to the post map (passed by reference)
    widget.post['isLiked'] = newIsLiked;
    widget.post['likes'] = newLikesCount;

    final success = await PostService.toggleLike(widget.post['id'].toString());
    if (!success && mounted) {
      setState(() {
        _isLiked = !_isLiked;
        _likesCount += _isLiked ? 1 : -1;
        // Sync back on failure
        widget.post['isLiked'] = _isLiked;
        widget.post['likes'] = _likesCount;
      });
    }
  }

   Future<void> _handleSave() async {
    if (!await AuthGate.check(context,
        message: 'Sign in to save posts you love!')) return;
    HapticFeedback.lightImpact();
    final success = await PostService.toggleSave(widget.post['id'].toString());
    if (mounted) {
      setState(() => _isSaved = success);
      widget.post['isSaved'] = success; // Persist to map
      NotificationService.show(
        message: _isSaved ? 'Post saved!' : 'Post removed from saves',
        type: _isSaved ? NotificationType.success : NotificationType.info,
      );
    }
  }

  Future<void> _refreshPost() async {
    try {
      final postId = widget.post['id'].toString();
      final response = await SupabaseConfig.client
          .from('posts')
          .select('*, author:user_id(username, full_name, avatar_url)')
          .eq('id', postId)
          .single();

      final likedIds = await PostService.getLikedPostIds();
      final savedIds = await PostService.getSavedPostIds();

      if (mounted) {
        setState(() {
          _isLiked = likedIds.contains(postId);
          _likesCount = response['likes'] ?? 0;
          _isSaved = savedIds.contains(postId);

          // Update the original map
          widget.post.addAll(response);
          widget.post['isLiked'] = _isLiked;
          widget.post['likes'] = _likesCount;
          widget.post['isSaved'] = _isSaved;
        });
      }
    } catch (e) {
      print('Error refreshing post: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final images = widget.post['images'] as List<dynamic>? ?? [];
    final author = widget.post['author'] as Map<String, dynamic>?;
    final authorName = author?['full_name'] ?? 'User';
    final authorUsername = author?['username'] ?? 'username';
    final authorAvatar = author?['avatar_url'];
    final authorId = widget.post['user_id'] ?? widget.post['authorId'];

    return RefreshIndicator(
      onRefresh: _refreshPost,
      color: const Color(0xFFFF0000),
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        slivers: [
          // Immersive Image Header
          SliverAppBar(
            expandedHeight: 450,
            backgroundColor: Colors.black,
            automaticallyImplyLeading: false,
            pinned: true,
            stretch: true,
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [StretchMode.zoomBackground],
              background: Stack(
                fit: StackFit.expand,
                children: [
                  if (images.isNotEmpty)
                    PageView.builder(
                      itemCount: images.length,
                      onPageChanged: (i) =>
                          setState(() => _currentImageIndex = i),
                      itemBuilder: (context, i) => ImageHelper.loadImage(
                        images[i].toString(),
                        bucket: 'posts',
                        fit: BoxFit.cover,
                      ),
                    )
                  else
                    Container(
                      color: Colors.grey[200],
                      child: const Icon(
                        Icons.article_outlined,
                        size: 100,
                        color: Colors.grey,
                      ),
                    ),
                  // Image Pager Indicator
                  if (images.length > 1)
                    Positioned(
                      bottom: 20,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          images.length,
                          (i) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: _currentImageIndex == i ? 12 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(3),
                              color: _currentImageIndex == i
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.5),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Content Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Author Row
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          if (authorId != null) {
                            final isSelf =
                                authorId == SupabaseConfig.currentUserId;
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => isSelf
                                    ? const ProfilePage()
                                    : UserProfilePage(userId: authorId),
                              ),
                            );
                          }
                        },
                        child: CircleAvatar(
                          radius: 20,
                          backgroundImage: authorAvatar != null
                              ? NetworkImage(authorAvatar)
                              : null,
                          backgroundColor: Colors.grey[200],
                          child: authorAvatar == null
                              ? const Icon(Icons.person, color: Colors.grey)
                              : null,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              authorName,
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              '@$authorUsername',
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Interactive Actions in row
                      IconButton(
                        onPressed: _handleLike,
                        icon: Icon(
                          _isLiked
                              ? Icons.favorite
                              : Icons.favorite_border_rounded,
                        ),
                        color: _isLiked ? Colors.red : Colors.grey[400],
                      ),
                      Text(
                        _likesCount.toString(),
                        style: TextStyle(
                          color: Colors.grey[700],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 10),
                      IconButton(
                        onPressed: _handleSave,
                        icon: Icon(
                          _isSaved
                              ? Icons.bookmark_rounded
                              : Icons.bookmark_border_rounded,
                        ),
                        color: _isSaved
                            ? const Color(0xFFFF0000)
                            : Colors.grey[400],
                      ),
                    ],
                  ),
                  const Divider(height: 40),
                  // Post Content
                  Text(
                    widget.post['content'] ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      color: Color(0xFF1A1A1A),
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 30),
                  // Time Info
                  Text(
                    'Posted recently', // Format time if available
                    style: TextStyle(color: Colors.grey[500], fontSize: 12),
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
