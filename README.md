# fiqrifebrians.github.io

Personal portfolio website for Muhammad Fiqri Febriansyah, designed with a Swiss Editorial White-Red aesthetic, horizontal-scrolling viewport architecture, and integrated GSAP + ScrollTrigger, Motion, and Lenis animations for GitHub Pages.

## Directory Structure

```text
fiqrifebrians.github.io/
├── index.html                  # Semantic HTML5 layout with CDN & modular scripts
├── _config.yml                 # GitHub Pages configuration
├── README.md                   # Project documentation
├── assets/
│   └── images/
│       ├── skills/             # Local skill & language icons (15 icons)
│       └── ...                 # Profile, institution, project, and contact assets
├── css/
│   ├── variables.css           # Swiss editorial tokens (Instrument Serif + Inter, White-Red)
│   ├── base.css                # Reset and base typography
│   ├── layout.css              # Horizontal 100vw/100dvh viewport, floating navbar, grids
│   ├── components.css          # Hero, About/Leeds Map, Timeline, Skills, Projects, Modal, Motion wrappers
│   └── responsive.css          # Laptop, tablet, and mobile responsive rules
└── js/
    ├── smooth-scroll.js        # Lenis smooth scrolling synchronized with GSAP ScrollTrigger
    ├── motion-effects.js       # Motion hover, press, and modal micro-interactions
    ├── animations.js           # GSAP + ScrollTrigger word-by-word headings & staggered entrances
    ├── horizontal-scroll.js    # Wheel, keyboard, drag/swipe, arrow, navbar & mobile carousel isolation
    ├── projects-filter.js      # Category filters and enriched project detail modal
    └── main.js                 # Application entry point
```
