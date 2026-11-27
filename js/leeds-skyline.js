/* ============================================================
   Real 3D Leeds, UK Skyline Controller
   - Renders real Leeds city-centre 3D building footprints & heights
     via MapLibre GL + OpenFreeMap vector tiles (no API key required)
   - Fixed camera position (center locked to Leeds; pan & zoom disabled)
   - Rotation-only drag/swipe angle control (bearing & pitch)
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.LeedsSkyline = (function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LEEDS_CENTER = [-1.5491, 53.8008];
    const FIXED_ZOOM = 15.2;

    let map = null;
    let container = null;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let bearing = -28;
    let pitch = 62;

    function add3DBuildings() {
        if (!map || !map.getStyle()) return;
        const layers = map.getStyle().layers || [];
        let labelLayerId = null;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        if (!map.getSource('openmaptiles')) return;
        if (map.getLayer('leeds-3d-buildings')) return;

        map.addLayer(
            {
                id: 'leeds-3d-buildings',
                source: 'openmaptiles',
                'source-layer': 'building',
                type: 'fill-extrusion',
                minzoom: 13,
                paint: {
                    'fill-extrusion-color': [
                        'interpolate',
                        ['linear'],
                        ['coalesce', ['get', 'render_height'], 12],
                        0, '#E5E7EB',
                        28, '#D1D5DB',
                        55, '#374151',
                        85, '#C8102E'
                    ],
                    'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 12],
                    'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                    'fill-extrusion-opacity': 0.92
                }
            },
            labelLayerId || undefined
        );
    }

    function bindRotationOnly() {
        container.addEventListener('pointerdown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            if (container.setPointerCapture) {
                container.setPointerCapture(e.pointerId);
            }
            e.stopPropagation();
        });

        container.addEventListener('pointermove', (e) => {
            if (!isDragging || !map) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

            bearing = (bearing + dx * 0.45) % 360;
            pitch = Math.max(32, Math.min(72, pitch - dy * 0.28));

            map.jumpTo({
                center: LEEDS_CENTER,
                zoom: FIXED_ZOOM,
                bearing,
                pitch
            });
            e.stopPropagation();
        });

        const endDrag = () => {
            isDragging = false;
        };
        container.addEventListener('pointerup', endDrag);
        container.addEventListener('pointercancel', endDrag);
        container.addEventListener('pointerleave', endDrag);
    }

    function startGentleOrbit() {
        if (prefersReducedMotion) return;
        function tick() {
            if (map && !isDragging) {
                bearing = (bearing + 0.08) % 360;
                map.setBearing(bearing);
            }
            window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
    }

    function init() {
        container = document.getElementById('leedsSkylineContainer');
        if (!container || typeof window.maplibregl === 'undefined') return;

        map = new window.maplibregl.Map({
            container: container,
            style: 'https://tiles.openfreemap.org/styles/positron',
            center: LEEDS_CENTER,
            zoom: FIXED_ZOOM,
            pitch: pitch,
            bearing: bearing,
            antialias: true,
            interactive: false,
            attributionControl: true
        });

        map.on('load', () => {
            add3DBuildings();
            bindRotationOnly();
            startGentleOrbit();
        });

        window.addEventListener('resize', () => {
            if (map) map.resize();
        });
    }

    return { init };
})();
