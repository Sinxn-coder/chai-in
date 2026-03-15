import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

class ConnectivityService {
  static final ConnectivityService _instance = ConnectivityService._internal();
  factory ConnectivityService() => _instance;
  ConnectivityService._internal();

  final Connectivity _connectivity = Connectivity();
  final ValueNotifier<bool> isConnected = ValueNotifier<bool>(true);
  StreamSubscription<List<ConnectivityResult>>? _subscription;

  Future<void> initialize() async {
    // Initial check
    final List<ConnectivityResult> results = await _connectivity.checkConnectivity();
    _updateStatus(results);

    // Listen to changes
    _subscription = _connectivity.onConnectivityChanged.listen(_updateStatus);
  }

  void _updateStatus(List<ConnectivityResult> results) {
    // results is a list of ConnectivityResult (wifi, mobile, etc.)
    // If it only contains 'none', we are offline
    final bool currentlyConnected = results.isNotEmpty && 
        !results.contains(ConnectivityResult.none);
    
    if (isConnected.value != currentlyConnected) {
      isConnected.value = currentlyConnected;
      debugPrint('Connectivity Changed: ${currentlyConnected ? 'Online' : 'Offline'}');
    }
  }

  void dispose() {
    _subscription?.cancel();
  }
}
