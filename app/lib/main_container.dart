import 'package:flutter/material.dart';
import 'home.dart';
import 'explore.dart';
import 'favorites.dart';
import 'community.dart';
import 'widgets/custom_nav_bar.dart';

class MainContainer extends StatefulWidget {
  const MainContainer({super.key});

  @override
  State<MainContainer> createState() => _MainContainerState();
}

class _MainContainerState extends State<MainContainer> {
  int _currentIndex = 0;

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
      body: IndexedStack(index: _currentIndex, children: pages),
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
