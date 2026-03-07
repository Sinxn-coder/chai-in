import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'services/notification_service.dart';
import 'package:http/http.dart' as http;
import 'package:dio/dio.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';
import 'package:dio_cache_interceptor_file_store/dio_cache_interceptor_file_store.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:convert';
import 'dart:ui' as ui;

class MapSelectionPage extends StatefulWidget {
  const MapSelectionPage({super.key});

  @override
  State<MapSelectionPage> createState() => _MapSelectionPageState();
}

class _MapSelectionPageState extends State<MapSelectionPage> {
  LatLng? _selectedLocation;
  final MapController _mapController = MapController();
  bool _isSatelliteView = false;
  final TextEditingController _searchController = TextEditingController();
  Dio? _dio;

  // Default location (center of Kerala, India)
  final LatLng _defaultLocation = const LatLng(10.8505, 76.2711);

  @override
  void initState() {
    super.initState();
    _initDio();
  }

  Future<void> _initDio() async {
    final tempDir = await getTemporaryDirectory();
    final cachePath = '${tempDir.path}/map_tile_cache';

    final options = CacheOptions(
      store: FileCacheStore(cachePath),
      policy: CachePolicy.forceCache,
      hitCacheOnErrorExcept: [401, 403],
      maxStale: const Duration(days: 30),
      priority: CachePriority.high,
    );

    setState(() {
      _dio = Dio()..interceptors.add(DioCacheInterceptor(options: options));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Select Location',
          style: TextStyle(
            color: Color(0xFF1A1A1A),
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          TextButton(
            onPressed: _selectedLocation != null
                ? () {
                    Navigator.of(context).pop({
                      'latitude': _selectedLocation!.latitude,
                      'longitude': _selectedLocation!.longitude,
                    });
                  }
                : null,
            child: const Text(
              'Done',
              style: TextStyle(
                color: Color(0xFFFF0000),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Map Container
            Expanded(
              child: Stack(
                children: [
                  FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: _defaultLocation,
                      initialZoom: 13.0,
                      onTap: (tapPosition, point) {
                        setState(() {
                          _selectedLocation = point;
                        });
                      },
                    ),
                    children: [
                      if (_dio != null)
                        TileLayer(
                          urlTemplate: _isSatelliteView
                              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                              : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                          subdomains: const ['a', 'b', 'c', 'd'],
                          userAgentPackageName: 'com.example.bytspot',
                          // Optimizations for low network
                          keepBuffer:
                              5, // Increased buffer for smoother panning
                          panBuffer: 2, // Increased buffer for smoother panning
                          tileDisplay: const TileDisplay.fadeIn(
                            duration: Duration(milliseconds: 300),
                          ),
                          tileProvider: DioTileProvider(dio: _dio!),
                        ),
                      // Simple draggable marker
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: _selectedLocation ?? _defaultLocation,
                            width: 50,
                            height: 50,
                            child: GestureDetector(
                              onTap: () {
                                // Allow repositioning by tapping
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFF0000),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white,
                                    width: 3,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.3),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.location_on,
                                  color: Colors.white,
                                  size: 24,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  // Search Bar
                  Positioned(
                    top: 16,
                    left: 16,
                    right: 80, // Leave space for satellite toggle
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Search location...',
                          hintStyle: const TextStyle(
                            color: Color(0xFF9CA3AF),
                            fontSize: 14,
                          ),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: Color(0xFF6B7280),
                            size: 20,
                          ),
                          suffixIcon: IconButton(
                            icon: const Icon(
                              Icons.clear,
                              color: Color(0xFF6B7280),
                              size: 20,
                            ),
                            onPressed: () {
                              _searchController.clear();
                            },
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        onSubmitted: (value) {
                          if (value.isNotEmpty) {
                            _searchLocation(value);
                          }
                        },
                      ),
                    ),
                  ),
                  // Floating Satellite View Toggle
                  Positioned(
                    top: 16,
                    right: 16,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Satellite Toggle Button
                          Container(
                            decoration: BoxDecoration(
                              color: _isSatelliteView
                                  ? const Color(0xFFFF0000)
                                  : Colors.transparent,
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(12),
                                topRight: Radius.circular(12),
                              ),
                            ),
                            child: IconButton(
                              icon: Icon(
                                _isSatelliteView ? Icons.map : Icons.satellite,
                                color: _isSatelliteView
                                    ? Colors.white
                                    : const Color(0xFF1A1A1A),
                                size: 22,
                              ),
                              onPressed: () {
                                setState(() {
                                  _isSatelliteView = !_isSatelliteView;
                                });
                              },
                              tooltip: _isSatelliteView
                                  ? 'Switch to Map View'
                                  : 'Switch to Satellite View',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Bottom Instructions
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Tap on the map to select location',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (_selectedLocation != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.location_on,
                            color: Color(0xFFFF0000),
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Selected: ${_selectedLocation!.latitude.toStringAsFixed(6)}, ${_selectedLocation!.longitude.toStringAsFixed(6)}',
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ),
                        ],
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

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _searchLocation(String query) async {
    if (query.isEmpty) return;

    // Show loading indicator
    if (mounted) {
      NotificationService.show(
        message: 'Searching location...',
        type: NotificationType.info,
      );
    }

    try {
      // Use Nominatim API for geocoding (OpenStreetMap)
      final String url =
          'https://nominatim.openstreetmap.org/search?format=json&q=${Uri.encodeComponent(query)}&limit=1';

      final response = await http.get(
        Uri.parse(url),
        headers: {'User-Agent': 'bytspot/1.0'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        if (data.isNotEmpty) {
          final result = data[0];
          final double lat = double.parse(result['lat']);
          final double lon = double.parse(result['lon']);
          final LatLng foundLocation = LatLng(lat, lon);

          // Center map on found location
          _mapController.move(foundLocation, 15.0);

          // Select this location
          setState(() {
            _selectedLocation = foundLocation;
          });

          if (mounted) {
            ScaffoldMessenger.of(context).clearSnackBars();
            NotificationService.show(
              message: 'Found: ${result['display_name']}',
              type: NotificationType.success,
            );
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).clearSnackBars();
            NotificationService.show(
              message: 'Location not found: $query',
              type: NotificationType.error,
            );
          }
        }
      } else {
        throw Exception('Failed to search location: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).clearSnackBars();
        NotificationService.show(
          message: 'Error searching location: $e',
          type: NotificationType.error,
        );
      }
    }
  }
}

class DioTileProvider extends TileProvider {
  final Dio dio;
  DioTileProvider({required this.dio});

  @override
  ImageProvider getImage(TileCoordinates coordinates, TileLayer options) {
    return DioImageProvider(getTileUrl(coordinates, options), dio);
  }
}

class DioImageProvider extends ImageProvider<DioImageProvider> {
  final String url;
  final Dio dio;

  DioImageProvider(this.url, this.dio);

  @override
  Future<DioImageProvider> obtainKey(ImageConfiguration configuration) {
    return SynchronousFuture<DioImageProvider>(this);
  }

  @override
  ImageStreamCompleter loadImage(
    DioImageProvider key,
    ImageDecoderCallback decode,
  ) {
    return OneFrameImageStreamCompleter(_loadAsync(key, decode));
  }

  Future<ImageInfo> _loadAsync(
    DioImageProvider key,
    ImageDecoderCallback decode,
  ) async {
    try {
      final response = await dio.get(
        url,
        options: Options(responseType: ResponseType.bytes),
      );
      final bytes = response.data as List<int>;
      final ui.Codec codec = await decode(
        await ui.ImmutableBuffer.fromUint8List(Uint8List.fromList(bytes)),
      );
      final ui.FrameInfo frameInfo = await codec.getNextFrame();
      return ImageInfo(image: frameInfo.image);
    } catch (e) {
      rethrow;
    }
  }

  @override
  bool operator ==(Object other) =>
      other is DioImageProvider && url == other.url;

  @override
  int get hashCode => url.hashCode;
}
