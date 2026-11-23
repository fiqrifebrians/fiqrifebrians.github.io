/* ============================================================
   Horizontal Viewport Navigation Controller
   Supports: Wheel, Keyboard, Arrows, Drag/Swipe, Navbar & Dots
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.HorizontalScroll = (function () {
    const MOBILE_BREAKPOINT = 960;
    let viewport = null;
    let panels = [];
    let navLinks = [];
    let dots = [];
    let prevBtn = null;
    let nextBtn = null;
    let counterEl = null;
    let currentIndex = 0;
    let wheelLock = false;

    function isDesktopMode() {
        return window.innerWidth > MOBILE_BREAKPOINT;
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

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === panels.length - 1;

        if (counterEl) {
            const currentStr = String(currentIndex + 1).padStart(2, '0');
            const totalStr = String(panels.length).padStart(2, '0');
            counterEl.textContent = `${currentStr} / ${totalStr}`;
        }
    }

    function goToPanel(index) {
        const targetIndex = Math.max(0, Math.min(index, panels.length - 1));
        const targetPanel = panels[targetIndex];
        if (!targetPanel) return;

        if (isDesktopMode()) {
            viewport.scrollTo({
                left: targetIndex * window.innerWidth,
                behavior: 'smooth'
            });
            updateActiveUI(targetIndex);
        } else {
            targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateActiveUI(targetIndex);
        }
    }

    function goToPanelById(id) {
        const idx = panels.findIndex((p) => p.id === id);
        if (idx !== -1) {
            goToPanel(idx);
        }
    }

    function handleWheel(e) {
        if (!isDesktopMode()) return;

        const modal = document.getElementById('projectModal');
        if (modal && modal.classList.contains('is-open')) return;

        // Allow internal scrolling inside embedded map or tall panels
        if (e.target.closest('.map-iframe')) return;

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
        if (!isDesktopMode()) return;

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

    function setupDragSwipe() {
        let isDown = false;
        let startX = 0;
        let startScrollLeft = 0;

        viewport.addEventListener('mousedown', (e) => {
            if (!isDesktopMode()) return;
            if (e.target.closest('a, button, input, iframe, .modal-dialog')) return;
            isDown = true;
            startX = e.pageX;
            startScrollLeft = viewport.scrollLeft;
            viewport.classList.add('is-dragging');
        });

        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            viewport.classList.remove('is-dragging');
            const nearest = Math.round(viewport.scrollLeft / window.innerWidth);
            goToPanel(nearest);
        });

        viewport.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const walk = (e.pageX - startX) * 1.25;
            viewport.scrollLeft = startScrollLeft - walk;
        });
    }

    function setupScrollSync() {
        let scrollTimeout = null;
        viewport.addEventListener('scroll', () => {
            if (!isDesktopMode()) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const idx = Math.round(viewport.scrollLeft / window.innerWidth);
                if (idx !== currentIndex) {
                    updateActiveUI(idx);
                }
            }, 60);
        });

        window.addEventListener('scroll', () => {
            if (isDesktopMode()) return;
            const scrollMid = window.scrollY + window.innerHeight * 0.35;
            panels.forEach((panel, i) => {
                const top = panel.offsetTop;
                const bottom = top + panel.offsetHeight;
                if (scrollMid >= top && scrollMid < bottom && i !== currentIndex) {
                    updateActiveUI(i);
                }
            });
        }, { passive: true });
    }

    function init() {
        viewport = document.getElementById('horizontalViewport');
        if (!viewport) return;

        panels = Array.from(viewport.querySelectorAll('.panel'));
        navLinks = Array.from(document.querySelectorAll('.nav-link[data-panel]'));
        dots = Array.from(document.querySelectorAll('.panel-dot[data-panel]'));
        prevBtn = document.getElementById('prevPanelBtn');
        nextBtn = document.getElementById('nextPanelBtn');
        counterEl = document.getElementById('panelCounter');

        document.querySelectorAll('[data-panel]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-panel');
                goToPanelById(targetId);

                const menu = document.getElementById('navMenu');
                if (menu) menu.classList.remove('is-open');
            });
        });

        if (prevBtn) prevBtn.addEventListener('click', () => goToPanel(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToPanel(currentIndex + 1));

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', () => {
            if (isDesktopMode()) {
                viewport.scrollTo({ left: currentIndex * window.innerWidth, behavior: 'auto' });
            }
        });

        setupDragSwipe();
        setupScrollSync();
        updateActiveUI(0);
    }

    return {
        init,
        goToPanel,
        goToPanelById
    };
})();
