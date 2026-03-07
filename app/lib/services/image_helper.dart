import 'package:flutter/material.dart';
import '../supabase_config.dart';

class ImageHelper {
  static Widget loadImage(
    String path, {
    String bucket = 'spots',
    double? width,
    double? height,
    BoxFit fit = BoxFit.cover,
    Widget? placeholder,
    Widget? errorWidget,
  }) {
    // 1. Handle Empty or null paths
    if (path.isEmpty) {
      return errorWidget ?? _buildPlaceholder(width, height);
    }

    // 2. Handle Local Assets (Explicitly starting with assets/)
    if (path.startsWith('assets/')) {
      return Image.asset(
        path,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          debugPrint('Error loading asset image: $path');
          return errorWidget ?? _buildPlaceholder(width, height);
        },
      );
    }

    // 3. Construct the Final URL
    String finalUrl = path;

    if (!path.startsWith('http')) {
      // If it's a relative path, construct the Supabase Public URL
      // Format: https://[PROJECT_ID].supabase.co/storage/v1/object/public/[BUCKET]/[PATH]
      finalUrl = '${SupabaseConfig.url}/storage/v1/object/public/$bucket/$path';
    } else {
      // 4. Robust URL Parsing for internet images (Search Redirects)
      finalUrl = _extractDirectLink(path);
    }

    // 5. Load from Network
    return Image.network(
      finalUrl,
      width: width,
      height: height,
      fit: fit,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return placeholder ??
            Center(
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  value: loadingProgress.expectedTotalBytes != null
                      ? loadingProgress.cumulativeBytesLoaded /
                            loadingProgress.expectedTotalBytes!
                      : null,
                  strokeWidth: 2,
                  color: const Color(0xFFFF0000),
                ),
              ),
            );
      },
      errorBuilder: (context, error, stackTrace) {
        debugPrint('Error loading network image: $finalUrl ($error)');
        return errorWidget ?? _buildPlaceholder(width, height);
      },
    );
  }

  static final Map<String, String> _urlCache = {};

  /// Extracts the direct image link from common search redirects (Yahoo, Google, etc.)
  static String _extractDirectLink(String url) {
    if (_urlCache.containsKey(url)) return _urlCache[url]!;

    try {
      final uri = Uri.parse(url);

      // Check for common image URL parameters in search redirects
      String? directUrl =
          uri.queryParameters['imgurl'] ?? uri.queryParameters['url'];

      if (directUrl != null) {
        // Decode the URL (it might be double encoded in some redirects)
        directUrl = Uri.decodeFull(directUrl);

        // Ensure it has a protocol
        if (!directUrl.startsWith('http')) {
          directUrl = 'https://$directUrl';
        }

        _urlCache[url] = directUrl;
        return directUrl;
      }
    } catch (e) {
      // Silently fail and return original URL
    }
    _urlCache[url] = url;
    return url;
  }

  static Widget _buildPlaceholder(double? width, double? height) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Icon(Icons.image_outlined, color: Colors.grey[400], size: 24),
      ),
    );
  }
}
