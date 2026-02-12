import 'package:flutter/material.dart';

class PrivacyPage extends StatefulWidget {
  const PrivacyPage({super.key});

  @override
  State<PrivacyPage> createState() => _PrivacyPageState();
}

class _PrivacyPageState extends State<PrivacyPage> {
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
                      'Privacy Policy',
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
          // Privacy Policy Content
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
                          Icons.security,
                          color: Color(0xFFFF0000),
                          size: 32,
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Your Privacy Matters',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFF0000),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'We believe in being transparent about how we handle your data. Here\'s everything you need to know in simple terms.',
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

                  // What We Collect
                  _buildSection(
                    icon: Icons.data_object,
                    title: 'What Information Do We Collect?',
                    content:
                        'We only collect what we need to provide you with the best experience:\n\n'
                        '• Account details (name, email, profile info)\n'
                        '• Content you share (posts, photos, reviews)\n'
                        '• Location when you choose to share it\n'
                        '• Device and app usage information\n'
                        '• Messages and comments you post',
                  ),

                  // How We Use It
                  _buildSection(
                    icon: Icons.settings,
                    title: 'How Do We Use Your Information?',
                    content:
                        'Your information helps us:\n\n'
                        '• Personalize your experience\n'
                        '• Help you discover great food spots\n'
                        '• Connect you with the community\n'
                        '• Send important updates about your account\n'
                        '• Keep our platform safe and secure',
                  ),

                  // Sharing
                  _buildSection(
                    icon: Icons.share,
                    title: 'Do We Share Your Information?',
                    content:
                        'We\'re very careful about your data:\n\n'
                        '• We NEVER sell your personal information\n'
                        '• We don\'t share it with advertisers\n'
                        '• Only share when you explicitly tell us to\n'
                        '• With trusted service providers who help run the app\n'
                        '• When required by law (very rare)',
                  ),

                  // Your Control
                  _buildSection(
                    icon: Icons.manage_accounts,
                    title: 'You\'re in Control',
                    content:
                        'You have complete control over your data:\n\n'
                        '• See what data we have about you\n'
                        '• Update or correct your information\n'
                        '• Delete your account and data anytime\n'
                        '• Opt out of emails and notifications\n'
                        '• Download all your data in a portable format',
                  ),

                  // Security
                  _buildSection(
                    icon: Icons.lock,
                    title: 'How We Protect Your Data',
                    content:
                        'Your security is our priority:\n\n'
                        '• Industry-standard encryption\n'
                        '• Regular security updates\n'
                        '• Limited access to your information\n'
                        '• Regular security checks\n'
                        '• 24/7 monitoring for suspicious activity',
                  ),

                  // Contact
                  _buildSection(
                    icon: Icons.contact_support,
                    title: 'Questions? We\'re Here to Help',
                    content:
                        'If you have any questions about your privacy:\n\n'
                        '• Email us at: bytspot.in@gmail.com\n'
                        '• Call us: +919846170136\n'
                        '• Visit us: Calicut, Kerala, India\n\n'
                        'We typically respond within 24 hours!',
                  ),

                  // Updates
                  _buildSection(
                    icon: Icons.update,
                    title: 'When This Policy Changes',
                    content:
                        'If we update this privacy policy:\n\n'
                        '• We\'ll notify you in the app\n'
                        '• Send you an email about important changes\n'
                        '• Post updated date at the top\n'
                        '• Give you time to review changes',
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
                          'Last Updated: January 2026',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Thank you for trusting Bytspot with your data. We take this responsibility seriously.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF1A1A1A),
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
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
