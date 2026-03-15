import 'package:flutter/material.dart';
import 'home.dart';
import 'explore.dart';
import 'favorites.dart';
import 'community.dart';
import 'widgets/custom_nav_bar.dart';
import 'services/notification_service.dart';
import 'supabase_config.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'services/connectivity_service.dart';
import 'services/usage_service.dart';

class MainContainer extends StatefulWidget {
  const MainContainer({super.key});

  @override
  State<MainContainer> createState() => _MainContainerState();
}

class _MainContainerState extends State<MainContainer> with WidgetsBindingObserver {
  int _currentIndex = 0;
  RealtimeChannel? _notificationChannel;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _setupRealtimeNotifications();
    UsageService().startTracking();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      UsageService().startTracking();
    } else if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      UsageService().stopTracking();
    }
  }

  void _setupRealtimeNotifications() {
    final userId = SupabaseConfig.currentUserId;
    if (userId == null) return;

    _notificationChannel = SupabaseConfig.client
        .channel('public:notifications')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'notifications',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'user_id',
            value: userId,
          ),
          callback: (payload) {
            debugPrint('New notification received: ${payload.newRecord}');
            final String title = payload.newRecord['title'] ?? 'New Notification';
            final String message = payload.newRecord['message'] ?? '';
            
            // Show in-app notification popup
            NotificationService.show(
              message: '$title: $message',
              type: NotificationType.info,
              duration: const Duration(seconds: 5),
            );
          },
        )
        .subscribe();
  }

  @override
  void dispose() {
    if (_notificationChannel != null) {
      SupabaseConfig.client.removeChannel(_notificationChannel!);
    }
    WidgetsBinding.instance.removeObserver(this);
    UsageService().stopTracking();
    super.dispose();
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      const HomePageContent(),
      ExplorePageContent(isActive: _currentIndex == 1),
      FavoritesPage(
        isActive: _currentIndex == 2,
        onExploreRequested: () => _onTabTapped(1),
      ),
      const CommunityPage(),
    ];

    return Scaffold(
      extendBody: true,
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          IndexedStack(index: _currentIndex, children: pages),
          
          // Connectivity Banner
          ValueListenableBuilder<bool>(
            valueListenable: ConnectivityService().isConnected,
            builder: (context, isConnected, child) {
              if (isConnected) return const SizedBox.shrink();
              
              return Positioned(
                top: MediaQuery.of(context).padding.top,
                left: 0,
                right: 0,
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF0000).withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.wifi_off_rounded, color: Colors.white, size: 20),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'No Internet Connection',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
