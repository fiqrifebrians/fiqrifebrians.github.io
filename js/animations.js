/* ============================================================
   Mobile Navigation Menu & Panel Transition Hooks
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.Animations = (function () {
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (!toggleBtn || !navMenu) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.classList.contains('is-open')) return;
            if (!e.target.closest('#mainNavbar')) {
                navMenu.classList.remove('is-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function init() {
        setupMobileMenu();
    }

    return { init };
})();
