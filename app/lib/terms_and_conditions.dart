import 'package:flutter/material.dart';

class TermsAndConditionsPage extends StatefulWidget {
  const TermsAndConditionsPage({super.key});

  @override
  State<TermsAndConditionsPage> createState() => _TermsAndConditionsPageState();
}

class _TermsAndConditionsPageState extends State<TermsAndConditionsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Custom AppBar with red theme - touches top of screen
          Container(
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
            decoration: const BoxDecoration(
              color: Color(0xFFFF0000),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: SafeArea(
              bottom: false,
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                  const Expanded(
                    child: Text(
                      'Terms and Conditions',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48), // Balance back button
                ],
              ),
            ),
          ),
          // Terms and Conditions Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Introduction
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF5F5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFFFF0000),
                        width: 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(
                          Icons.handshake,
                          color: Color(0xFFFF0000),
                          size: 32,
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Let\'s Build Great Together!',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFF0000),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'We\'re excited to have you join our community! These simple guidelines help everyone have the best experience on Bytspot.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF1A1A1A),
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Welcome Agreement
                  _buildSection(
                    icon: Icons.favorite,
                    title: 'Welcome to Our Community!',
                    content:
                        'By using Bytspot, you\'re joining a community of food lovers who share discoveries and help each other find amazing spots. We\'re committed to making this experience safe, fun, and valuable for everyone.',
                  ),

                  // Your Account
                  _buildSection(
                    icon: Icons.shield,
                    title: 'Your Account is Safe with Us',
                    content:
                        'We help you keep your account secure:\n\n'
                        '• Your login details are encrypted\n'
                        '• Only you can access your account\n'
                        '• You control what you share\n'
                        '• We notify you of important activity\n'
                        '• We protect against unauthorized access',
                  ),

                  // Sharing Guidelines
                  _buildSection(
                    icon: Icons.share,
                    title: 'Share Your Food Discoveries',
                    content:
                        'We love seeing your food adventures! Please share content that:\n\n'
                        '• Shows real food experiences\n'
                        '• Helps others discover great spots\n'
                        '• Is respectful and helpful\n'
                        '• Is relevant to food discovery\n'
                        '• Makes our community better\n\n'
                        'Let\'s keep our community positive and inspiring!',
                  ),

                  // Service Improvements
                  _buildSection(
                    icon: Icons.trending_up,
                    title: 'We\'re Always Improving',
                    content:
                        'We\'re constantly working to make Bytspot better:\n\n'
                        '• Adding new features you\'ll love\n'
                        '• Fixing bugs and improving performance\n'
                        '• Making the app easier to use\n'
                        '• Updating the design\n'
                        '• Keeping you informed of changes\n\n'
                        'Your feedback helps us improve!',
                  ),

                  // Content Rights
                  _buildSection(
                    icon: Icons.copyright,
                    title: 'Respecting Content and Creators',
                    content:
                        'We believe in fair use and giving credit:\n\n'
                        '• You own the content you create\n'
                        '• Share responsibly within the app\n'
                        '• Respect others\' creative work\n'
                        '• Help us build a positive community\n'
                        '• Your contributions make Bytspot special',
                  ),

                  // Privacy Protection
                  _buildSection(
                    icon: Icons.security,
                    title: 'Your Privacy Matters',
                    content:
                        'We take your privacy seriously:\n\n'
                        '• Only collect what we need\n'
                        '• Keep your data secure\n'
                        '• Transparent about data use\n'
                        '• You control your information\n'
                        '• We\'re here to answer questions\n\n'
                        'Check our Privacy Policy for full details!',
                  ),

                  // Fair Use
                  _buildSection(
                    icon: Icons.balance,
                    title: 'Fair Use for Everyone',
                    content:
                        'We want everyone to have a great experience:\n\n'
                        '• Use the app as intended\n'
                        '• Be respectful to others\n'
                        '• Follow community guidelines\n'
                        '• Report issues you see\n'
                        '• Help us improve together\n\n'
                        'Let\'s create the best food discovery community!',
                  ),

                  // Support Team
                  _buildSection(
                    icon: Icons.support_agent,
                    title: 'We\'re Here to Help!',
                    content:
                        'Have questions or concerns? We\'re here for you:\n\n'
                        '• Email: bytspot.in@gmail.com\n'
                        '• Phone: +919846170136\n'
                        '• Visit: Calicut, Kerala, India\n\n'
                        'Our team typically responds within 24 hours. We\'re committed to making your Bytspot experience amazing!',
                  ),

                  const SizedBox(height: 40),

                  // Footer
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: const [
                        Text(
                          'Ready to Start Your Food Adventure?',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFF0000),
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Thank you for being part of our community. Together, we\'re building the best place to discover amazing food and share experiences with fellow food lovers!',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF1A1A1A),
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Last Updated: January 2026',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF0000).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: const Color(0xFFFF0000), size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              content,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF1A1A1A),
                height: 1.6,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
