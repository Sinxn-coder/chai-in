import 'package:flutter/material.dart';

class ConstructionPage extends StatelessWidget {
  const ConstructionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image.asset(
          'assets/images/construction.png',
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}
