import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpSupportPage extends StatefulWidget {
  const HelpSupportPage({super.key});

  @override
  State<HelpSupportPage> createState() => _HelpSupportPageState();
}

class _HelpSupportPageState extends State<HelpSupportPage> {
  final List<Map<String, dynamic>> _helpTopics = [
    {
      'title': 'Getting Started',
      'icon': Icons.play_circle_outline,
      'description': 'Learn the basics of using Bytspot',
      'content': [
        '• Create an account to save your favorite spots',
        '• Browse spots by category or location',
        '• Save posts you love for later',
        '• Share your own discoveries with the community',
        '• Rate and review spots you\'ve visited',
      ],
    },
    {
      'title': 'Finding Spots',
      'icon': Icons.search,
      'description': 'How to discover amazing places',
      'content': [
        '• Use the search bar to find specific spots',
        '• Browse categories like cafes, restaurants, etc.',
        '• Filter by distance, rating, or price',
        '• Check spot details before visiting',
      ],
    },
    {
      'title': 'Saving & Bookmarks',
      'icon': Icons.bookmark,
      'description': 'Manage your favorite spots and posts',
      'content': [
        '• Tap the bookmark icon to save spots',
        '• Click Bookmark to save community posts',
        '• View all saved items in profile section',
        '• Organize saved content by category',
        '• Share saved spots with friends',
      ],
    },
    {
      'title': 'Community Features',
      'icon': Icons.groups,
      'description': 'Connect with other food lovers',
      'content': [
        '• Share your own spot discoveries',
        '• Like and comment on community posts',
        '• Follow other users for updates',
        '• Join discussions about local spots',
        '• Report inappropriate content',
      ],
    },
    {
      'title': 'Account Settings',
      'icon': Icons.settings,
      'description': 'Customize your app experience',
      'content': [
        '• Manage notifications preferences',
        '• Control location services access',
        '• Choose your language settings',
        '• Clear cache to free up space',
        '• Update your profile information',
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text(
          'Help & Support',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Quick Actions
          Row(
            children: [
              Expanded(
                child: _buildQuickAction(
                  icon: Icons.chat,
                  title: 'Live Chat',
                  subtitle: 'Connect on WhatsApp',
                  onTap: () async {
                    final Uri whatsappUrl = Uri.parse(
                      'https://wa.me/919846170136?text=Hi! I need help with Bytspot app.',
                    );
                    try {
                      await launchUrl(whatsappUrl);
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Opening WhatsApp...'),
                            backgroundColor: Color(0xFF10B981),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    }
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickAction(
                  icon: Icons.email,
                  title: 'Email Us',
                  subtitle: 'Get help via email',
                  onTap: () async {
                    final String emailUrl =
                        'mailto:bytspot.in@gmail.com?subject=Help Request - Bytspot App&body=Hi Bytspot Team,\n\nI need help with Bytspot app. Please assist me with:\n\n[Describe your issue here]\n\nThank you!';
                    try {
                      await launchUrl(
                        Uri.parse(emailUrl),
                        mode: LaunchMode.externalApplication,
                      );
                    } catch (e) {
                      // Fallback to copy
                      Clipboard.setData(
                        ClipboardData(text: 'bytspot.in@gmail.com'),
                      );
                      if (!context.mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Email copied to clipboard!'),
                          backgroundColor: Color(0xFF10B981),
                          duration: Duration(seconds: 3),
                        ),
                      );
                    }
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Help Topics
          const Text(
            'Popular Topics',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 16),

          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _helpTopics.length,
            itemBuilder: (context, index) {
              final topic = _helpTopics[index];
              return _buildHelpTopic(topic);
            },
          ),

          const SizedBox(height: 24),

          // Contact Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FA),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE5E7EB), width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Still need help?',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 12),
                _buildContactOption(
                  icon: Icons.phone,
                  title: 'Call Us',
                  subtitle: '+919846170136',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Calling support...'),
                        backgroundColor: Color(0xFF10B981),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 12),
                _buildContactOption(
                  icon: Icons.schedule,
                  title: 'Business Hours',
                  subtitle: 'Mon-Fri: 9AM-6PM EST',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Support hours copied'),
                        backgroundColor: Color(0xFF10B981),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // FAQ Link
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFF0000).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFFFF0000).withValues(alpha: 0.3),
                width: 1,
              ),
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.help_outline,
                  size: 32,
                  color: Color(0xFFFF0000),
                ),
                const SizedBox(height: 8),
                const Text(
                  'View FAQ',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFFF0000),
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Find answers to common questions',
                  style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE5E7EB), width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              spreadRadius: 0,
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, size: 32, color: const Color(0xFFFF0000)),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1A1A1A),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHelpTopic(Map<String, dynamic> topic) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            spreadRadius: 0,
          ),
        ],
      ),
      child: ExpansionTile(
        leading: Icon(topic['icon'], color: const Color(0xFF3B82F6), size: 24),
        title: Text(
          topic['title'],
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1A1A1A),
          ),
        ),
        subtitle: Text(
          topic['description'],
          style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (String item in topic['content'])
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      item,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color(0xFF6B7280),
                        height: 1.4,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF3B82F6)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
