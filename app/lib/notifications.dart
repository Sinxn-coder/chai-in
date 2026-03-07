import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'services/notification_api_service.dart';
import 'widgets/food_loading.dart';
import 'package:intl/intl.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  bool _isSelectionMode = false;
  final List<String> _selectedNotifications = [];

  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _animationController.forward();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    final data = await NotificationApiService.fetchNotifications();
    if (mounted) {
      setState(() {
        _notifications = data;
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 360;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F9FA),
        elevation: 0,
        leading: Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 8,
                spreadRadius: 0,
              ),
            ],
          ),
          child: IconButton(
            icon: Icon(
              _isSelectionMode ? Icons.close : Icons.arrow_back,
              color: const Color(0xFF1A1A1A),
            ),
            onPressed: () {
              if (_isSelectionMode) {
                setState(() {
                  _isSelectionMode = false;
                  _selectedNotifications.clear();
                });
              } else {
                Navigator.pop(context);
              }
            },
          ),
        ),
        title: FadeTransition(
          opacity: _fadeAnimation,
          child: Text(
            _isSelectionMode
                ? '${_selectedNotifications.length} Selected'
                : 'Notifications',
            style: TextStyle(
              color: const Color(0xFF1A1A1A),
              fontSize: isSmallScreen ? 18 : 20,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.5,
            ),
          ),
        ),
        centerTitle: true,
        actions: [
          if (_isSelectionMode)
            IconButton(
              icon: const Icon(Icons.delete, color: Color(0xFFEF4444)),
              onPressed: _deleteSelected,
            )
          else if (_notifications.any((n) => !(n['is_read'] ?? true)))
            IconButton(
              icon: const Icon(Icons.done_all, color: Color(0xFF3B82F6)),
              onPressed: () async {
                await NotificationApiService.markAllAsRead();
                _loadNotifications();
              },
              tooltip: 'Mark all as read',
            ),
        ],
      ),

      body: FadeTransition(
        opacity: _fadeAnimation,
        child: _isLoading
            ? const Center(child: FoodLoading(size: 60))
            : _notifications.isEmpty
            ? _buildEmptyState(isSmallScreen)
            : RefreshIndicator(
                onRefresh: _loadNotifications,
                color: const Color(0xFFFF0000),
                child: ListView.builder(
                  padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                  itemCount: _notifications.length,
                  itemBuilder: (context, index) {
                    final notification = _notifications[index];
                    final DateTime createdAt = DateTime.parse(
                      notification['created_at'],
                    ).toLocal();

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (index == 0 ||
                            _getDateString(createdAt) !=
                                _getDateString(
                                  DateTime.parse(
                                    _notifications[index - 1]['created_at'],
                                  ).toLocal(),
                                ))
                          _buildDateHeader(
                            _getDateString(createdAt),
                            isSmallScreen,
                          ),
                        _buildNotificationItem(
                          id: notification['id'],
                          type: notification['type'],
                          title: notification['title'] ?? 'Notification',
                          message: notification['message'] ?? '',
                          time: _getTimeAgo(createdAt),
                          isRead: notification['is_read'] ?? true,
                          isSmallScreen: isSmallScreen,
                        ),
                      ],
                    );
                  },
                ),
              ),
      ),
    );
  }

  String _getDateString(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final notificationDate = DateTime(date.year, date.month, date.day);

    if (notificationDate == today) return 'Today';
    if (notificationDate == yesterday) return 'Yesterday';
    return DateFormat('MMMM d, y').format(date);
  }

  String _getTimeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return DateFormat('jm').format(date);
  }

  Widget _buildEmptyState(bool isSmallScreen) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_rounded,
            size: 80,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Text(
            'All caught up!',
            style: TextStyle(
              fontSize: isSmallScreen ? 18 : 20,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'No new notifications for you right now.',
            style: TextStyle(fontSize: 14, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildDateHeader(String date, bool isSmallScreen) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: isSmallScreen ? 12 : 16),
      child: Row(
        children: [
          Expanded(child: Container(height: 1, color: const Color(0xFFE5E7EB))),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: isSmallScreen ? 12 : 16),
            child: Text(
              date,
              style: TextStyle(
                color: const Color(0xFF6B7280),
                fontSize: isSmallScreen ? 12 : 14,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.3,
              ),
            ),
          ),
          Expanded(child: Container(height: 1, color: const Color(0xFFE5E7EB))),
        ],
      ),
    );
  }

  Widget _buildNotificationItem({
    required String id,
    required String type,
    required String title,
    required String message,
    required String time,
    required bool isRead,
    required bool isSmallScreen,
  }) {
    final isSelected = _selectedNotifications.contains(id);

    IconData icon;
    Color iconColor;

    switch (type) {
      case 'like':
        icon = Icons.favorite_rounded;
        iconColor = const Color(0xFFEF4444);
        break;
      case 'comment':
        icon = Icons.chat_rounded;
        iconColor = const Color(0xFF3B82F6);
        break;
      case 'spot_approved':
        icon = Icons.stars_rounded;
        iconColor = const Color(0xFFF59E0B);
        break;
      case 'system':
      default:
        icon = Icons.notifications_rounded;
        iconColor = const Color(0xFF3B82F6);
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isSelected
            ? const Color(0xFFEFF6FF)
            : isRead
            ? const Color(0xFFF9FAFB)
            : const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected
              ? const Color(0xFF3B82F6)
              : isRead
              ? const Color(0xFFE5E7EB)
              : const Color(0xFF3B82F6).withOpacity(0.2),
          width: isSelected ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () async {
            if (_isSelectionMode) {
              _toggleSelection(id);
            } else {
              HapticFeedback.lightImpact();
              if (!isRead) {
                await NotificationApiService.markAsRead(id);
                _loadNotifications();
              }
            }
          },
          onLongPress: () {
            HapticFeedback.mediumImpact();
            setState(() {
              _isSelectionMode = true;
              _selectedNotifications.add(id);
            });
          },
          child: Padding(
            padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
            child: Row(
              children: [
                // Selection Checkbox
                if (_isSelectionMode)
                  Container(
                    width: isSmallScreen ? 20 : 24,
                    height: isSmallScreen ? 20 : 24,
                    margin: EdgeInsets.only(right: isSmallScreen ? 12 : 16),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? const Color(0xFF3B82F6)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFF3B82F6)
                            : const Color(0xFFD1D5DB),
                        width: 2,
                      ),
                    ),
                    child: isSelected
                        ? const Icon(Icons.check, color: Colors.white, size: 16)
                        : null,
                  ),

                // Enhanced Icon Container
                Container(
                  width: isSmallScreen ? 44 : 52,
                  height: isSmallScreen ? 44 : 52,
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: iconColor.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    icon,
                    color: iconColor,
                    size: isSmallScreen ? 22 : 26,
                  ),
                ),

                const SizedBox(width: 16),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: isSmallScreen ? 15 : 16,
                          fontWeight: FontWeight.w600,
                          color: isRead
                              ? const Color(0xFF6B7280)
                              : const Color(0xFF1A1A1A),
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        message,
                        style: TextStyle(
                          fontSize: isSmallScreen ? 13 : 14,
                          color: const Color(0xFF6B7280),
                          height: 1.4,
                          letterSpacing: -0.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.access_time_rounded,
                            color: const Color(0xFF9CA3AF),
                            size: isSmallScreen ? 12 : 14,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            time,
                            style: TextStyle(
                              fontSize: isSmallScreen ? 11 : 12,
                              color: const Color(0xFF9CA3AF),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Unread Indicator
                if (!isRead && !_isSelectionMode)
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: const Color(0xFF3B82F6),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF3B82F6).withOpacity(0.4),
                          blurRadius: 6,
                          spreadRadius: 0,
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _toggleSelection(String id) {
    setState(() {
      if (_selectedNotifications.contains(id)) {
        _selectedNotifications.remove(id);
      } else {
        _selectedNotifications.add(id);
      }
    });
  }

  void _deleteSelected() {
    setState(() {
      _isSelectionMode = false;
      _selectedNotifications.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Selected notifications deleted'),
        backgroundColor: Color(0xFFEF4444),
      ),
    );
  }
}
