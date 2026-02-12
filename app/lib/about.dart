import 'package:flutter/material.dart';

class AboutPage extends StatefulWidget {
  const AboutPage({super.key});

  @override
  State<AboutPage> createState() => _AboutPageState();
}

class _AboutPageState extends State<AboutPage> {
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
                      'About Bytspot',
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
          // About Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // App Logo and Name
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF5F5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFFFF0000),
                        width: 1,
                      ),
                    ),
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFF0000),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Image.asset(
                            'assets/images/icon_red.png',
                            width: 50,
                            height: 50,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(
                                Icons.restaurant,
                                color: Colors.white,
                                size: 50,
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'Bytspot',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A1A1A),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Food Discovery App',
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Version Info
                  _buildSection(
                    icon: Icons.system_update,
                    title: 'App Information',
                    content:
                        '• Version: 1.0.0\n'
                        '• Build: 2026.01.15\n'
                        '• Platform: Flutter\n'
                        '• Developer: Bytspot Inc.\n'
                        '• Release: Stable',
                  ),

                  // What is Bytspot
                  _buildSection(
                    icon: Icons.info_outline,
                    title: 'What is Bytspot?',
                    content:
                        'Discover amazing food spots and share your experiences with the community. Find hidden gems, read authentic reviews, and connect with fellow food lovers in your area.\n\n'
                        'Bytspot helps you:\n'
                        '• Find the best local restaurants\n'
                        '• Read honest reviews from real customers\n'
                        '• Share your own food experiences\n'
                        '• Connect with other food enthusiasts\n'
                        '• Discover hidden culinary gems',
                  ),

                  // Features
                  _buildSection(
                    icon: Icons.star,
                    title: 'Key Features',
                    content:
                        '• Interactive food discovery map\n'
                        '• User-generated reviews and ratings\n'
                        '• Photo sharing for food spots\n'
                        '• Community-driven recommendations\n'
                        '• Personalized food preferences\n'
                        '• Real-time updates and notifications',
                  ),

                  // Company Info
                  _buildSection(
                    icon: Icons.business,
                    title: 'Company Information',
                    content:
                        '• Company: Bytspot Inc.\n'
                        '• Location: Calicut, Kerala, India\n'
                        '• Email: bytspot.in@gmail.com\n'
                        '• Phone: +919846170136\n'
                        '• Founded: 2025\n'
                        '• Mission: Connect food lovers everywhere',
                  ),

                  // Contact & Support
                  _buildSection(
                    icon: Icons.contact_support,
                    title: 'Contact & Support',
                    content:
                        'Need help or have questions? We\'re here for you!\n\n'
                        '• Email: bytspot.in@gmail.com\n'
                        '• Phone: +919846170136\n'
                        '• Location: Calicut, Kerala, India\n\n'
                        'Our support team typically responds within 24 hours. We\'re committed to making your Bytspot experience amazing!',
                  ),

                  // Privacy & Terms
                  _buildSection(
                    icon: Icons.security,
                    title: 'Privacy & Terms',
                    content:
                        '• Privacy Policy: Your data is protected\n'
                        '• Terms of Service: Clear usage guidelines\n'
                        '• Data Security: Industry-standard encryption\n'
                        '• User Rights: Control your information\n'
                        '• Transparency: Open about our practices',
                  ),

                  const SizedBox(height: 40),

                  // Footer
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    color: const Color(0xFFF8F9FA),
                    child: Column(
                      children: const [
                        Text(
                          'Made with ❤️ for Food Lovers',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF1A1A1A),
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 4),
                        Text(
                          '© 2025 Bytspot Inc. All rights reserved.',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
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
