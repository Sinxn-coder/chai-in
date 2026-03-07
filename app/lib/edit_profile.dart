import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'services/notification_service.dart';
import 'services/image_helper.dart';
import 'supabase_config.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'widgets/food_loading.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _cityController = TextEditingController();

  Map<String, dynamic>? _userData;
  bool _isLoading = true;
  bool _isSaving = false;
  File? _selectedImage;
  bool _isUploadingImage = false;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return;

      final data = await SupabaseConfig.client
          .from('users')
          .select()
          .eq('id', user.id)
          .maybeSingle();

      if (data != null && mounted) {
        setState(() {
          _userData = data; // Store the full data map
          _nameController.text = data['full_name'] ?? '';
          _usernameController.text = data['username'] ?? '';
          _emailController.text = data['email'] ?? user.email ?? '';
          _cityController.text = data['city'] ?? '';
          _isLoading = false;
        });
      } else {
        if (mounted) setState(() => _isLoading = false);
      }
    } catch (e) {
      debugPrint('Error loading profile: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: source,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 75,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
      NotificationService.show(
        message: 'Error picking image',
        type: NotificationType.error,
      );
    }
  }

  void _showImagePickerSourceSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Camera'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Gallery'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<String?> _uploadImage(String userId) async {
    if (_selectedImage == null) return null;

    setState(() => _isUploadingImage = true);
    try {
      final fileName =
          '$userId/avatar_${DateTime.now().millisecondsSinceEpoch}.jpg';

      // Upload to Supabase Storage 'profiles' bucket
      await SupabaseConfig.client.storage
          .from('profiles')
          .upload(
            fileName,
            _selectedImage!,
            fileOptions: const FileOptions(
              contentType: 'image/jpeg',
              upsert: true,
            ),
          );

      // Get Public URL
      final String publicUrl = SupabaseConfig.client.storage
          .from('profiles')
          .getPublicUrl(fileName);

      return publicUrl;
    } catch (e) {
      debugPrint('Error uploading image: $e');
      NotificationService.show(
        message: 'Failed to upload profile picture: $e',
        type: NotificationType.error,
      );
      return null;
    } finally {
      setState(() => _isUploadingImage = false);
    }
  }

  Future<void> _updateProfile() async {
    if (_nameController.text.isEmpty || _usernameController.text.isEmpty) {
      NotificationService.show(
        message: 'Name and Username are required',
        type: NotificationType.error,
      );
      return;
    }

    final username = _usernameController.text.trim();

    setState(() => _isSaving = true);
    try {
      final user = SupabaseConfig.client.auth.currentUser;
      if (user == null) return;

      String? avatarUrl = _userData?['avatar_url'];
      final String? oldAvatarUrl = avatarUrl; // Keep track of the old one

      // Upload new image if selected
      if (_selectedImage != null) {
        final newAvatarUrl = await _uploadImage(user.id);
        if (newAvatarUrl != null) {
          avatarUrl = newAvatarUrl;
        }
      }

      // Check if username is already taken by another user
      final existingUser = await SupabaseConfig.client
          .from('users')
          .select('id')
          .eq('username', username)
          .neq('id', user.id)
          .maybeSingle();

      if (existingUser != null) {
        NotificationService.show(
          message: 'This username is already taken. Please choose another one.',
          type: NotificationType.error,
        );
        setState(() => _isSaving = false);
        return;
      }

      await SupabaseConfig.client.from('users').upsert({
        'id': user.id,
        'full_name': _nameController.text,
        'username': username,
        'email': _emailController.text,
        'city': _cityController.text,
        'avatar_url': avatarUrl,
        'updated_at': DateTime.now().toIso8601String(),
      });

      // After successful DB update, delete old image from storage if it changed
      if (_selectedImage != null &&
          oldAvatarUrl != null &&
          oldAvatarUrl != avatarUrl &&
          oldAvatarUrl.contains('/profiles/')) {
        try {
          // Robust path extraction: get path without query params, then take part after 'profiles/'
          final uri = Uri.parse(oldAvatarUrl);
          final String fullPath = uri.path;

          if (fullPath.contains('profiles/')) {
            final String oldPath = fullPath.split('profiles/').last;
            debugPrint(
              'Attempting to delete old profile image at path: $oldPath',
            );
            final List<FileObject> deletedFiles = await SupabaseConfig
                .client
                .storage
                .from('profiles')
                .remove([oldPath]);

            if (deletedFiles.isNotEmpty) {
              debugPrint('Successfully deleted old profile image: $oldPath');
            } else {
              debugPrint(
                'Deletion returned empty: image might already be gone or permission denied.',
              );
            }
          }
        } catch (e) {
          debugPrint('CRITICAL: Error deleting old profile image: $e');
          // Don't show error to user as the main update succeeded
        }
      }

      if (mounted) {
        NotificationService.show(
          message: 'Profile updated successfully!',
          type: NotificationType.success,
        );
        Navigator.pop(context);
      }
    } catch (e) {
      NotificationService.show(
        message: 'Update failed: $e',
        type: NotificationType.error,
      );
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const FoodLoadingScreen();
    }

    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 360;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9FA),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Edit Profile',
          style: TextStyle(
            color: const Color(0xFF1A1A1A),
            fontSize: isSmallScreen ? 18 : 20,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
          child: Column(
            children: [
              // Profile Picture Section
              Container(
                padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      spreadRadius: 0,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: isSmallScreen ? 80 : 100,
                          height: isSmallScreen ? 80 : 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 15,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(50),
                            child: _buildAvatar(),
                          ),
                        ),
                        if (_isUploadingImage)
                          Container(
                            width: isSmallScreen ? 80 : 100,
                            height: isSmallScreen ? 80 : 100,
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.3),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(child: FoodLoading(size: 30)),
                          ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: GestureDetector(
                            onTap: _showImagePickerSourceSheet,
                            child: Container(
                              width: isSmallScreen ? 28 : 32,
                              height: isSmallScreen ? 28 : 32,
                              decoration: BoxDecoration(
                                color: const Color(0xFFFF0000),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2,
                                ),
                              ),
                              child: Icon(
                                Icons.camera_alt,
                                color: Colors.white,
                                size: isSmallScreen ? 14 : 16,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: _showImagePickerSourceSheet,
                      child: const Text(
                        'Change Photo',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF3B82F6),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Profile Information
              Container(
                padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
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
                    const Text(
                      'Profile Information',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1A1A1A),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(_nameController, 'Full Name'),
                    const SizedBox(height: 16),
                    _buildTextField(_usernameController, 'Username'),
                    const SizedBox(height: 16),
                    _buildTextField(
                      _emailController,
                      'Email Address',
                      enabled: false,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(_cityController, 'City'),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Save Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _updateProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFF0000),
                    foregroundColor: Colors.white,
                    padding: EdgeInsets.symmetric(
                      vertical: isSmallScreen ? 12 : 16,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: FoodLoading(size: 20),
                        )
                      : Text(
                          'Update Profile',
                          style: TextStyle(
                            fontSize: isSmallScreen ? 14 : 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, {
    bool enabled = true,
    int maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      enabled: enabled,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Color(0xFF6B7280), fontSize: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFFF0000)),
        ),
        filled: !enabled,
        fillColor: !enabled ? Colors.grey[100] : null,
      ),
    );
  }

  Widget _buildAvatar() {
    if (_selectedImage != null) {
      return Image.file(_selectedImage!, fit: BoxFit.cover);
    }

    final user = SupabaseConfig.client.auth.currentUser;
    // Prefer DB data if available, fallback to Google auth data, then fallback to icon
    final avatarUrl =
        _userData?['avatar_url'] ?? user?.userMetadata?['avatar_url'];

    if (avatarUrl == null || avatarUrl.isEmpty) {
      return Image.asset('assets/images/icon.png', fit: BoxFit.cover);
    }

    return ImageHelper.loadImage(
      avatarUrl,
      bucket: 'profiles',
      fit: BoxFit.cover,
    );
  }
}
