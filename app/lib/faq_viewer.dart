import 'package:flutter/material.dart';
import 'widgets/app_background.dart';
import 'dart:ui';

class FAQViewerPage extends StatefulWidget {
  const FAQViewerPage({super.key});

  @override
  State<FAQViewerPage> createState() => _FAQViewerPageState();
}

class _FAQViewerPageState extends State<FAQViewerPage> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, String>> _filteredFaqs = [];
  String _searchQuery = '';

  final List<Map<String, String>> _allFaqs = [
    {
      'question': '1. How do I find food spots near me?',
      'answer':
          'You can find nearby food spots by enabling location access on your device. Once location services are enabled, the app automatically shows restaurants, cafés, and other food places around your current location.',
    },
    {
      'question': '2. Can I search for a specific type of food?',
      'answer':
          'Yes, you can search for specific food types using the search bar. For example, you can search for burgers, pizza, cafés, or street food, and the app will show relevant places that offer those items.',
    },
    {
      'question': '3. How can I save my favorite food spots?',
      'answer':
          'When you discover a place you like, you can tap the heart icon to save it as a favorite. This allows you to quickly access the place later without searching again.',
    },
    {
      'question': '4. Can users add new food spots?',
      'answer':
          'Yes, users can contribute to the platform by submitting new food spots. If you discover a place that is not listed, you can add it so others can find and enjoy it as well.',
    },
    {
      'question': '5. Is the app free to use?',
      'answer':
          'Yes, Food Spot Finder is free to use for discovering food spots and exploring nearby places.',
    },
    {
      'question': '6. Can I explore food spots in another location?',
      'answer':
          'Yes, you can search for food spots in different areas by entering the location name in the search bar.',
    },
    {
      'question': '7. Can I view details about a food spot?',
      'answer':
          'Each food spot includes helpful information such as the place name, photos, opening hours, and sometimes price range or food categories. This helps users decide whether the place suits their needs.',
    },
    {
      'question': '8. Can I see which places are popular?',
      'answer':
          'The app highlights popular food spots that many users are interested in or visit frequently.',
    },
    {
      'question': '9. Can I share food spots with friends?',
      'answer':
          'Yes, you can share food spots with friends by sending the link or sharing it through messaging or social media apps.',
    },
    {
      'question': '10. How accurate is the location information?',
      'answer':
          'Location information is based on the data provided when a food spot is added. The app aims to show accurate information so users can easily find the place.',
    },
    {
      'question': '11. Can I report incorrect information?',
      'answer':
          'Yes, if you notice incorrect details about a food spot, you can report it so the information can be reviewed and corrected.',
    },
    {
      'question': '12. Do I need an account to use the app?',
      'answer':
          'You can explore food spots without an account, but creating an account allows you to save favorites and manage your personal preferences.',
    },
    {
      'question': '13. Can I upload photos when adding a food spot?',
      'answer':
          'Yes, when submitting a new food spot, users may add photos to help others see what the place looks like.',
    },
    {
      'question': '14. Can I update information about a spot I added?',
      'answer':
          'If you added a food spot and notice something that needs to be updated, you may be able to edit or submit corrections.',
    },
    {
      'question': '15. Can I discover new local food places?',
      'answer':
          'Yes, the app helps users discover both popular restaurants and smaller local food spots that may not be widely known.',
    },
    {
      'question': '16. Can I find places that are open now?',
      'answer':
          'Many listings include opening hours, which helps users check if a place is currently open before visiting.',
    },
    {
      'question': '17. Can I view photos of food spots?',
      'answer':
          'Yes, many food spots include photos uploaded by users or owners. These photos help users understand the place before visiting.',
    },
    {
      'question': '18. Does the app use my location data?',
      'answer':
          'The app may use your location to show nearby food spots. This helps improve the search experience and provide relevant results.',
    },
    {
      'question': '19. Can I explore different food categories?',
      'answer':
          'Yes, the app may show different food categories to help users quickly discover the types of food they want.',
    },
    {
      'question': '20. What should I do if the app is not working correctly?',
      'answer':
          'If the app is not working properly, try restarting it or checking your internet connection. If the problem continues, you can contact support for assistance.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _filteredFaqs = _allFaqs;
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.toLowerCase();
      _filteredFaqs = _allFaqs.where((faq) {
        return faq['question']!.toLowerCase().contains(_searchQuery) ||
            faq['answer']!.toLowerCase().contains(_searchQuery);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'User Guide & FAQ',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontSize: 20,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      body: AppBackground(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 40),
          children: [
            // Introduction Card - Compact and Elegant
            _GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE53935).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(
                          Icons.auto_stories,
                          color: Color(0xFFE53935),
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Introduction',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF111827),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Food Spot Finder is designed to make discovering food simple and fun. Explore, search, and save your favorite spots instantly.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF4B5563),
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Search Bar
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search questions or keywords...',
                  hintStyle: TextStyle(color: Colors.grey[400], fontSize: 13),
                  prefixIcon: const Icon(
                    Icons.search,
                    color: Color(0xFFE53935),
                    size: 20,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 14,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            if (_searchQuery.isEmpty)
              const Text(
                'Frequently Asked Questions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF111827),
                ),
              ),
            if (_searchQuery.isNotEmpty)
              Text(
                'Search Results (${_filteredFaqs.length})',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF111827),
                ),
              ),
            const SizedBox(height: 16),

            // FAQ List
            if (_filteredFaqs.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.search_off, size: 64, color: Colors.grey[200]),
                      const SizedBox(height: 16),
                      const Text(
                        'No matching questions found',
                        style: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...List.generate(_filteredFaqs.length, (index) {
                final faq = _filteredFaqs[index];
                return _AnimatedFaqItem(faq: faq, index: index);
              }),

            const SizedBox(height: 24),
            // Support Footer
            _GlassCard(
              color: const Color(0xFFE53935).withOpacity(0.03),
              borderColor: const Color(0xFFE53935).withOpacity(0.1),
              child: Column(
                children: [
                  const Icon(
                    Icons.headset_mic_rounded,
                    color: Color(0xFFE53935),
                    size: 32,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Still Need Help?',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Our support team is always here to assist you.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: Color(0xFF4B5563),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFE53935),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Contact Support',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimatedFaqItem extends StatefulWidget {
  final Map<String, String> faq;
  final int index;

  const _AnimatedFaqItem({required this.faq, required this.index});

  @override
  State<_AnimatedFaqItem> createState() => _AnimatedFaqItemState();
}

class _AnimatedFaqItemState extends State<_AnimatedFaqItem>
    with SingleTickerProviderStateMixin {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _isExpanded
              ? const Color(0xFFE53935).withOpacity(0.3)
              : Colors.white,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          onExpansionChanged: (expanded) {
            setState(() => _isExpanded = expanded);
          },
          title: Text(
            widget.faq['question']!,
            style: TextStyle(
              fontSize: 15,
              fontWeight: _isExpanded ? FontWeight.w800 : FontWeight.w600,
              color: _isExpanded
                  ? const Color(0xFFE53935)
                  : const Color(0xFF1F2937),
            ),
          ),
          iconColor: const Color(0xFFE53935),
          collapsedIconColor: const Color(0xFF9CA3AF),
          tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          childrenPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF9FAFB),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Text(
                widget.faq['answer']!,
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF4B5563),
                  height: 1.6,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GlassCard extends StatelessWidget {
  final Widget child;
  final Color? color;
  final Color? borderColor;

  const _GlassCard({required this.child, this.color, this.borderColor});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: color ?? Colors.white.withOpacity(0.7),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor ?? Colors.white, width: 1.5),
          ),
          child: child,
        ),
      ),
    );
  }
}
