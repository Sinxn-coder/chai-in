import 'package:flutter/material.dart';

class MyReviewsPage extends StatefulWidget {
  const MyReviewsPage({super.key});

  @override
  State<MyReviewsPage> createState() => _MyReviewsPageState();
}

class _MyReviewsPageState extends State<MyReviewsPage> {
  final List<Map<String, dynamic>> _myReviews = [
    {
      'spotName': 'The Garden Bistro',
      'spotImage':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'rating': 5.0,
      'date': '2 days ago',
      'comment':
          'Amazing place with great vibes and excellent service! The pasta was incredible and atmosphere was perfect. Highly recommend checking it out! The staff was very friendly and the prices were reasonable.',
      'helpful': 12,
      'isHelpful': false,
    },
    {
      'spotName': 'Cafe Horizon',
      'spotImage':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'rating': 4.0,
      'date': '1 week ago',
      'comment':
          'Great coffee and cozy atmosphere! Perfect for working or catching up with friends. Their specialty latte is life-changing. The WiFi is fast and the seating is comfortable.',
      'helpful': 8,
      'isHelpful': false,
    },
    {
      'spotName': 'Green Garden',
      'spotImage':
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop',
      'rating': 4.5,
      'date': '2 weeks ago',
      'comment':
          'Beautiful outdoor seating and great food! Perfect for weekend vibes. The avocado toast was perfection and they have most amazing garden area. Very peaceful and relaxing.',
      'helpful': 15,
      'isHelpful': false,
    },
    {
      'spotName': 'Urban Grill',
      'spotImage':
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      'rating': 3.5,
      'date': '3 weeks ago',
      'comment':
          'Good food but could be better with service. The burgers were tasty and portions were generous, but the wait time was quite long during peak hours. Parking is also limited.',
      'helpful': 6,
      'isHelpful': false,
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
          'My Reviews',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: _myReviews.isEmpty ? _buildEmptyState() : _buildReviewsList(),
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
              color: const Color(0xFF3B82F6).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.reviews,
              size: 48,
              color: Color(0xFF3B82F6),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No reviews yet',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Share your experience to help others',
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _myReviews.length,
      itemBuilder: (context, index) {
        final review = _myReviews[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
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
              // Spot Header
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          review['spotImage'],
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review['spotName'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  for (int i = 0; i < 5; i++)
                                    Icon(
                                      i < review['rating']
                                          ? Icons.star
                                          : Icons.star_border,
                                      size: 16,
                                      color: const Color(0xFFF59E0B),
                                    ),
                                ],
                              ),
                              const SizedBox(width: 8),
                              Text(
                                review['rating'].toString(),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            review['date'],
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[500],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Review Content
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12.0),
                child: Text(
                  review['comment'],
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF6B7280),
                    height: 1.5,
                  ),
                ),
              ),
              // Review Actions
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: null, // Disabled - just for display
                        icon: const Icon(
                          Icons.thumb_up_outlined,
                          size: 16,
                          color: Color(0xFF3B82F6),
                        ),
                        label: Text(
                          'Helpful (${_myReviews[index]['helpful']})',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF3B82F6),
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF3B82F6)),
                          backgroundColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
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
