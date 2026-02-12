import 'package:flutter/material.dart';

class SavedPostsPage extends StatefulWidget {
  const SavedPostsPage({super.key});

  @override
  State<SavedPostsPage> createState() => _SavedPostsPageState();
}

class _SavedPostsPageState extends State<SavedPostsPage> {
  final List<Map<String, dynamic>> _savedPosts = [
    {
      'userName': 'Sarah Johnson',
      'userPfp':
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      'time': '2 hours ago',
      'content':
          'Just discovered this amazing hidden gem downtown! The pasta was incredible and atmosphere was perfect. Highly recommend checking it out! 🍝',
      'image':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'likes': 42,
      'comments': 8,
      'isLiked': false,
    },
    {
      'userName': 'Emma Wilson',
      'userPfp':
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      'time': '6 hours ago',
      'content':
          'Best brunch spot I\'ve found this month! The avocado toast was perfection and they have most beautiful outdoor seating. Perfect for weekend vibes! 🥑',
      'image':
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop',
      'likes': 67,
      'comments': 15,
      'isLiked': true,
    },
    {
      'userName': 'Mike Chen',
      'userPfp':
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      'time': '4 hours ago',
      'content':
          'Coffee lovers, you need to try this new cafe! Their specialty latte is life-changing. Plus vibes are just perfect for working or catching up with friends. ☕',
      'image':
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
      'likes': 28,
      'comments': 12,
      'isLiked': false,
    },
  ];

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
      body: _savedPosts.isEmpty ? _buildEmptyState() : _buildSavedPostsList(),
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
              color: const Color(0xFFFF0000).withValues(alpha: 0.1),
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
              color: const Color(0xFFFF0000).withValues(alpha: 0.15),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
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
                        child: Image.network(
                          post['userPfp'],
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
                      onTap: () {
                        setState(() {
                          _savedPosts.removeAt(index);
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Post removed from saved'),
                            backgroundColor: Color(0xFF6B7280),
                            duration: Duration(seconds: 2),
                          ),
                        );
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
              if (post['image'] != null)
                SizedBox(
                  width: double.infinity,
                  height: 250,
                  child: Image.network(post['image'], fit: BoxFit.cover),
                ),
              // Engagement Bar
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _savedPosts.removeAt(index);
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Post removed from saved'),
                            backgroundColor: Color(0xFF6B7280),
                            duration: Duration(seconds: 2),
                          ),
                        );
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
            ],
          ),
        );
      },
    );
  }
}
