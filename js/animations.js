/* ============================================================
   GSAP + ScrollTrigger Animations & Mobile Navigation Menu
   - Word-by-word heading reveals (preserving nested spans)
   - One-by-one staggered element entrances per active panel
   - Full prefers-reduced-motion accessibility support
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.Animations = (function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animatedPanels = new WeakSet();

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

    /**
     * Safely splits heading text nodes into word wrappers while preserving
     * child spans (e.g., <span class="text-accent">) and screen-reader label.
     */
    function splitHeadingWords(headingEl) {
        if (!headingEl || headingEl.dataset.wordsSplit === 'true') return;

        const plainText = headingEl.textContent.replace(/\s+/g, ' ').trim();
        if (plainText && !headingEl.getAttribute('aria-label')) {
            headingEl.setAttribute('aria-label', plainText);
        }

        function wrapNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) return;

                const frag = document.createDocumentFragment();
                const tokens = text.split(/(\s+)/);
                tokens.forEach((token) => {
                    if (!token) return;
                    if (/^\s+$/.test(token)) {
                        frag.appendChild(document.createTextNode(' '));
                    } else {
                        const mask = document.createElement('span');
                        mask.className = 'word-mask';
                        mask.setAttribute('aria-hidden', 'true');

                        const inner = document.createElement('span');
                        inner.className = 'word-inner';
                        inner.textContent = token;

                        mask.appendChild(inner);
                        frag.appendChild(mask);
                    }
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(wrapNode);
            }
        }

        Array.from(headingEl.childNodes).forEach(wrapNode);
        headingEl.dataset.wordsSplit = 'true';
    }

    function prepareAllHeadings() {
        const headings = document.querySelectorAll('.hero-title, .section-title, #contact h2');
        headings.forEach(splitHeadingWords);
    }

    function getStaggerTargets(panelEl) {
        if (!panelEl) return [];
        const id = panelEl.id;

        if (id === 'hero') {
            return Array.from(
                panelEl.querySelectorAll(
                    '.hero-eyebrow, .hero-role, .hero-desc, .hero-actions .btn, .hero-quick-links .hero-social-btn, .hero-photo-frame'
                )
            );
        }
        if (id === 'about') {
            return Array.from(
                panelEl.querySelectorAll('.section-eyebrow, .about-narrative-card, .skyline-card, .focus-card')
            );
        }
        if (id === 'experience') {
            return Array.from(
                panelEl.querySelectorAll('.section-eyebrow, .column-label, .timeline-card')
            );
        }
        if (id === 'skills') {
            return Array.from(
                panelEl.querySelectorAll('.section-eyebrow, .column-label, .skill-tile, .language-tile')
            );
        }
        if (id === 'projects') {
            return Array.from(
                panelEl.querySelectorAll('.section-eyebrow, .project-filters .filter-btn, .project-card:not(.is-hidden)')
            );
        }
        if (id === 'contact') {
            return Array.from(
                panelEl.querySelectorAll('.section-eyebrow, .contact-panel-box > p, .contact-item-card, .panel-footer')
            );
        }
        return Array.from(panelEl.querySelectorAll('.reveal-item'));
    }

    function onPanelActivate(panelEl) {
        if (!panelEl || prefersReducedMotion || typeof window.gsap === 'undefined') return;
        if (animatedPanels.has(panelEl)) return;
        animatedPanels.add(panelEl);

        const gsap = window.gsap;
        const words = panelEl.querySelectorAll('.word-inner');
        const targets = getStaggerTargets(panelEl);

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });

        const isShowcasePanel = ['experience', 'skills', 'projects'].includes(panelEl.id);
        const itemDuration = isShowcasePanel ? 0.9 : 0.72;
        const itemStagger = isShowcasePanel ? 0.095 : 0.075;

        if (words.length) {
            tl.fromTo(
                words,
                { yPercent: 110, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.78,
                    stagger: 0.07,
                    clearProps: 'transform,opacity,willChange'
                },
                0
            );
        }

        if (targets.length) {
            targets.forEach((el) => {
                el.dataset.entering = 'true';
            });

            tl.fromTo(
                targets,
                { y: 24, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: itemDuration,
                    stagger: itemStagger,
                    clearProps: 'transform,opacity,willChange',
                    onComplete: () => {
                        targets.forEach((el) => {
                            delete el.dataset.entering;
                        });
                    }
                },
                words.length ? 0.18 : 0
            );
        }
    }

    function initScrollTrigger() {
        if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
            return;
        }
        window.gsap.registerPlugin(window.ScrollTrigger);
    }

    function init() {
        setupMobileMenu();
        if (prefersReducedMotion || typeof window.gsap === 'undefined') return;

        initScrollTrigger();
        prepareAllHeadings();

        // Animate initial active panel (#hero)
        const initialPanel = document.querySelector('.panel.is-active') || document.getElementById('hero');
        if (initialPanel) {
            onPanelActivate(initialPanel);
        }
    }

    return {
        init,
        onPanelActivate
    };
})();
