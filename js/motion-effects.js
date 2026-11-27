/* ============================================================
   Motion Hover, Press & Modal Micro-Interactions
   Uses Motion (window.Motion) with hardware-accelerated
   transform/opacity transitions, zero CSS transform collisions,
   and full prefers-reduced-motion guard.
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.MotionEffects = (function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const activeControls = new WeakMap();

    function getAnimate() {
        if (window.Motion && typeof window.Motion.animate === 'function') {
            return window.Motion.animate;
        }
        return null;
    }

    function runAnim(el, keyframes, options) {
        const animate = getAnimate();
        if (!animate || !el) return;

        const prev = activeControls.get(el);
        if (prev && typeof prev.stop === 'function') {
            prev.stop();
        }
        const ctrl = animate(el, keyframes, options);
        activeControls.set(el, ctrl);
        return ctrl;
    }

    function bindHoverLift(selector, options) {
        if (!getAnimate() || prefersReducedMotion || !hasFinePointer) return;

        const {
            y = -3,
            scale = 1.01,
            pressScale = 0.98,
            duration = 0.22,
            baseTransform = ''
        } = options;

        const restTransform = baseTransform ? `${baseTransform} scale(1)` : 'translateY(0px) scale(1)';
        const hoverTransform = baseTransform
            ? `${baseTransform} scale(${scale})`
            : `translateY(${y}px) scale(${scale})`;
        const pressTransform = baseTransform
            ? `${baseTransform} scale(${pressScale})`
            : `translateY(0px) scale(${pressScale})`;

        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('pointerenter', () => {
                if (el.disabled || el.dataset.entering === 'true') return;
                runAnim(
                    el,
                    { transform: [restTransform, hoverTransform] },
                    { duration, easing: [0.22, 1, 0.36, 1] }
                );
            });

            el.addEventListener('pointerleave', () => {
                if (el.dataset.entering === 'true') return;
                runAnim(
                    el,
                    { transform: restTransform },
                    { duration: duration + 0.04, easing: [0.22, 1, 0.36, 1] }
                );
            });

            el.addEventListener('pointerdown', () => {
                if (el.disabled || el.dataset.entering === 'true') return;
                runAnim(
                    el,
                    { transform: pressTransform },
                    { duration: 0.12, easing: 'ease-out' }
                );
            });

            el.addEventListener('pointerup', () => {
                if (el.disabled || el.dataset.entering === 'true') return;
                runAnim(
                    el,
                    { transform: hoverTransform },
                    { duration: 0.18, easing: [0.22, 1, 0.36, 1] }
                );
            });
        });
    }

    function bindThumbHover() {
        if (!getAnimate() || prefersReducedMotion || !hasFinePointer) return;

        document.querySelectorAll('.project-card').forEach((card) => {
            const img = card.querySelector('.project-thumb img');
            if (!img) return;

            card.addEventListener('pointerenter', () => {
                if (card.dataset.entering === 'true') return;
                runAnim(img, { transform: ['scale(1)', 'scale(1.05)'] }, { duration: 0.3, easing: [0.22, 1, 0.36, 1] });
            });

            card.addEventListener('pointerleave', () => {
                if (card.dataset.entering === 'true') return;
                runAnim(img, { transform: 'scale(1)' }, { duration: 0.3, easing: [0.22, 1, 0.36, 1] });
            });
        });
    }

    function animateModalOpen(dialogEl) {
        if (!getAnimate() || prefersReducedMotion || !dialogEl) return;

        runAnim(
            dialogEl,
            {
                opacity: [0, 1],
                transform: ['translateY(18px) scale(0.97)', 'translateY(0px) scale(1)']
            },
            { duration: 0.28, easing: [0.22, 1, 0.36, 1] }
        );
    }

    function init() {
        if (!getAnimate() || prefersReducedMotion || !hasFinePointer) return;

        // Signal to CSS that Motion owns hover transforms (prevents CSS/WAAPI collisions)
        document.body.classList.add('has-motion');

        bindHoverLift('.btn, .filter-btn, .nav-cta, .back-to-start-btn', {
            y: -2,
            scale: 1.02,
            pressScale: 0.97,
            duration: 0.2
        });

        bindHoverLift('.hero-social-btn', {
            y: -2,
            scale: 1.06,
            pressScale: 0.95,
            duration: 0.18
        });

        // Preserve translateY(-50%) vertical centering on side viewport arrows
        bindHoverLift('.viewport-arrow', {
            scale: 1.06,
            pressScale: 0.95,
            duration: 0.18,
            baseTransform: 'translateY(-50%)'
        });

        bindHoverLift('.focus-card, .timeline-card, .project-card, .contact-item-card', {
            y: -4,
            scale: 1.008,
            pressScale: 0.99,
            duration: 0.24
        });

        bindHoverLift('.skill-tile, .language-tile', {
            y: -3,
            scale: 1.02,
            pressScale: 0.98,
            duration: 0.2
        });

        bindHoverLift('.hero-photo-frame', {
            y: -4,
            scale: 1.02,
            pressScale: 0.99,
            duration: 0.28
        });

        bindThumbHover();
    }

    return {
        init,
        animateModalOpen
    };
})();
