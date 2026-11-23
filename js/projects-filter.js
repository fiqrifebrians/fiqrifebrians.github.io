/* ============================================================
   Projects Category Filter & Enriched Detail Modal Controller
   ============================================================ */

window.PortfolioApp = window.PortfolioApp || {};

window.PortfolioApp.ProjectsFilter = (function () {
    const projectData = {
        animedic: {
            title: 'Animedic',
            category: 'Web Application',
            image: 'assets/images/animedic.png',
            overview: 'An on-demand pet healthcare marketplace prototype designed to reduce pet travel stress by connecting pet owners with verified veterinary and pet-care services in one unified platform.',
            features: [
                'Online veterinary consultation and AI-assisted triage flow',
                'Home-visit veterinarian and professional groomer booking with multi-pet pricing',
                'Integrated pet pharmacy catalog and pet hotel directory',
                'Monthly pet care plan structure and interactive location-based service discovery'
            ],
            approach: 'Built using modular HTML, CSS, and Vanilla JavaScript with a clean white-and-orange UI architecture, host-agnostic page routing, and device-local state persistence to validate end-to-end marketplace workflows.',
            skills: [
                { name: 'Web Development', icon: 'assets/images/skills/webdev.png' },
                { name: 'UI/UX Design', icon: 'assets/images/skills/ux.png' },
                { name: 'Business Development', icon: 'assets/images/skills/businessdev.png' }
            ],
            url: 'https://fiqrifebrians.github.io/Animedic/',
            ctaLabel: 'Open Live Project'
        },
        formix: {
            title: 'Formix',
            category: 'Web Application',
            image: 'assets/images/formix.png',
            overview: 'A focused, responsive web interface built for organizing and visualizing structured layouts and football tactical formations with minimal visual friction.',
            features: [
                'Clean, responsive layout engineered for fast interaction across desktop and mobile',
                'Interactive formation and lineup customization controls',
                'Clear visual hierarchy that keeps configuration options accessible without clutter'
            ],
            approach: 'Developed with pure HTML, CSS, and JavaScript using modular stylesheets and lightweight DOM manipulation to ensure instant load times and zero external framework overhead on GitHub Pages.',
            skills: [
                { name: 'Web Development', icon: 'assets/images/skills/webdev.png' },
                { name: 'JavaScript', icon: 'assets/images/skills/javascript.svg' },
                { name: 'UI/UX Design', icon: 'assets/images/skills/ux.png' }
            ],
            url: 'https://fiqrifebrians.github.io/Formix/',
            ctaLabel: 'Open Live Project'
        },
        wisher: {
            title: 'Wisher',
            category: 'Web Application',
            image: 'assets/images/wisher.png',
            overview: 'A minimalist personal wishlist web platform created to help users curate, organize, and track desired items or personal milestones in a calm, distraction-free workspace.',
            features: [
                'Structured wishlist curation with clean item cards and status tracking',
                'Simple client-side organization for adding, reviewing, and managing entries',
                'Minimalist monochrome interface with subtle red accents for clear action states'
            ],
            approach: 'Architected with semantic HTML, modular CSS, and Vanilla JavaScript focusing on typographic clarity, crisp spacing, and responsive card layouts that feel effortless on both mobile and desktop screens.',
            skills: [
                { name: 'Web Development', icon: 'assets/images/skills/webdev.png' },
                { name: 'JavaScript', icon: 'assets/images/skills/javascript.svg' },
                { name: 'UI/UX Design', icon: 'assets/images/skills/ux.png' }
            ],
            url: 'https://fiqrifebrians.github.io/Wisher/',
            ctaLabel: 'Open Live Project'
        },
        'nusa-translate': {
            title: 'Nusa Translate',
            category: 'Web Application',
            image: 'assets/images/nusa-translate.png',
            overview: 'A dedicated web translation application focused on Indonesian regional languages, built to make local linguistic exploration practical and approachable in the browser.',
            features: [
                'Streamlined source-to-target translation workspace tailored for Indonesian regional languages',
                'Quick language selection and clear side-by-side output presentation',
                'Responsive browser interface designed for quick lookups on mobile and desktop'
            ],
            approach: 'Engineered with Vanilla JavaScript and clean front-end state handling, prioritizing fast input feedback, readable typography, and a focused single-purpose UX.',
            skills: [
                { name: 'JavaScript', icon: 'assets/images/skills/javascript.svg' },
                { name: 'Web Development', icon: 'assets/images/skills/webdev.png' },
                { name: 'Applied AI', icon: 'assets/images/skills/appliedai.png' }
            ],
            url: 'https://fiqrifebrians.github.io/Nusa-Translate/',
            ctaLabel: 'Open Live Project'
        },
        'aff-kit': {
            title: '2022 AFF Concept Kit',
            category: 'Design Case Study',
            image: 'assets/images/2022-aff.png',
            overview: 'A comprehensive football apparel design series featuring concept kits for all 10 national teams participating in the 2022 AFF Mitsubishi Electric Cup, published on Behance.',
            features: [
                'Complete 10-nation visual concept kit collection with distinct cultural motifs',
                'Consistent jersey mockups, pattern detailing, and national color storytelling',
                'Structured editorial presentation tailored for sports design showcase'
            ],
            approach: 'Executed as an end-to-end visual identity exercise combining vector graphic design, regional cultural research, and cohesive layout presentation across all 10 national team concepts.',
            skills: [
                { name: 'Graphic Design', icon: 'assets/images/skills/graphicdesign.png' },
                { name: 'UI/UX Design', icon: 'assets/images/skills/ux.png' },
                { name: 'Project Management', icon: 'assets/images/skills/projectmanagement.png' }
            ],
            url: 'https://www.behance.net/gallery/159799401/2022-AFF-Championship-Concept-Kit',
            ctaLabel: 'View on Behance'
        }
    };

    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
        const cards = document.querySelectorAll('.project-card[data-category]');

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filterBtns.forEach((b) => b.classList.toggle('active', b === btn));

                cards.forEach((card) => {
                    const cat = card.getAttribute('data-category');
                    const visible = filter === 'all' || cat === filter;
                    card.classList.toggle('is-hidden', !visible);
                });

                const grid = document.querySelector('#projects .projects-grid');
                if (grid) {
                    grid.scrollTo({ left: 0, behavior: 'smooth' });
                }
            });
        });
    }

    function initModal() {
        const modal = document.getElementById('projectModal');
        const closeBtn = document.getElementById('modalCloseBtn');
        const modalTitle = document.getElementById('modalTitle');
        const modalCategory = document.getElementById('modalCategory');
        const modalImage = document.getElementById('modalImage');
        const modalOverview = document.getElementById('modalOverview');
        const modalFeatures = document.getElementById('modalFeatures');
        const modalApproach = document.getElementById('modalApproach');
        const modalSkills = document.getElementById('modalSkills');
        const modalLink = document.getElementById('modalLink');

        if (!modal) return;

        function openModal(key) {
            const data = projectData[key];
            if (!data) return;

            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalOverview.textContent = data.overview;
            modalApproach.textContent = data.approach;
            modalLink.href = data.url;
            modalLink.textContent = `${data.ctaLabel} ↗`;

            modalFeatures.innerHTML = '';
            data.features.forEach((feat) => {
                const li = document.createElement('li');
                li.textContent = feat;
                modalFeatures.appendChild(li);
            });

            modalSkills.innerHTML = '';
            data.skills.forEach((skill) => {
                const span = document.createElement('span');
                span.className = 'project-skill-tag';
                const img = document.createElement('img');
                img.src = skill.icon;
                img.alt = skill.name;
                span.appendChild(img);
                span.appendChild(document.createTextNode(skill.name));
                modalSkills.appendChild(span);
            });

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }

        document.querySelectorAll('[data-project-key]').forEach((btn) => {
            btn.addEventListener('click', () => {
                openModal(btn.getAttribute('data-project-key'));
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    function init() {
        initFilters();
        initModal();
    }

    return { init };
})();
