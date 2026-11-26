/* ============================================================
   Application Entry Point & Module Coordinator
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (window.PortfolioApp.SmoothScroll) {
        window.PortfolioApp.SmoothScroll.init();
    }
    if (window.PortfolioApp.Animations) {
        window.PortfolioApp.Animations.init();
    }
    if (window.PortfolioApp.MotionEffects) {
        window.PortfolioApp.MotionEffects.init();
    }
    if (window.PortfolioApp.HorizontalScroll) {
        window.PortfolioApp.HorizontalScroll.init();
    }
    if (window.PortfolioApp.ProjectsFilter) {
        window.PortfolioApp.ProjectsFilter.init();
    }
});
