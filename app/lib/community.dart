import 'package:flutter/material.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({super.key});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  final List<Map<String, dynamic>> _posts = [
    {
      'userName': 'Sarah Johnson',
      'userPfp':
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      'time': '2 hours ago',
      'content':
          'Just discovered this amazing hidden gem downtown! The pasta was incredible and atmosphere was perfect. Highly recommend checking it out! 🍝',
      'images': [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1555396273-3f071a6125b3?q=80&w=1000&auto=format&fit=crop',
      ],
      'currentImageIndex': 0,
      'likes': 42,
      'comments': 8,
      'isLiked': false,
      'isSaved': false,
      'showComments': false,
      'userComments': [],
    },
    {
      'userName': 'Mike Chen',
      'userPfp':
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      'time': '4 hours ago',
      'content':
          'Coffee lovers, you need to try this new cafe! Their specialty latte is life-changing. Plus the vibes are just perfect for working or catching up with friends. ☕',
      'images': [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      ],
      'currentImageIndex': 0,
      'likes': 28,
      'comments': 12,
      'isLiked': false,
      'isSaved': false,
      'showComments': false,
      'userComments': [],
    },
    {
      'userName': 'Emma Wilson',
      'userPfp':
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
      'time': '6 hours ago',
      'content':
          'Best brunch spot I\'ve found this month! The avocado toast was perfection and they have the most beautiful outdoor seating. Perfect for weekend vibes! 🥑',
      'images': [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1555396273-3f071a6125b3?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop',
      ],
      'currentImageIndex': 0,
      'likes': 35,
      'comments': 6,
      'isLiked': false,
      'isSaved': false,
      'showComments': false,
      'userComments': [],
    },
    {
      'userName': 'Alex Rodriguez',
      'userPfp':
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
      'time': '8 hours ago',
      'content':
          'Found this incredible rooftop bar with stunning city views! The sunset here is absolutely breathtaking. Perfect for date nights or special occasions. 🌆',
      'images': [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      ],
      'currentImageIndex': 0,
      'likes': 58,
      'comments': 15,
      'isLiked': false,
      'isSaved': false,
      'showComments': false,
      'userComments': [],
    },
  ];
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      setState(() {
        _isScrolled = _scrollController.offset > 50;
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
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
                        Container(
                          height: 50,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 15,
                                spreadRadius: 2,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Search...',
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
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 12,
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
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            // Search Bar with Animation
                            Container(
                              height: 55,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.08),
                                    blurRadius: 15,
                                    spreadRadius: 2,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: TextField(
                                decoration: InputDecoration(
                                  hintText: 'Search...',
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
                                  border: InputBorder.none,
                                  contentPadding: const EdgeInsets.symmetric(
                                    vertical: 15,
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
                child: SingleChildScrollView(
                  controller: _scrollController,
                  padding: const EdgeInsets.only(
                    left: 12.0,
                    right: 12.0,
                    bottom: 120.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        padding: EdgeInsets.zero,
                        itemCount: _posts.length,
                        itemBuilder: (context, index) {
                          final post = _posts[index];
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
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Profile Image
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                      ),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(20),
                                        child: Image.network(
                                          post['userPfp'],
                                          fit: BoxFit.cover,
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
                                    // Save Icon
                                    GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          _posts[index]['isSaved'] =
                                              !(_posts[index]['isSaved']
                                                  as bool);
                                        });
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              (_posts[index]['isSaved'] as bool)
                                                  ? 'Post saved!'
                                                  : 'Post unsaved',
                                            ),
                                            backgroundColor:
                                                (_posts[index]['isSaved']
                                                    as bool)
                                                ? const Color(0xFF10B981)
                                                : const Color(0xFF6B7280),
                                            duration: const Duration(
                                              seconds: 2,
                                            ),
                                          ),
                                        );
                                      },
                                      child: Icon(
                                        (_posts[index]['isSaved'] as bool)
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
                                  post['content'],
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
                                  post['images'].isNotEmpty)
                                SizedBox(
                                  width: double.infinity,
                                  height: 350,
                                  child: Stack(
                                    children: [
                                      // Image Viewer
                                      PageView.builder(
                                        itemCount: post['images'].length,
                                        onPageChanged: (imageIndex) {
                                          setState(() {
                                            _posts[index]['currentImageIndex'] =
                                                imageIndex;
                                          });
                                        },
                                        itemBuilder: (context, imageIndex) {
                                          return SizedBox(
                                            width: double.infinity,
                                            child: Image.network(
                                              post['images'][imageIndex],
                                              fit: BoxFit.cover,
                                            ),
                                          );
                                        },
                                      ),
                                      // Image Indicators
                                      if (post['images'].length > 1)
                                        Positioned(
                                          bottom: 10,
                                          right: 10,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.black.withValues(
                                                alpha: 0.6,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              '${post['currentImageIndex'] + 1}/${post['images'].length}',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
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
                                                MainAxisAlignment.center,
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
                                                  shape: BoxShape.circle,
                                                  color:
                                                      dotIndex ==
                                                          (post['currentImageIndex'] ??
                                                              0)
                                                      ? Colors.white
                                                      : Colors.white.withValues(
                                                          alpha: 0.5,
                                                        ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                    ],
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
                                          onTap: () {
                                            setState(() {
                                              _posts[index]['isLiked'] =
                                                  !_posts[index]['isLiked'];
                                              if (_posts[index]['isLiked']) {
                                                _posts[index]['likes'] =
                                                    (_posts[index]['likes']
                                                        as int) +
                                                    1;
                                              } else {
                                                _posts[index]['likes'] =
                                                    (_posts[index]['likes']
                                                        as int) -
                                                    1;
                                              }
                                            });
                                          },
                                          child: Icon(
                                            (_posts[index]['isLiked'] as bool)
                                                ? Icons.favorite
                                                : Icons.favorite_border,
                                            size: 20,
                                            color:
                                                (_posts[index]['isLiked']
                                                    as bool)
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
                                    const SizedBox(width: 20),
                                    Row(
                                      children: [
                                        GestureDetector(
                                          onTap: () {
                                            setState(() {
                                              _posts[index]['showComments'] =
                                                  !_posts[index]['showComments'];
                                            });
                                          },
                                          child: Icon(
                                            Icons.chat_bubble_outline,
                                            size: 20,
                                            color: _posts[index]['showComments']
                                                ? Colors.red
                                                : Colors.grey[600],
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          post['comments'].toString(),
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
            ],
          ),
        ),
        // Instagram-style Comments Modal
        if (_posts.any((post) => post['showComments'] as bool))
          GestureDetector(
            onTap: () {
              setState(() {
                for (int i = 0; i < _posts.length; i++) {
                  _posts[i]['showComments'] = false;
                }
              });
            },
            child: Container(
              color: Colors.black.withValues(alpha: 0.5),
              child: Align(
                alignment: Alignment.bottomCenter,
                child: GestureDetector(
                  onTap: () {}, // Prevent tap-through
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOut,
                    margin: const EdgeInsets.symmetric(
                      horizontal: 0,
                      vertical: 0,
                    ),
                    height: MediaQuery.of(context).size.height * 0.8,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20),
                        topRight: Radius.circular(20),
                      ),
                    ),
                    child: Column(
                      children: [
                        // Header
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: const BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: Color(0xFFE0E0E0),
                                width: 1,
                              ),
                            ),
                          ),
                          child: Row(
                            children: [
                              const Text(
                                'Comments',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                              const Spacer(),
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    for (int i = 0; i < _posts.length; i++) {
                                      _posts[i]['showComments'] = false;
                                    }
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  child: const Icon(
                                    Icons.close,
                                    size: 24,
                                    color: Color(0xFF6B7280),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Comments List
                        Expanded(
                          child: ListView(
                            padding: const EdgeInsets.all(16),
                            children: [
                              // Sample comments
                              Container(
                                padding: const EdgeInsets.all(12),
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF9FAFB),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          width: 32,
                                          height: 32,
                                          decoration: const BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: Color(0xFF3B82F6),
                                          ),
                                          child: const Icon(
                                            Icons.person,
                                            size: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              const Text(
                                                'John Doe',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: Color(0xFF1A1A1A),
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              const Text(
                                                'Great post! Love this place 🍕',
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  color: Color(0xFF6B7280),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    const Text(
                                      '2 hours ago',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // More sample comments
                              Container(
                                padding: const EdgeInsets.all(12),
                                margin: const EdgeInsets.only(bottom: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF9FAFB),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          width: 32,
                                          height: 32,
                                          decoration: const BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: Color(0xFF10B981),
                                          ),
                                          child: const Icon(
                                            Icons.person,
                                            size: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              const Text(
                                                'Jane Smith',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: Color(0xFF1A1A1A),
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              const Text(
                                                'This looks amazing! I need to visit 😍',
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  color: Color(0xFF6B7280),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    const Text(
                                      '1 hour ago',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Comment Input
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: const BoxDecoration(
                            border: Border(
                              top: BorderSide(
                                color: Color(0xFFE0E0E0),
                                width: 1,
                              ),
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 12,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF3F4F6),
                                    borderRadius: BorderRadius.circular(24),
                                  ),
                                  child: const Text(
                                    'Add a comment...',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Color(0xFF9CA3AF),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: const BoxDecoration(
                                  color: Color(0xFF3B82F6),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.send,
                                  size: 20,
                                  color: Colors.white,
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
    );
  }
}
