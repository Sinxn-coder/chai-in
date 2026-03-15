import 'package:flutter/material.dart';
import 'services/notification_service.dart';
import 'services/image_helper.dart';
import 'services/post_service.dart';
import 'widgets/food_loading.dart';
import 'services/auth_gate.dart';

class SavedPostsPage extends StatefulWidget {
  const SavedPostsPage({super.key});

  @override
  State<SavedPostsPage> createState() => _SavedPostsPageState();
}

class _SavedPostsPageState extends State<SavedPostsPage> {
  List<Map<String, dynamic>> _savedPosts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSavedPosts();
  }

  Future<void> _fetchSavedPosts() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    try {
      final rawPosts = await PostService.getSavedPosts();

      if (mounted) {
        setState(() {
          _savedPosts = rawPosts.map((post) {
            final author = post['author'] as Map<String, dynamic>?;
            return {
              'id': post['id'],
              'userName': author?['username'] ?? author?['full_name'] ?? 'User',
              'userPfp': author?['avatar_url'],
              'time': _formatTimestamp(post['created_at']),
              'content': post['content'] ?? '',
              'image': (post['images'] as List?)?.isNotEmpty == true
                  ? (post['images'] as List)[0].toString()
                  : '',
              'likes': post['likes_count'] ?? 0,
              'isLiked': false, // Can fetch if needed
            };
          }).toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching saved posts: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  String _formatTimestamp(String timestamp) {
    try {
      final date = DateTime.parse(timestamp);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays > 7) {
        return '${date.day}/${date.month}/${date.year}';
      } else if (difference.inDays >= 1) {
        return '${difference.inDays}d ago';
      } else if (difference.inHours >= 1) {
        return '${difference.inHours}h ago';
      } else if (difference.inMinutes >= 1) {
        return '${difference.inMinutes}m ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      return 'Recent';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9FA),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text(
          'Saved Posts',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: FoodLoading())
            : _savedPosts.isEmpty
            ? _buildEmptyState()
            : _buildSavedPostsList(),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: const Color(0xFFFF0000).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.bookmark_border_rounded,
              size: 48,
              color: Color(0xFFFF0000),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No saved posts yet',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Save posts you love to see them here',
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildSavedPostsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _savedPosts.length,
      itemBuilder: (context, index) {
        final post = _savedPosts[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFFFF0000).withOpacity(0.15),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                spreadRadius: 0,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Header
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(shape: BoxShape.circle),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: ImageHelper.loadImage(
                          post['userPfp'] ?? '',
                          bucket: 'profiles',
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post['userName'],
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            post['time'],
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                     GestureDetector(
                      onTap: () async {
                        if (!await AuthGate.check(context,
                            message: 'Sign in to manage your saved posts!'))
                          return;
                        final postId = post['id'].toString();
                        final success = await PostService.toggleSave(postId);

                        // success will be false if it was unsaved correctly
                        if (!success && mounted) {
                          setState(() {
                            _savedPosts.removeAt(index);
                          });
                          NotificationService.show(
                            message: 'Removed from saved',
                            type: NotificationType.info,
                          );
                        }
                      },
                      child: const Icon(
                        Icons.bookmark_rounded,
                        size: 16,
                        color: Color(0xFFFF0000),
                      ),
                    ),
                  ],
                ),
              ),
              // Post Content
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12.0),
                child: Text(
                  post['content'],
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[800],
                    fontWeight: FontWeight.w400,
                    height: 1.4,
                  ),
                ),
              ),
              // Post Image
              SizedBox(
                width: double.infinity,
                height: 250,
                child: ImageHelper.loadImage(post['image'], fit: BoxFit.cover),
              ),
              // Engagement Bar
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Removed duplicate bookmark icon - keeping only the one in header
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
