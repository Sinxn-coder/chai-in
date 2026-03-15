import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'services/post_service.dart';
import 'services/notification_service.dart';
import 'supabase_config.dart';
import 'add_spot.dart';
import 'dart:ui';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final TextEditingController _contentController = TextEditingController();
  final List<String> _images = [];
  final ImagePicker _picker = ImagePicker();
  bool _isPosting = false;

  // Spot selection state
  String? _selectedSpotId;
  String? _selectedSpotName;
  bool _isManualMention = false;
  
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;
  final FocusNode _searchFocusNode = FocusNode();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _contentController.addListener(_checkForSpotName);
  }

  @override
  void dispose() {
    _contentController.removeListener(_checkForSpotName);
    _contentController.dispose();
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  // Auto-fill logic: detect "at [Name]" or "@[Name]"
  void _checkForSpotName() {
    if (_selectedSpotId != null || _isManualMention) return;

    final text = _contentController.text;
    final atMatch = RegExp(r'at\s+([A-Z][a-zA-Z\s]{2,20})').firstMatch(text);
    
    if (atMatch != null) {
      final potentialName = atMatch.group(1)?.trim();
      if (potentialName != null && potentialName.isNotEmpty) {
        // Only suggest if not already searching or selected
        if (_searchController.text.isEmpty) {
          _searchController.text = potentialName;
          _searchSpots(potentialName);
        }
      }
    }
  }

  Future<void> _searchSpots(String query) async {
    if (query.isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearching = false;
      });
      return;
    }

    setState(() => _isSearching = true);

    try {
      final response = await SupabaseConfig.client
          .from('spots')
          .select('id, name, city')
          .ilike('name', '%$query%')
          .eq('status', 'approved')
          .limit(5);

      setState(() {
        _searchResults = List<Map<String, dynamic>>.from(response);
        _isSearching = false;
      });
    } catch (e) {
      debugPrint('Error searching spots: $e');
      setState(() => _isSearching = false);
    }
  }

  Future<void> _showImageSourceOptions() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Add Photo',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 25),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildSourceButton(
                  icon: Icons.camera_alt_rounded,
                  label: 'Camera',
                  onTap: () {
                    Navigator.pop(context);
                    _pickFromCamera();
                  },
                ),
                _buildSourceButton(
                  icon: Icons.photo_library_rounded,
                  label: 'Gallery',
                  onTap: () {
                    Navigator.pop(context);
                    _pickFromGallery();
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSourceButton({required IconData icon, required String label, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              shape: BoxShape.circle,
              border: Border.all(color: Colors.grey[100]!),
            ),
            child: Icon(icon, size: 32, color: const Color(0xFFFF0000)),
          ),
          const SizedBox(height: 10),
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickFromGallery() async {
    try {
      final List<XFile> pickedFiles = await _picker.pickMultiImage(
        imageQuality: 70,
      );

      if (pickedFiles.isNotEmpty) {
        setState(() {
          _images.addAll(pickedFiles.map((file) => file.path));
        });
      }
    } catch (e) {
      NotificationService.show(
        message: 'Error picking images: $e',
        type: NotificationType.error,
      );
    }
  }

  Future<void> _pickFromCamera() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70,
      );
      if (image != null) {
        setState(() => _images.add(image.path));
      }
    } catch (e) {
      debugPrint('Camera error: $e');
    }
  }

  Future<void> _handlePost() async {
    if (_contentController.text.trim().isEmpty && _images.isEmpty) {
      NotificationService.show(
        message: 'Please add some content or an image',
        type: NotificationType.error,
      );
      return;
    }

    setState(() => _isPosting = true);

    final success = await PostService.createPost(
      content: _contentController.text.trim(),
      imagePaths: _images,
      spotId: _selectedSpotId,
      spotName: _isManualMention ? _selectedSpotName : null,
    );

    if (mounted) {
      setState(() => _isPosting = false);

      if (success) {
        if (_isManualMention && _selectedSpotName != null) {
          _showAddSpotPrompt();
        } else {
          NotificationService.show(
            message: 'Post shared successfully!',
            type: NotificationType.success,
          );
          Navigator.pop(context, true);
        }
      } else {
        NotificationService.show(
          message: 'Failed to share post. Please try again.',
          type: NotificationType.error,
        );
      }
    }
  }

  void _showAddSpotPrompt() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Material(
        type: MaterialType.transparency,
        child: Center(
          child: SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(30),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                  child: Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.5),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 40,
                          offset: const Offset(0, 20),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Glowing Icon
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFF0000).withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFFF0000).withValues(alpha: 0.2),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.auto_awesome_rounded,
                            color: Color(0xFFFF0000),
                            size: 40,
                          ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Post Shared! 🚀',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF1A1A1A),
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'You mentioned a spot that isn\'t in our app yet:',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Spot Name Chip
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFF0000).withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(
                              color: const Color(0xFFFF0000).withValues(alpha: 0.1),
                            ),
                          ),
                          child: Text(
                            '"$_selectedSpotName"',
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                              color: Color(0xFFFF0000),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Would you like to officially add it to help others find it?',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1A1A1A),
                          ),
                        ),
                        const SizedBox(height: 32),
                        // Action Buttons
                        Column(
                          children: [
                            GestureDetector(
                              onTap: () {
                                Navigator.pop(context); // Close dialog
                                Navigator.pop(this.context, true); // Go back to community
                                Navigator.push(
                                  this.context,
                                  MaterialPageRoute(
                                    builder: (context) => AddSpotPage(initialName: _selectedSpotName),
                                  ),
                                );
                              },
                              child: Container(
                                height: 55,
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFF0000),
                                  borderRadius: BorderRadius.circular(18),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFFF0000).withValues(alpha: 0.3),
                                      blurRadius: 15,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: const Center(
                                  child: Text(
                                    'Add Official Spot',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context); // Close dialog
                                Navigator.pop(this.context, true); // Go back to community
                              },
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                              ),
                              child: Text(
                                'Maybe Later',
                                style: TextStyle(
                                  color: Colors.grey[500],
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = SupabaseConfig.client.auth.currentUser;
    final String? avatarUrl = user?.userMetadata?['avatar_url'];
    final String? fullName = user?.userMetadata?['full_name'] ?? user?.email?.split('@').first;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.black, size: 28),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Expanded(
                    child: Text(
                      'Create Post',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  if (!_isPosting)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ElevatedButton(
                        onPressed: _handlePost,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF0000),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        child: const Text(
                          'Post',
                          style: TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ),
                    )
                  else
                    const Padding(
                      padding: EdgeInsets.only(right: 16),
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Color(0xFFFF0000),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),
                    // User Info
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.grey[100],
                            border: Border.all(color: Colors.grey[200]!),
                            image: avatarUrl != null
                                ? DecorationImage(
                                    image: NetworkImage(avatarUrl),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                          ),
                          child: avatarUrl == null
                              ? const Icon(Icons.person, color: Colors.grey)
                              : null,
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              fullName ?? 'User',
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                            ),
                            const Text(
                              'Public',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Content Input
                    TextField(
                      controller: _contentController,
                      maxLines: null,
                      autofocus: true,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                        height: 1.4,
                      ),
                      decoration: const InputDecoration(
                        hintText: "What's on your mind?",
                        hintStyle: TextStyle(
                          color: Color(0xFFC4C4C4),
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                        ),
                        border: InputBorder.none,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Media Grid
                    if (_images.isNotEmpty)
                      _buildMediaGrid()
                    else
                      _buildEmptyMediaPlaceholder(),

                    const SizedBox(height: 30),

                    // Spot Tagging Section
                    _buildSpotSection(),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'PHOTOS',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: Colors.grey,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...List.generate(_images.length, (index) {
              return Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(15),
                    child: Image.file(
                      File(_images[index]),
                      width: (MediaQuery.of(context).size.width - 56) / 3,
                      height: 100,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    top: 5,
                    right: 5,
                    child: GestureDetector(
                      onTap: () => setState(() => _images.removeAt(index)),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.black54,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.close, color: Colors.white, size: 14),
                      ),
                    ),
                  ),
                ],
              );
            }),
            // Add More Button
            GestureDetector(
              onTap: _showImageSourceOptions,
              child: Container(
                width: (MediaQuery.of(context).size.width - 56) / 3,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: const Icon(Icons.add_rounded, color: Colors.grey),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildEmptyMediaPlaceholder() {
    return GestureDetector(
      onTap: _showImageSourceOptions,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 40),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey[100]!),
        ),
        child: Column(
          children: [
            Icon(Icons.add_a_photo_outlined, color: Colors.grey[300], size: 48),
            const SizedBox(height: 12),
            Text(
              'Add some photos to your post',
              style: TextStyle(
                color: Colors.grey[400],
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpotSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'LOCATION',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Colors.grey,
                letterSpacing: 1.2,
              ),
            ),
            if (_selectedSpotId != null || _isManualMention)
              GestureDetector(
                onTap: () => setState(() {
                  _selectedSpotId = null;
                  _selectedSpotName = null;
                  _isManualMention = false;
                }),
                child: const Text(
                  'Remove',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFFFF0000),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 12),
        if (_selectedSpotId != null || _isManualMention)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFF0000).withOpacity(0.05),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: const Color(0xFFFF0000).withOpacity(0.1)),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on_rounded, color: Color(0xFFFF0000), size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _selectedSpotName!,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                      Text(
                        _isManualMention ? 'Manually Tagged' : 'Linked Spot',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          )
        else ...[
          TextField(
            controller: _searchController,
            focusNode: _searchFocusNode,
            onChanged: _searchSpots,
            style: const TextStyle(fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Where are you?',
              prefixIcon: const Icon(Icons.search_rounded, size: 20),
              filled: true,
              fillColor: Colors.grey[50],
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
                borderSide: BorderSide(color: Colors.grey[100]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
                borderSide: BorderSide(color: Colors.grey[100]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
                borderSide: const BorderSide(color: Color(0xFFFF0000), width: 1.5),
              ),
            ),
          ),
          if (_isSearching)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 20),
              child: Center(
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFFF0000)),
                ),
              ),
            ),
          if (_searchResults.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(top: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _searchResults.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final spot = _searchResults[index];
                  return ListTile(
                    leading: const Icon(Icons.location_on_outlined, color: Colors.grey),
                    title: Text(spot['name'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    subtitle: Text(spot['city'] ?? '', style: const TextStyle(fontSize: 12)),
                    onTap: () {
                      setState(() {
                        _selectedSpotId = spot['id'];
                        _selectedSpotName = spot['name'];
                        _searchResults = [];
                        _searchController.clear();
                        _searchFocusNode.unfocus();
                      });
                    },
                  );
                },
              ),
            ),
          if (_searchController.text.isNotEmpty && !_isSearching && _searchResults.isEmpty)
            Container(
              margin: const EdgeInsets.only(top: 8),
              child: ListTile(
                leading: const Icon(Icons.add_location_alt_outlined, color: Color(0xFFFF0000)),
                title: Text('Mention "${_searchController.text}"', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                subtitle: const Text('Add this as a custom location', style: TextStyle(fontSize: 12)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                tileColor: Colors.grey[50],
                onTap: () {
                  setState(() {
                    _isManualMention = true;
                    _selectedSpotName = _searchController.text;
                    _searchController.clear();
                    _searchFocusNode.unfocus();
                  });
                },
              ),
            ),
        ],
      ],
    );
  }

}
