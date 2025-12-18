import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin as MapPinIcon, Loader, Locate, Search, Layers, Edit3 } from 'lucide-react';

const MapPicker = ({ isOpen, onClose, onSelectLocation, initialCenter = [11.2588, 75.7804] }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isSatellite, setIsSatellite] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    // Initial load of resources
    useEffect(() => {
        if (!isOpen) return;

        const loadLeaflet = () => {
            // Check if Leaflet is already loaded globally
            if (window.L) {
                setIsMapReady(true);
                return;
            }

            // Check if script is already present but not loaded yet
            if (document.getElementById('leaflet-script')) {
                const existingScript = document.getElementById('leaflet-script');
                existingScript.addEventListener('load', () => setIsMapReady(true));
                return;
            }

            // Load CSS
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Load JS
            const script = document.createElement('script');
            script.id = 'leaflet-script';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => setIsMapReady(true);
            document.body.appendChild(script);
        };

        loadLeaflet();
    }, [isOpen]);

    // Initialize Map
    useEffect(() => {
        if (!isOpen || !isMapReady || !mapContainerRef.current) return;

        // Cleanup existing map if initialization runs again
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        try {
            // Add Tile Layers
            const streets = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });

            const satellite = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
            });

            if (isSatellite) {
                satellite.addTo(map);
            } else {
                streets.addTo(map);
            }

            tileLayerRef.current = streets;
            satelliteLayerRef.current = satellite;

            // Add Marker
            const marker = window.L.marker(initialCenter, {
                draggable: true,
                icon: window.L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(map);
            markerRef.current = marker;

            marker.bindPopup('Drag me to select location!').openPopup();

            // Events
            marker.on('dragend', function (e) {
                const position = e.target.getLatLng();
                setSelectedLocation({ lat: position.lat, lng: position.lng });
            });

            map.on('click', function (e) {
                marker.setLatLng(e.latlng);
                setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            });

            // Locate control (manual implementation for simplicity)
            const locateControl = window.L.Control.extend({
                options: { position: 'bottomright' },
                onAdd: function (map) {
                    const btn = window.L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
                    btn.innerHTML = '📍';
                    btn.style.backgroundColor = 'white';
                    btn.style.width = '30px';
                    btn.style.height = '30px';
                    btn.style.cursor = 'pointer';
                    btn.style.border = '2px solid rgba(0,0,0,0.2)';
                    btn.style.borderRadius = '4px';
                    btn.title = "Locate Me";

                    btn.onclick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        map.locate({ setView: true, maxZoom: 16 });
                    }
                    return btn;
                }
            });
            map.addControl(new locateControl());

            map.on('locationfound', function (e) {
                marker.setLatLng(e.latlng);
                setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
            });

            // Trigger resize to ensure tiles load correctly
            setTimeout(() => {
                map.invalidateSize();
            }, 200);

            // Set initial selection
            setSelectedLocation({ lat: initialCenter[0], lng: initialCenter[1] });

        } catch (error) {
            console.error("Map initialization error:", error);
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isOpen, isMapReady]); // Removed initialCenter from deps to prevent re-init loop

    const toggleSatellite = () => {
        if (!mapInstanceRef.current || !tileLayerRef.current || !satelliteLayerRef.current) return;
        const map = mapInstanceRef.current;
        if (isSatellite) {
            map.removeLayer(satelliteLayerRef.current);
            tileLayerRef.current.addTo(map);
        } else {
            map.removeLayer(tileLayerRef.current);
            satelliteLayerRef.current.addTo(map);
        }
        setIsSatellite(!isSatellite);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim() || searching) return;
        setSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newCenter = [parseFloat(lat), parseFloat(lon)];
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView(newCenter, 16);
                    markerRef.current.setLatLng(newCenter);
                    setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                }
            } else {
                alert("Location not found.");
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation.lat, selectedLocation.lng);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'white',
                    zIndex: 10
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1a1a1a' }}>
                            📍 Select Location
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                            Drag pin or click map to pinpoint spot
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f5f5f5',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#666',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ padding: '0.8rem 1rem', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search location (e.g. Kozhikode)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{
                                width: '100%', padding: '10px 12px 10px 40px',
                                border: '1px solid #e2e8f0', borderRadius: '10px',
                                fontSize: '0.9rem'
                            }}
                        />
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={searching || !searchQuery.trim()}
                        style={{
                            padding: '8px 16px', background: 'var(--primary)', color: 'white',
                            border: 'none', borderRadius: '10px', fontWeight: '600',
                            fontSize: '0.85rem', cursor: 'pointer', opacity: searching ? 0.6 : 1
                        }}
                    >
                        {searching ? '...' : 'Search'}
                    </button>
                </div>

                {/* Map Container */}
                <div style={{ flex: 1, position: 'relative' }}>
                    {!isMapReady && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f8fafc',
                            zIndex: 20
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <Loader className="animate-spin" size={32} color="var(--primary)" />
                                <span style={{ color: '#64748b', fontWeight: '500' }}>Loading map resources...</span>
                            </div>
                        </div>
                    )}

                    {/* Satellite Toggle Button */}
                    <button
                        onClick={(e) => { e.preventDefault(); toggleSatellite(); }}
                        style={{
                            position: 'absolute', top: '12px', right: '12px',
                            zIndex: 1000, background: isSatellite ? '#10b981' : 'white',
                            color: isSatellite ? 'white' : '#1e293b',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            padding: '8px 12px', display: 'flex', alignItems: 'center',
                            gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Layers size={16} />
                        {isSatellite ? 'Satellite' : 'Map View'}
                    </button>

                    <div
                        ref={mapContainerRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: '#e2e8f0',
                            touchAction: 'none' // Prevent touch scrolling on mobile while dragging map
                        }}
                    />
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid #eee',
                    background: 'white',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            {selectedLocation ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    color: '#0f172a',
                                    background: '#f1f5f9',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    marginBottom: '12px'
                                }}>
                                    <MapPinIcon size={16} className="text-primary" />
                                    <span>
                                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                                    </span>
                                </div>
                            ) : (
                                <div style={{ height: '36px' }} />
                            )}
                        </div>
                    </div>


                    <button
                        onClick={handleConfirm}
                        disabled={!selectedLocation}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: selectedLocation ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                            color: selectedLocation ? 'white' : '#94a3b8',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: selectedLocation ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            boxShadow: selectedLocation ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapPicker;
