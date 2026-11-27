/* ============================================================
   Horizontal Viewport Navigation Controller (Desktop & Mobile)
   Supports: Touch Swipe, Mouse Wheel, Keyboard, Arrows, Drag, Navbar & Dots
   Includes: Isolated Mobile Horizontal Carousel for #projects
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.HorizontalScroll = (function () {
    const MOBILE_BREAKPOINT = 960;
    let viewport = null;
    let panels = [];
    let navLinks = [];
    let dots = [];
    let prevBtns = [];
    let nextBtns = [];
    let counterEl = null;
    let currentIndex = 0;
    let wheelLock = false;

    function isMobileViewport() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function getPanelWidth() {
        return viewport ? viewport.clientWidth : window.innerWidth;
    }

    function updateActiveUI(index) {
        currentIndex = Math.max(0, Math.min(index, panels.length - 1));

        panels.forEach((panel, i) => {
            panel.classList.toggle('is-active', i === currentIndex);
        });

        navLinks.forEach((link, i) => {
            link.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });

        prevBtns.forEach((btn) => {
            btn.disabled = currentIndex === 0;
        });

        nextBtns.forEach((btn) => {
            btn.disabled = currentIndex === panels.length - 1;
        });

        if (counterEl) {
            const currentStr = String(currentIndex + 1).padStart(2, '0');
            const totalStr = String(panels.length).padStart(2, '0');
            counterEl.textContent = `${currentStr} / ${totalStr}`;
        }

        if (window.PortfolioApp.Animations && typeof window.PortfolioApp.Animations.onPanelActivate === 'function') {
            window.PortfolioApp.Animations.onPanelActivate(panels[currentIndex]);
        }
    }

    function goToPanel(index) {
        const targetIndex = Math.max(0, Math.min(index, panels.length - 1));
        if (!viewport || !panels[targetIndex]) return;

                viewport.scrollTo({
            left: targetIndex * getPanelWidth(),
            behavior: 'smooth'
        });
        updateActiveUI(targetIndex);
    }

    function goToPanelById(id) {
        const idx = panels.findIndex((p) => p.id === id);
        if (idx !== -1) {
            goToPanel(idx);
        }
    }

    function handleWheel(e) {
        const modal = document.getElementById('projectModal');
        if (modal && modal.classList.contains('is-open')) return;

        if (e.target.closest('.skyline-canvas-wrap')) return;

        // Keep main panel static when scrolling inside mobile projects horizontal track
        if (isMobileViewport() && e.target.closest('#projects .projects-grid')) {
            return;
        }

        // Allow internal vertical scroll inside a panel when its content overflows vertically
        const activePanel = panels[currentIndex];
        if (activePanel) {
            const canScrollDown = activePanel.scrollTop + activePanel.clientHeight < activePanel.scrollHeight - 2;
            const canScrollUp = activePanel.scrollTop > 2;
            if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
                return;
            }
        }

        const primaryDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (Math.abs(primaryDelta) < 8) return;

        e.preventDefault();
        if (wheelLock) return;

        wheelLock = true;
        if (primaryDelta > 0) {
            goToPanel(currentIndex + 1);
        } else {
            goToPanel(currentIndex - 1);
        }

        setTimeout(() => {
            wheelLock = false;
        }, 420);
    }

    function handleKeydown(e) {
        const modal = document.getElementById('projectModal');
        if (modal && modal.classList.contains('is-open')) return;

        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            e.preventDefault();
            goToPanel(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            goToPanel(currentIndex - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToPanel(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToPanel(panels.length - 1);
        }
    }

    function setupMobileProjectsIsolation() {
        const projectsTrack = document.querySelector('#projects .projects-grid');
        if (!projectsTrack) return;

        // Isolate touch events inside mobile projects track without blocking native horizontal scroll
        projectsTrack.addEventListener('touchstart', (e) => {
            if (isMobileViewport()) e.stopPropagation();
        }, { passive: true });

        projectsTrack.addEventListener('touchmove', (e) => {
            if (isMobileViewport()) e.stopPropagation();
        }, { passive: true });
    }

    function setupScrollSync() {
        let scrollTimeout = null;
        viewport.addEventListener('scroll', () => {
                        clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const width = getPanelWidth();
                if (!width) return;
                const idx = Math.round(viewport.scrollLeft / width);
                if (idx !== currentIndex) {
                    updateActiveUI(idx);
                }
            }, 50);
        }, { passive: true });
    }

    function init() {
        viewport = document.getElementById('horizontalViewport');
        if (!viewport) return;

        panels = Array.from(viewport.querySelectorAll('.panel'));
        navLinks = Array.from(document.querySelectorAll('.nav-link[data-panel]'));
        dots = Array.from(document.querySelectorAll('.panel-dot[data-panel]'));
        prevBtns = Array.from(
            new Set([
                document.getElementById('prevPanelBtn'),
                document.getElementById('mobilePrevBtn'),
                ...document.querySelectorAll('[data-nav="prev"]')
            ].filter(Boolean))
        );
        nextBtns = Array.from(
            new Set([
                document.getElementById('nextPanelBtn'),
                document.getElementById('mobileNextBtn'),
                ...document.querySelectorAll('[data-nav="next"]')
            ].filter(Boolean))
        );
        counterEl = document.getElementById('panelCounter');

        document.querySelectorAll('[data-panel]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-panel');
                goToPanelById(targetId);

                const menu = document.getElementById('navMenu');
                const toggleBtn = document.getElementById('navToggle');
                if (menu) menu.classList.remove('is-open');
                if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        prevBtns.forEach((btn) => {
            btn.addEventListener('click', () => goToPanel(currentIndex - 1));
        });

        nextBtns.forEach((btn) => {
            btn.addEventListener('click', () => goToPanel(currentIndex + 1));
        });

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', () => {
                        viewport.scrollTo({
                left: currentIndex * getPanelWidth(),
                behavior: 'auto'
            });
        });

        setupMobileProjectsIsolation();
        setupScrollSync();
        updateActiveUI(0);
    }

    return {
        init,
        goToPanel,
        goToPanelById
    };
})();
