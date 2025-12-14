import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin as MapPinIcon, Loader, Locate } from 'lucide-react';

const MapPicker = ({ isOpen, onClose, onSelectLocation, initialCenter = [11.2588, 75.7804] }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const mapInstanceRef = useRef(null);
    const mapContainerRef = useRef(null);
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
            // Initialize Map
            const map = window.L.map(mapContainerRef.current).setView(initialCenter, 13);
            mapInstanceRef.current = map;

            // Add Tile Layer
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

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
