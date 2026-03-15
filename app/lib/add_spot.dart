import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'map_selection.dart';
import 'services/permission_service.dart';
import 'services/notification_service.dart';
import 'supabase_config.dart';
import 'widgets/food_loading.dart';
import 'services/auth_gate.dart';

class AddSpotPage extends StatefulWidget {
  final String? initialName;
  const AddSpotPage({super.key, this.initialName});

  @override
  State<AddSpotPage> createState() => _AddSpotPageState();
}

class _AddSpotPageState extends State<AddSpotPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _locationController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  final _phoneController = TextEditingController();
  final _websiteController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _mapDirectionsController = TextEditingController();
  final List<String> _specialDishes = [];
  final _openingTimeController = TextEditingController();
  final _closingTimeController = TextEditingController();
  final PermissionService _permissionService = PermissionService();
  final List<String> _images = []; // Store up to 5 images
  final ImagePicker _imagePicker = ImagePicker();

  String _selectedCategory = 'Restaurant';
  TimeOfDay _openingTime = const TimeOfDay(hour: 9, minute: 0);
  TimeOfDay _closingTime = const TimeOfDay(hour: 21, minute: 0);
  final List<String> _features = [];
  double _averageCost = 667;
  bool _imagesError = false;
  List<String> _dbCategories = [];
  bool _isLoadingCategories = true;
  bool _is24Hours = false;
  double? _latitude;
  double? _longitude;

  // Method to get price label based on current value
  String _getPriceLabel(double value) {
    switch (value.toInt()) {
      case 667:
        return '₹ 0 - 667';
      case 1334:
        return '₹ 667 - 1334';
      case 2001:
        return '₹ 1334 - 2001';
      case 2668:
        return '₹ 2001 - 2668';
      case 3335:
        return '₹ 2668 - 3335';
      case 4002:
        return '₹ 3335 - 4002';
      case 4669:
        return '₹ 4002 - 4669';
      case 5336:
        return '₹ 4669 - 5336';
      case 6003:
        return '₹ 5336 - 6003';
      case 6670:
        return '₹ 6003 - 6670';
      case 7337:
        return '₹ 6670 - 7337';
      case 8004:
        return '₹ 7337 - 8004';
      case 8671:
        return '₹ 8004 - 8671';
      case 9338:
        return '₹ 8671 - 9338';
      case 10000:
        return '₹ 9338 - 10000';
      default:
        return '₹ 0 - 667';
    }
  }

  // Method to get price display based on current value
  String _getPriceDisplay(double value) {
    switch (value.toInt()) {
      case 667:
        return '₹ 350'; // Good budget price
      case 1334:
        return '₹ 1000'; // Round thousand
      case 2001:
        return '₹ 1500'; // Round thousand
      case 2668:
        return '₹ 2500'; // Round thousand
      case 3335:
        return '₹ 3000'; // Round thousand
      case 4002:
        return '₹ 3500'; // Round thousand
      case 4669:
        return '₹ 4000'; // Round thousand
      case 5336:
        return '₹ 5000'; // Round thousand
      case 6003:
        return '₹ 5500'; // Round thousand
      case 6670:
        return '₹ 6000'; // Round thousand
      case 7337:
        return '₹ 7000'; // Round thousand
      case 8004:
        return '₹ 7500'; // Round thousand
      case 8671:
        return '₹ 8000'; // Round thousand
      case 9338:
        return '₹ 9000'; // Round thousand
      case 10000:
        return '₹ 9500'; // Round thousand
      default:
        return '₹ 350';
    }
  }

  final List<String> _availableFeatures = [
    'WiFi',
    'Parking',
    'Air Conditioning',
    'Outdoor Seating',
    'Delivery',
    'Takeout',
    'Reservations',
    'Pet Friendly',
    'Wheelchair Accessible',
    'Live Music',
    'Sports Screen',
    'Kids Area',
  ];

  @override
  void initState() {
    super.initState();
    _checkAuth();
    if (widget.initialName != null) {
      _nameController.text = widget.initialName!;
    }
    _fetchCategories();
  }

  Future<void> _checkAuth() async {
    if (!await AuthGate.check(context, message: 'Sign in to add new food spots to the community!')) {
      if (mounted) Navigator.of(context).pop();
    }
  }

  Future<void> _fetchCategories() async {
    try {
      final response = await SupabaseConfig.client
          .from('categories')
          .select('name')
          .order('name');

      if (mounted) {
        setState(() {
          _dbCategories = response.map((c) => c['name'] as String).toList();
          if (_dbCategories.isNotEmpty) {
            _selectedCategory = _dbCategories.first;
          }
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching categories: $e');
      if (mounted) {
        setState(() {
          _isLoadingCategories = false;
          // Fallback if DB fetch fails
          _dbCategories = ['Restaurant', 'Cafe', 'Bar', 'Other'];
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _locationController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    _phoneController.dispose();
    _websiteController.dispose();
    _whatsappController.dispose();
    _mapDirectionsController.dispose();
    _openingTimeController.dispose();
    _closingTimeController.dispose();
    super.dispose();
  }

  Future<void> _selectTime(BuildContext context, bool isOpeningTime) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: isOpeningTime ? _openingTime : _closingTime,
      builder: (BuildContext context, Widget? child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: false),
          child: Theme(
            data: Theme.of(context).copyWith(
              colorScheme: const ColorScheme.light(
                primary: Color(0xFFFF0000),
                onPrimary: Colors.white,
                secondary: Color(0xFFFF0000),
                onSecondary: Colors.white,
                surface: Colors.white,
                onSurface: Color(0xFF1A1A1A),
                surfaceContainerHighest: Color(0xFFFFF5F5),
                onSurfaceVariant: Color(0xFFFF0000),
              ),
              textButtonTheme: TextButtonThemeData(
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFFFF0000),
                  backgroundColor: const Color(0xFFFFF5F5),
                  textStyle: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              dialogTheme: const DialogThemeData(
                backgroundColor: Colors.white,
                shadowColor: Color(0xFF1A1A1A),
                surfaceTintColor: Colors.white,
                elevation: 20,
                alignment: Alignment.center,
              ),
              timePickerTheme: TimePickerThemeData(
                backgroundColor: Colors.white,
                hourMinuteColor: const Color(0xFFFFF5F5),
                hourMinuteTextColor: const Color(0xFFFF0000),
                dialHandColor: const Color(0xFFFF0000),
                dialTextColor: const Color(0xFF1A1A1A),
                dialBackgroundColor: const Color(0xFFF8F9FA),
                entryModeIconColor: const Color(0xFFFF0000),
                dayPeriodTextColor: WidgetStateColor.resolveWith(
                  (states) => states.contains(WidgetState.selected)
                      ? Colors.white
                      : const Color(0xFF6B7280),
                ),
                dayPeriodColor: WidgetStateColor.resolveWith(
                  (states) => states.contains(WidgetState.selected)
                      ? const Color(0xFFFF0000)
                      : const Color(0xFFF3F4F6),
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),
            child: child!,
          ),
        );
      },
    );

    if (picked != null) {
      setState(() {
        if (isOpeningTime) {
          _openingTime = picked;
          _openingTimeController.text = _formatTime(picked);
        } else {
          _closingTime = picked;
          _closingTimeController.text = _formatTime(picked);
        }
      });
    }
  }

  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod;
    final minute = time.minute.toString().padLeft(2, '0');
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 8,
                            spreadRadius: 0,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Color(0xFF1A1A1A),
                        size: 20,
                      ),
                    ),
                  ),
                  const Spacer(),
                  const Text(
                    'Add New Spot',
                    style: TextStyle(
                      color: Color(0xFF1A1A1A),
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: _submitForm,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF0000),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Submit',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Form Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Spot Name
                      _buildSectionTitle('Spot Information'),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _nameController,
                        label: 'Spot Name',
                        hint: 'Enter spot name',
                        icon: Icons.store,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Spot name is required';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),

                      // Location
                      _buildTextField(
                        controller: _locationController,
                        label: 'City',
                        hint: 'Enter city name',
                        icon: Icons.location_on,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'City is required';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      _buildTextField(
                        controller: _mapDirectionsController,
                        label: 'Map Directions',
                        hint: 'Tap to select location',
                        icon: Icons.directions,
                        enabled: false,
                        onTap: () {
                          _showMapOptions(context);
                        },
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please select a location on the map';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),

                      // Category
                      _buildDropdownField(),
                      const SizedBox(height: 20),

                      // Description
                      _buildTextField(
                        controller: _descriptionController,
                        label: 'Description (Recommended)',
                        hint: 'Describe your spot...',
                        icon: Icons.description,
                        maxLines: 4,
                      ),
                      const SizedBox(height: 20),
                      // Special Dishes
                      _buildSpecialDishesSection(),
                      const SizedBox(height: 32),

                      // Contact Information
                      _buildSectionTitle('Contact Information'),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTextField(
                              controller: _phoneController,
                              label: 'Phone',
                              hint: '9876543210',
                              icon: Icons.phone,
                              keyboardType: TextInputType.phone,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                                LengthLimitingTextInputFormatter(10),
                              ],
                              validator: (value) {
                                if (value != null &&
                                    value.isNotEmpty &&
                                    value.length != 10) {
                                  return 'Enter 10 digits';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildTextField(
                              controller: _whatsappController,
                              label: 'WhatsApp',
                              hint: '9876543210',
                              icon: FontAwesomeIcons.whatsapp,
                              keyboardType: TextInputType.phone,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                                LengthLimitingTextInputFormatter(10),
                              ],
                              validator: (value) {
                                if (value != null &&
                                    value.isNotEmpty &&
                                    value.length != 10) {
                                  return 'Enter 10 digits';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTextField(
                              controller: _websiteController,
                              label: 'Instagram',
                              hint: '@username',
                              icon: FontAwesomeIcons.instagram,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Opening and Closing Time
                      Row(
                        children: [
                          const Icon(
                            Icons.history_toggle_off_rounded,
                            color: Color(0xFF6B7280),
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Open 24 Hours',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                          const Spacer(),
                          Switch.adaptive(
                            value: _is24Hours,
                            activeColor: const Color(0xFFFF0000),
                            onChanged: (value) {
                              setState(() {
                                _is24Hours = value;
                                if (value) {
                                  _openingTimeController.text = 'Open 24 Hours';
                                  _closingTimeController.text = 'Open 24 Hours';
                                } else {
                                  _openingTimeController.text = _formatTime(
                                    _openingTime,
                                  );
                                  _closingTimeController.text = _formatTime(
                                    _closingTime,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (!_is24Hours)
                        Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => _selectTime(context, true),
                                child: AbsorbPointer(
                                  child: _buildTextField(
                                    controller: _openingTimeController,
                                    label: 'Opening Time',
                                    hint: '9:00 AM',
                                    icon: Icons.access_time,
                                    enabled: false,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => _selectTime(context, false),
                                child: AbsorbPointer(
                                  child: _buildTextField(
                                    controller: _closingTimeController,
                                    label: 'Closing Time',
                                    hint: '9:00 PM',
                                    icon: Icons.access_time,
                                    enabled: false,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      const SizedBox(height: 32),

                      // Features
                      _buildSectionTitle('Features'),
                      const SizedBox(height: 16),
                      _buildFeaturesSection(),
                      const SizedBox(height: 32),

                      // Average Cost
                      _buildSectionTitle('Average Cost'),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF3F4F6)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Row(
                                  children: [
                                    Icon(
                                      Icons.currency_rupee_rounded,
                                      color: Color(0xFF6B7280),
                                      size: 18,
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      'Price per person',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF6B7280),
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(
                                      0xFFFF0000,
                                    ).withOpacity(0.08),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    _getPriceDisplay(_averageCost),
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                activeTrackColor: const Color(0xFFFF0000),
                                inactiveTrackColor: const Color(
                                  0xFFFF0000,
                                ).withOpacity(0.1),
                                thumbColor: const Color(0xFFFF0000),
                                overlayColor: const Color(
                                  0xFFFF0000,
                                ).withOpacity(0.1),
                                valueIndicatorColor: const Color(0xFFFF0000),
                                valueIndicatorTextStyle: const TextStyle(
                                  color: Colors.white,
                                ),
                                trackHeight: 4,
                                thumbShape: const RoundSliderThumbShape(
                                  enabledThumbRadius: 8,
                                ),
                              ),
                              child: Slider(
                                value: _averageCost,
                                min: 0,
                                max: 10000,
                                divisions: 14,
                                label: _getPriceLabel(_averageCost),
                                onChanged: (value) {
                                  // Snap to nearest exact price point
                                  final List<double> pricePoints = [
                                    667,
                                    1334,
                                    2001,
                                    2668,
                                    3335,
                                    4002,
                                    4669,
                                    5336,
                                    6003,
                                    6670,
                                    7337,
                                    8004,
                                    8671,
                                    9338,
                                    10000,
                                  ];

                                  double snappedValue = pricePoints.first;
                                  double minDistance =
                                      (value - pricePoints.first).abs();

                                  for (final point in pricePoints) {
                                    final distance = (value - point).abs();
                                    if (distance < minDistance) {
                                      minDistance = distance;
                                      snappedValue = point;
                                    }
                                  }

                                  // Ensure vibration works
                                  if (snappedValue.toInt() !=
                                      _averageCost.toInt()) {
                                    HapticFeedback.vibrate();
                                    HapticFeedback.heavyImpact();
                                  }

                                  setState(() {
                                    _averageCost = snappedValue;
                                  });
                                },
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  '₹ 0',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                                const Text(
                                  '₹ 10,000',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Images Section
                      Row(
                        children: [
                          Text(
                            'Images',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: _imagesError
                                  ? const Color(0xFFFF0000)
                                  : const Color(0xFF1A1A1A),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            '*',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFFF0000),
                            ),
                          ),
                          if (_imagesError) ...[
                            const SizedBox(width: 8),
                            const Text(
                              'At least 1 image required',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFFFF0000),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildImagesSection(),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: Color(0xFF1A1A1A),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    int maxLines = 1,
    TextInputType? keyboardType,
    bool enabled = true,
    VoidCallback? onTap,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(
          minWidth: 0,
          maxWidth: double.infinity,
        ),
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
        child: TextFormField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          enabled: enabled,
          inputFormatters: inputFormatters,
          validator: validator,
          style: const TextStyle(fontSize: 14, color: Color(0xFF1A1A1A)),
          decoration: InputDecoration(
            labelText: label,
            hintText: hint,
            prefixIcon: Icon(icon, color: const Color(0xFF6B7280)),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 1),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFE5E7EB), width: 1),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFFF0000), width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(
                color: Color(0xFFFF0000),
                width: 1.5,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFFF0000), width: 2),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
            hintStyle: const TextStyle(fontSize: 14, color: Color(0xFF9CA3AF)),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdownField() {
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(minWidth: 0, maxWidth: double.infinity),
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
      child: DropdownButtonFormField<String>(
        initialValue: _selectedCategory,
        style: const TextStyle(fontSize: 14, color: Color(0xFF1A1A1A)),
        decoration: InputDecoration(
          labelText: 'Category',
          prefixIcon: const Icon(Icons.category, color: Color(0xFF6B7280)),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFFFF0000), width: 2),
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
          labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
          hintStyle: const TextStyle(fontSize: 14, color: Color(0xFF9CA3AF)),
        ),
        items: _isLoadingCategories
            ? [
                DropdownMenuItem(
                  value: _selectedCategory,
                  child: const Text('Loading categories...'),
                ),
              ]
            : _dbCategories
                  .map(
                    (category) => DropdownMenuItem(
                      value: category,
                      child: Text(category),
                    ),
                  )
                  .toList(),
        onChanged: (value) {
          setState(() {
            _selectedCategory = value!;
          });
        },
      ),
    );
  }

  Widget _buildFeaturesSection() {
    return Container(
      padding: const EdgeInsets.all(16),
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
            'Select available features:',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _availableFeatures.map((feature) {
              final isSelected = _features.contains(feature);
              return GestureDetector(
                onTap: () {
                  setState(() {
                    if (isSelected) {
                      _features.remove(feature);
                    } else {
                      _features.add(feature);
                    }
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFFFF0000)
                        : const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFFFF0000)
                          : const Color(0xFFE5E7EB),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    feature,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: isSelected
                          ? Colors.white
                          : const Color(0xFF6B7280),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildImagesSection() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Photos',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF1A1A1A),
                ),
              ),
              Text(
                '${_images.length}/5',
                style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Images grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.0,
            ),
            itemCount: _images.length + (_images.length < 5 ? 1 : 0),
            itemBuilder: (context, index) {
              if (index < _images.length) {
                // Show existing image
                return Container(
                  width: double.infinity,
                  height: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFFE5E7EB),
                      width: 1,
                    ),
                  ),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          File(_images[index]),
                          fit: BoxFit.cover,
                          width: double.infinity,
                          height: double.infinity,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: double.infinity,
                              height: double.infinity,
                              color: const Color(0xFFF3F4F6),
                              child: const Icon(
                                Icons.broken_image,
                                color: Color(0xFF9CA3AF),
                                size: 24,
                              ),
                            );
                          },
                        ),
                      ),
                      Positioned(
                        top: 4,
                        right: 4,
                        child: GestureDetector(
                          onTap: () => _removeImage(index),
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.6),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.close,
                              color: Colors.white,
                              size: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              } else {
                // Show add image button
                return GestureDetector(
                  onTap: _showImagePickerOptions,
                  child: Container(
                    width: double.infinity,
                    height: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: const Color(0xFFE5E7EB),
                        width: 2,
                        style: BorderStyle.solid,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.add_photo_alternate,
                          size: 24,
                          color: _images.length < 5
                              ? const Color(0xFF9CA3AF)
                              : const Color(0xFFD1D5DB),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _images.length < 5 ? 'Add Photo' : 'Max 5',
                          style: TextStyle(
                            fontSize: 10,
                            color: _images.length < 5
                                ? const Color(0xFF9CA3AF)
                                : const Color(0xFFD1D5DB),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialDishesSection() {
    return Container(
      padding: const EdgeInsets.all(16),
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
          Row(
            children: [
              const Icon(
                Icons.restaurant_menu,
                color: Color(0xFF1A1A1A),
                size: 20,
              ),
              const SizedBox(width: 8),
              const Text(
                'Special Dishes',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1A1A1A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._specialDishes.asMap().entries.map((entry) {
            int index = entry.key;
            String dish = entry.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        dish,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF1A1A1A),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _specialDishes.removeAt(index);
                        });
                      },
                      child: const Icon(
                        Icons.close,
                        color: Color(0xFFEF4444),
                        size: 18,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () {
              // Show dialog to add new dish
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (BuildContext context) {
                  TextEditingController dishController =
                      TextEditingController();
                  return Dialog(
                    backgroundColor: Colors.transparent,
                    insetPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 24,
                    ),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 400),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Header
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(20),
                              decoration: const BoxDecoration(
                                color: Color(0xFFFF0000),
                                borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(20),
                                  topRight: Radius.circular(20),
                                ),
                              ),
                              child: const Text(
                                'Add Special Dish',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),

                            // Content
                            Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.restaurant_menu,
                                    size: 48,
                                    color: const Color(0xFFFF0000),
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'Add a special dish to showcase',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Color(0xFF1A1A1A),
                                      height: 1.4,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                  const SizedBox(height: 24),
                                  TextField(
                                    controller: dishController,
                                    decoration: InputDecoration(
                                      hintText: 'Enter dish name',
                                      hintStyle: const TextStyle(
                                        color: Color(0xFF6B7280),
                                        fontSize: 14,
                                      ),
                                      prefixIcon: const Icon(
                                        Icons.restaurant,
                                        color: Color(0xFF6B7280),
                                        size: 20,
                                      ),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(
                                          color: Color(0xFFE5E7EB),
                                          width: 1,
                                        ),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(
                                          color: Color(0xFFE5E7EB),
                                          width: 1,
                                        ),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(
                                          color: Color(0xFFFF0000),
                                          width: 2,
                                        ),
                                      ),
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                            horizontal: 16,
                                            vertical: 12,
                                          ),
                                    ),
                                    autofocus: true,
                                  ),
                                ],
                              ),
                            ),

                            // Buttons
                            Padding(
                              padding: const EdgeInsets.all(20),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  // Cancel Button
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () => Navigator.of(context).pop(),
                                      child: Container(
                                        width: double.infinity,
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 12,
                                        ),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF3F4F6),
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                          border: Border.all(
                                            color: const Color(0xFFE5E7EB),
                                            width: 1,
                                          ),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Cancel',
                                            style: TextStyle(
                                              color: Color(0xFF6B7280),
                                              fontSize: 14,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  // Add Button
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () {
                                        if (dishController.text.isNotEmpty) {
                                          setState(() {
                                            _specialDishes.add(
                                              dishController.text,
                                            );
                                          });
                                          Navigator.of(context).pop();
                                        }
                                      },
                                      child: Container(
                                        width: double.infinity,
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 12,
                                        ),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFF0000),
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color(
                                                0xFFFF0000,
                                              ).withOpacity(0.3),
                                              blurRadius: 8,
                                              offset: const Offset(0, 2),
                                            ),
                                          ],
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Add',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFFF0000),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add, color: Colors.white, size: 18),
                  SizedBox(width: 4),
                  Text(
                    'Add Dish',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showMapOptions(BuildContext context) {
    // Capture widget's context before showing bottom sheet
    final widgetContext = context;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext bottomSheetContext) {
        return Container(
          padding: const EdgeInsets.only(
            left: 0,
            right: 0,
            top: 0,
            bottom: 140,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 20),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Map Options',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1A1A1A),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Get Location Option
                    GestureDetector(
                      onTap: () async {
                        Navigator.of(bottomSheetContext).pop();
                        // _getCurrentLocation uses this.context (widget's context) which is safe
                        await _getCurrentLocation();
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          children: [
                            Icon(
                              Icons.my_location,
                              color: Color(0xFFFF0000),
                              size: 24,
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                'Get Current Location',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                            ),
                            Icon(
                              Icons.arrow_forward_ios,
                              color: Color(0xFF9CA3AF),
                              size: 16,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Select from Map Option
                    GestureDetector(
                      onTap: () async {
                        Navigator.of(bottomSheetContext).pop();

                        final result = await Navigator.of(widgetContext).push(
                          MaterialPageRoute(
                            builder: (context) => const MapSelectionPage(),
                          ),
                        );

                        // Check if widget is still mounted before using context
                        if (!context.mounted) return;

                        if (result != null && result is Map<String, double>) {
                          setState(() {
                            _latitude = result['latitude'];
                            _longitude = result['longitude'];
                          });
                          String locationText =
                              'Lat: ${_latitude!.toStringAsFixed(6)}, Lng: ${_longitude!.toStringAsFixed(6)}';
                          _mapDirectionsController.text = locationText;
                          _mapDirectionsController.clearComposing();

                          NotificationService.show(
                            message: 'Location selected from map!',
                            type: NotificationType.success,
                          );
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.map, color: Color(0xFFFF0000), size: 24),
                            SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                'Select from Map',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF1A1A1A),
                                ),
                              ),
                            ),
                            Icon(
                              Icons.arrow_forward_ios,
                              color: Color(0xFF9CA3AF),
                              size: 16,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickImage() async {
    if (_images.length >= 5) {
      NotificationService.show(
        message: 'Maximum 5 images allowed',
        type: NotificationType.error,
      );
      return;
    }

    try {
      // Try to request camera permission, but don't fail if it doesn't work
      bool hasPermission = await _permissionService
          .requestCameraPermissionWithCallback(context);
      if (!hasPermission) {
        // Still try to open camera - Android will handle permission request
      }

      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70,
      );

      if (image != null && mounted) {
        setState(() {
          _images.add(image.path);
        });
      }
    } catch (e) {
      if (mounted) {
        NotificationService.show(
          message: 'Camera not available. Please try gallery instead.',
          type: NotificationType.error,
        );
      }
    }
  }

  Future<void> _pickImageFromGallery() async {
    if (_images.length >= 5) {
      NotificationService.show(
        message: 'Maximum 5 images allowed',
        type: NotificationType.error,
      );
      return;
    }

    try {
      final List<XFile> selectedImages = await _imagePicker.pickMultiImage(
        imageQuality: 70,
      );

      if (selectedImages.isNotEmpty && mounted) {
        setState(() {
          for (var image in selectedImages) {
            if (_images.length < 5) {
              _images.add(image.path);
            } else {
              NotificationService.show(
                message: 'Only the first 5 images were added',
                type: NotificationType.warning,
              );
              break;
            }
          }
        });
      }
    } catch (e) {
      if (mounted) {
        NotificationService.show(
          message: 'Error picking images: $e',
          type: NotificationType.error,
        );
      }
    }
  }

  void _removeImage(int index) {
    setState(() {
      _images.removeAt(index);
    });
  }

  void _showImagePickerOptions() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          padding: const EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: 140,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Add Photo',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1A1A1A),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.of(context).pop();
                        _pickImage();
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.camera_alt,
                              size: 32,
                              color: Color(0xFFFF0000),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Camera',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF1A1A1A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.of(context).pop();
                        _pickImageFromGallery();
                      },
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.photo_library,
                              size: 32,
                              color: Color(0xFFFF0000),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Gallery',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF1A1A1A),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  Future<void> _getCurrentLocation() async {
    try {
      // Show loading indicator
      NotificationService.show(
        message: 'Getting current location...',
        type: NotificationType.info,
      );

      // Use PermissionService to request location permission
      bool hasPermission = await _permissionService
          .requestLocationPermissionWithCallback(context);
      if (!hasPermission) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).clearSnackBars();
        NotificationService.show(
          message: 'Location permission is required to get current location.',
          type: NotificationType.error,
        );
        return;
      }

      // Get current location
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      if (mounted) {
        setState(() {
          _latitude = position.latitude;
          _longitude = position.longitude;
          _mapDirectionsController.text =
              'Lat: ${_latitude!.toStringAsFixed(6)}, Lng: ${_longitude!.toStringAsFixed(6)}';
        });
        ScaffoldMessenger.of(context).clearSnackBars();
        NotificationService.show(
          message: 'Location obtained!',
          type: NotificationType.success,
        );
      }
    } catch (e) {
      if (mounted) {
        String errorMessage = 'Error getting location: $e';
        if (e.toString().contains('MissingPluginException')) {
          errorMessage =
              'Location services not available. Please ensure GPS is enabled and location permissions are granted.';
        }
        NotificationService.show(
          message: errorMessage,
          type: NotificationType.error,
        );
      }
    }
  }

  Future<void> _submitForm() async {
    setState(() => _imagesError = false);

    if (!_formKey.currentState!.validate()) return;

    if (_images.isEmpty) {
      setState(() => _imagesError = true);
      NotificationService.show(
        message: 'Please add at least one image',
        type: NotificationType.error,
      );
      return;
    }

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: FoodLoading(size: 80)),
    );

    try {
      final List<String> imageUrls = [];

      // 1. Upload images
      for (int i = 0; i < _images.length; i++) {
        final file = File(_images[i]);
        final String fileName =
            '${DateTime.now().millisecondsSinceEpoch}_$i.jpg';
        final String path = '$fileName'; // Simplified path in the bucket

        await SupabaseConfig.client.storage.from('spots').upload(path, file);

        final String publicUrl = SupabaseConfig.client.storage
            .from('spots')
            .getPublicUrl(path);

        imageUrls.add(publicUrl);
      }

      // 2. Prepare data
      final Map<String, dynamic> spotData = {
        'name': _nameController.text.trim(),
        'description': _descriptionController.text.trim(),
        'city': _locationController.text.trim(),
        'category': _selectedCategory,
        'phone': _phoneController.text.trim(),
        'whatsapp': _whatsappController.text.trim(),
        'instagram': _websiteController.text.trim(), // Added instagram field
        'opening_time': _is24Hours ? '12:00 AM' : _openingTimeController.text,
        'closing_time': _is24Hours ? '11:59 PM' : _closingTimeController.text,
        'is_24_hours': _is24Hours,
        'features': _features,
        'special_dishes': _specialDishes,
        'average_cost': _averageCost.toInt(),
        'images': imageUrls,
        'latitude': _latitude,
        'longitude': _longitude,
        'status': 'pending',
        'created_by': SupabaseConfig.client.auth.currentUser?.id,
      };

      // 3. Insert into DB
      await SupabaseConfig.client.from('spots').insert(spotData);

      if (mounted) {
        Navigator.pop(context); // Close loading dialog
        _showSuccessDialog(context);
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context); // Close loading dialog
        debugPrint('Error submitting spot: $e');
        NotificationService.show(
          message: 'Error submitting spot: $e',
          type: NotificationType.error,
        );
      }
    }
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Custom Success Animation
                TweenAnimationBuilder<double>(
                  duration: const Duration(milliseconds: 600),
                  tween: Tween(begin: 0.0, end: 1.0),
                  builder: (context, value, child) {
                    return Transform.scale(
                      scale: value,
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.check_circle_rounded,
                          color: const Color(0xFF10B981),
                          size: 80 * value,
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                const Text(
                  'Spot Submitted!',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Your spot has been submitted for review. It will be live soon!',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Color(0xFF6B7280)),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Go back from Add Spot
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF0000),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Great!',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
