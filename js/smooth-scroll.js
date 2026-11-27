/* ============================================================
   Lenis Smooth Scroll Controller
   Coordinates per-panel vertical smooth scrolling with GSAP
   ScrollTrigger without conflicting with horizontal panel
   navigation, mobile project carousels, or modals.
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.SmoothScroll = (function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panelInstances = new Map();
    let tickerBound = false;

    function isAvailable() {
        return !prefersReducedMotion && typeof window.Lenis === 'function';
    }

    function initPanels() {
        if (!isAvailable()) return;

        const panels = document.querySelectorAll('.horizontal-viewport .panel');
        panels.forEach((panel) => {
            const content = panel.querySelector('.panel-inner');
            if (!content) return;

            const lenis = new window.Lenis({
                wrapper: panel,
                content: content,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.95,
                touchMultiplier: 1.2,
                lerp: 0.11,
                prevent: (node) => {
                    // Never hijack scroll inside map iframe, mobile project slider, or open modal
                    if (node.closest('.skyline-canvas-wrap')) return true;
                    if (node.closest('#projects .projects-grid') && window.innerWidth <= 960) return true;
                    if (node.closest('#projectModal')) return true;
                    return false;
                }
            });

            if (typeof window.ScrollTrigger !== 'undefined') {
                lenis.on('scroll', window.ScrollTrigger.update);
            }

            panelInstances.set(panel.id, lenis);
        });

        bindTicker();
    }

    function bindTicker() {
        if (tickerBound || panelInstances.size === 0) return;
        tickerBound = true;

        if (typeof window.gsap !== 'undefined' && window.gsap.ticker) {
            window.gsap.ticker.add((time) => {
                const ms = time * 1000;
                panelInstances.forEach((lenis) => lenis.raf(ms));
            });
            window.gsap.ticker.lagSmoothing(0);
        } else {
            function rafLoop(time) {
                panelInstances.forEach((lenis) => lenis.raf(time));
                window.requestAnimationFrame(rafLoop);
            }
            window.requestAnimationFrame(rafLoop);
        }
    }

    function stop() {
        panelInstances.forEach((lenis) => lenis.stop());
    }

    function start() {
        panelInstances.forEach((lenis) => lenis.start());
    }

    function resize() {
        panelInstances.forEach((lenis) => lenis.resize());
        if (typeof window.ScrollTrigger !== 'undefined') {
            window.ScrollTrigger.refresh();
        }
    }

    function init() {
        initPanels();
        window.addEventListener('resize', resize);
    }

    return {
        init,
        stop,
        start,
        resize
    };
})();
