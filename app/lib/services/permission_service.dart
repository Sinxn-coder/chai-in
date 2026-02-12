import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';

class PermissionService {
  static final PermissionService _instance = PermissionService._internal();
  factory PermissionService() => _instance;
  PermissionService._internal();

  // Request all necessary permissions at app startup
  Future<void> requestAllPermissions(BuildContext context) async {
    await _requestLocationPermission(context);
    await _requestCameraPermission(context);
  }

  // Request location permission
  Future<bool> _requestLocationPermission(BuildContext context) async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _showPermissionDialog(
          context,
          'Location Services Disabled',
          'Please enable location services to use this feature. Go to Settings and enable location.',
          () async {
            await Geolocator.openLocationSettings();
          },
        );
        return false;
      }

      // Check location permissions
      LocationPermission permission = await Geolocator.checkPermission();

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showPermissionDialog(
            context,
            'Location Permission Required',
            'This app needs location permission to show nearby food spots. Please grant permission.',
            () async {
              await Geolocator.openAppSettings();
            },
          );
          return false;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _showPermissionDialog(
          context,
          'Location Permission Required',
          'Location permission is permanently denied. Please enable it in app settings.',
          () async {
            await Geolocator.openAppSettings();
          },
        );
        return false;
      }

      return true;
    } catch (e) {
      print('Error requesting location permission: $e');
      return false;
    }
  }

  // Request camera permission
  Future<bool> _requestCameraPermission(BuildContext context) async {
    try {
      PermissionStatus status = await Permission.camera.status;

      if (status.isDenied) {
        status = await Permission.camera.request();
        if (status.isDenied) {
          _showPermissionDialog(
            context,
            'Camera Permission Required',
            'This app needs camera permission to add photos of food spots. Please grant permission.',
            () async {
              await openAppSettings();
            },
          );
          return false;
        }
      }

      if (status.isPermanentlyDenied) {
        _showPermissionDialog(
          context,
          'Camera Permission Required',
          'Camera permission is permanently denied. Please enable it in app settings.',
          () async {
            await openAppSettings();
          },
        );
        return false;
      }

      return true;
    } catch (e) {
      print('Error requesting camera permission: $e');
      // Fallback: try to use image picker without permission check
      return true;
    }
  }

  // Check if location permission is granted
  Future<bool> isLocationPermissionGranted() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      return permission == LocationPermission.always ||
          permission == LocationPermission.whileInUse;
    } catch (e) {
      print('Error checking location permission: $e');
      return false;
    }
  }

  // Check if camera permission is granted
  Future<bool> isCameraPermissionGranted() async {
    try {
      PermissionStatus status = await Permission.camera.status;
      return status.isGranted;
    } catch (e) {
      print('Error checking camera permission: $e');
      return false;
    }
  }

  // Show permission dialog
  void _showPermissionDialog(
    BuildContext context,
    String title,
    String message,
    VoidCallback onSettingsPressed,
  ) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1A1A1A),
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            message,
            style: const TextStyle(color: Color(0xFF6B7280), fontSize: 14),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text(
                'Cancel',
                style: TextStyle(color: Color(0xFF6B7280), fontSize: 14),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                onSettingsPressed();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF0000),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                'Settings',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        );
      },
    );
  }

  // Request location permission with callback
  Future<bool> requestLocationPermissionWithCallback(
    BuildContext context,
  ) async {
    return await _requestLocationPermission(context);
  }

  // Request camera permission with callback
  Future<bool> requestCameraPermissionWithCallback(BuildContext context) async {
    return await _requestCameraPermission(context);
  }
}
