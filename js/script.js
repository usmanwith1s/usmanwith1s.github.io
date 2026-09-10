document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");

  /* =========================
     THEME
  ========================= */

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  const updateThemeIcon = () => {
    if (!themeToggle) return;

    const isLight = document.body.classList.contains("light-mode");

   

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
  };

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const isLight = document.body.classList.contains("light-mode");

      localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
      );

      updateThemeIcon();
    });
  }

  /* =========================
     SCROLL REVEALS
  ========================= */

  const revealItems = document.querySelectorAll(
    ".section, .skill-card, .project-card, .experience-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
  /* =========================
   MOUSE-REACTIVE GLASS
========================= */

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice) {
 const glassElements = document.querySelectorAll(
 ".navbar, .skill-card, .project-card, .experience-card, .portrait-glass, .about-main, .about-stat, .skill-group, .project-feature, .timeline-item, .contact-card, .contact-form"
);

  glassElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      element.style.setProperty("--mouse-x", `${x}px`);
      element.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}
  /* =========================
   HERO PARALLAX
========================= */

const heroVisual = document.querySelector("#heroVisual");
const portraitGlass = document.querySelector(".portrait-glass");

const allowParallax =
  !window.matchMedia("(pointer: coarse)").matches &&
  window.innerWidth > 900;

if (heroVisual && portraitGlass && allowParallax) {
  heroVisual.addEventListener("mousemove", (e) => {
    const rect = heroVisual.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;

    portraitGlass.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(8px)
    `;
  });

  heroVisual.addEventListener("mouseleave", () => {
    portraitGlass.style.transform =
      "rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
}
  /* =========================
   ACTIVE NAV SECTION
========================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.remove("active");

        if (
          link.getAttribute("href") ===
          `#${entry.target.id}`
        ) {
          link.classList.add("active");
        }
      });
    });
  },
  {
    rootMargin: "-40% 0px -50% 0px"
  }
);

sections.forEach((section) => {
  navObserver.observe(section);
});
  /* =========================
   CONTACT FORM AJAX
========================= */

const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  const sendButton = contactForm.querySelector(".send-button");

  const formStatus = document.createElement("p");
  formStatus.className = "form-status";
  contactForm.appendChild(formStatus);

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonContent = sendButton.innerHTML;

    sendButton.disabled = true;
    sendButton.innerHTML = "<span>Sending...</span>";

    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formStatus.textContent = "Message sent successfully.";
        formStatus.classList.add("success");

        contactForm.reset();
      } else {
        formStatus.textContent =
          "Something went wrong. Please try again.";
        formStatus.classList.add("error");
      }
    } catch (error) {
      formStatus.textContent =
        "Unable to send right now. Please try again.";
      formStatus.classList.add("error");
    }

    sendButton.disabled = false;
    sendButton.innerHTML = originalButtonContent;
  });
}
  /* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".nav-links");

if (menuToggle && mobileNav) {

  menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");
    mobileNav.classList.toggle("active");

    const isOpen =
      mobileNav.classList.contains("active");

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation"
        : "Open navigation"
    );
  });


  mobileNav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mobileNav.classList.remove("active");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );
    });

  });

}
  /* =========================
   3D PROJECT ENTRANCE
========================= */

const orbitProjects =
  document.querySelectorAll(".project-orbit");

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

if (!prefersReducedMotion) {

  const projectEntranceObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const project = entry.target;

          project.classList.add(
            "project-entered"
          );


          /* after entrance finishes,
             switch to subtle idle float */

          project.addEventListener(
            "animationend",
            (event) => {

              if (
                event.animationName !==
                "projectOrbitEntrance"
              ) {
                return;
              }

              project.classList.remove(
                "project-entered"
              );

              project.classList.add(
                "project-settled"
              );

            },
            {
              once: true
            }
          );


          observer.unobserve(project);

        });

      },
      {
        threshold: 0.18
      }
    );


  orbitProjects.forEach((project) => {
    projectEntranceObserver.observe(project);
  });

} else {

  orbitProjects.forEach((project) => {
    project.classList.add("project-settled");
  });

}
  /* =========================
   SKILLS 3D DECK ENTRANCE
========================= */

const skillCards =
  document.querySelectorAll(".skill-deck");

const skillObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const card = entry.target;

        card.classList.remove("skill-waiting");
        card.classList.add("skill-entered");

        observer.unobserve(card);

      });

    },
    {
      threshold: 0.18
    }
  );

skillCards.forEach((card) => {
  card.classList.add("skill-waiting");
  skillObserver.observe(card);
});
  /* =========================
   ABOUT ASSEMBLY
========================= */

const aboutElements =
  document.querySelectorAll(
    ".about-core, .about-fragment"
  );

const aboutObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const element = entry.target;

        element.classList.remove("about-waiting");
        element.classList.add("about-entered");

        observer.unobserve(element);

      });

    },
    {
      threshold: 0.18
    }
  );

aboutElements.forEach((element) => {
  element.classList.add("about-waiting");
  aboutObserver.observe(element);
});
  /* =========================
   EXPERIENCE SWEEP
========================= */

const timelineCards =
  document.querySelectorAll(".timeline-sweep");

const timelineObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const card = entry.target;

        card.classList.remove("timeline-waiting");
        card.classList.add("timeline-entered");

        observer.unobserve(card);

      });

    },
    {
      threshold: 0.18
    }
  );

timelineCards.forEach((card) => {
  card.classList.add("timeline-waiting");
  timelineObserver.observe(card);
});
  /* =========================
   CONTACT ENTRANCE
========================= */

const contactMotionElements =
  document.querySelectorAll(
    ".contact-drift, .contact-form-depth"
  );

const contactMotionObserver =
  new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const element = entry.target;

        element.classList.remove("contact-waiting");
        element.classList.add("contact-entered");

        observer.unobserve(element);

      });

    },
    {
      threshold: 0.18
    }
  );

contactMotionElements.forEach((element) => {
  element.classList.add("contact-waiting");
  contactMotionObserver.observe(element);
});
  /* =========================
   PROJECT CURSOR DEPTH
========================= */

const projectCards =
    document.querySelectorAll(".project-feature");

projectCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        if (window.innerWidth <= 768) return;

        const rect = card.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;

        card.style.setProperty("--mouse-x", x);
        card.style.setProperty("--mouse-y", y);
    });

    card.addEventListener("mouseleave", () => {

        card.style.setProperty("--mouse-x", 0);
        card.style.setProperty("--mouse-y", 0);
    });
});


  /* =====================================================
     CINEMATIC STAR FIELD
     Three large, clean formations in dedicated negative space:
     MU identity -> gaming controller -> collaboration infinity.
  ===================================================== */

  const particleCanvas = document.querySelector("#particleCanvas");
  const particleContext = particleCanvas
    ? particleCanvas.getContext("2d")
    : null;

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (particleCanvas && particleContext) {
    const particleState = {
      width: 0,
      height: 0,
      dpr: 1,
      maxScroll: 1,
      scrollY: window.scrollY || 0,
      mouseX: -1000,
      mouseY: -1000,
      smoothMouseX: -1000,
      smoothMouseY: -1000,
      lastTime: 0,
      resizeTimer: 0,
      scrollTick: 0,
      raf: 0,
      reducedMotion: reducedMotionQuery.matches,
      palette: {
        primary: [245, 249, 255],
        secondary: [124, 92, 255],
        tertiary: [45, 212, 191]
      }
    };

    const particles = [];
    const sceneData = {
      about: [],
      projects: [],
      contact: []
    };

    let logoLoaded = false;
    let sceneMetrics = [];

    const sceneElements = {
      about: document.querySelector('[data-particle-scene="about"]'),
      projects: document.querySelector('[data-particle-scene="projects"]'),
      contact: document.querySelector('[data-particle-scene="contact"]')
    };

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    const smoothstep = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };

    const lerp = (a, b, amount) =>
      a + (b - a) * amount;

    const cubicPoint = (p0, p1, p2, p3, t) => {
      const u = 1 - t;
      return {
        x:
          u * u * u * p0.x +
          3 * u * u * t * p1.x +
          3 * u * t * t * p2.x +
          t * t * t * p3.x,
        y:
          u * u * u * p0.y +
          3 * u * u * t * p1.y +
          3 * u * t * t * p2.y +
          t * t * t * p3.y
      };
    };

    const addCubic = (points, p0, p1, p2, p3, count, z = 0) => {
      for (let i = 0; i < count; i += 1) {
        const t = count <= 1 ? 0 : i / (count - 1);
        const point = cubicPoint(p0, p1, p2, p3, t);
        points.push({
          x: point.x,
          y: point.y,
          z: z + Math.sin(t * Math.PI) * 3
        });
      }
    };

    const addLine = (points, x1, y1, x2, y2, count, z = 0) => {
      for (let i = 0; i < count; i += 1) {
        const t = count <= 1 ? 0 : i / (count - 1);
        points.push({
          x: lerp(x1, x2, t),
          y: lerp(y1, y2, t),
          z: z + Math.sin(t * Math.PI) * 2
        });
      }
    };

    const addEllipse = (points, cx, cy, rx, ry, count, z = 0) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        points.push({
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry,
          z: z + Math.sin(angle * 2) * 2
        });
      }
    };

    const particleCount = () => {
      const mobile = particleState.width <= 768;
      const area = (particleState.width * particleState.height) / (1440 * 900);
      return mobile
        ? clamp(Math.round(300 + area * 90), 280, 390)
        : clamp(Math.round(670 + area * 170), 650, 860);
    };

    const formationCount = () =>
      particleState.width <= 768 ? 120 : 230;

    const createParticle = (index) => {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.max(particleState.width, particleState.height) *
        (0.08 + Math.random() * 0.74);

      return {
        baseX: particleState.width * 0.5 + Math.cos(angle) * spread,
        baseY: particleState.height * 0.5 + Math.sin(angle) * spread * 0.68,
        vx: (Math.random() - 0.5) * 0.030,
        vy: (Math.random() - 0.5) * 0.030,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.00022 + Math.random() * 0.00034,
        z: Math.random() * 2 - 1,
        size: 0.28 + Math.random() * 0.38,
        alpha: 0.16 + Math.random() * 0.48,
        twinkle: 0.7 + Math.random() * 1.6,
        hueMix: Math.random(),
        type: index % 7,
        formation: index < formationCount(),
        tx: 0,
        ty: 0,
        tz: 0
      };
    };

    const rebuildParticles = () => {
      particles.length = 0;
      const count = particleCount();
      for (let i = 0; i < count; i += 1) {
        particles.push(createParticle(i));
      }
    };

    const makeController = (scale) => {
      const points = [];
      const s = scale;
      const p = (x, y) => ({ x: x * s, y: y * s });

      // Large, recognizable controller silhouette.
      addCubic(points, p(-182, -2), p(-169, -74), p(-122, -82), p(-76, -45), 30);
      addCubic(points, p(-76, -45), p(-42, -18), p(42, -18), p(76, -45), 34);
      addCubic(points, p(76, -45), p(122, -82), p(169, -74), p(182, -2), 30);
      addCubic(points, p(182, -2), p(194, 53), p(178, 92), p(151, 94), 24);
      addCubic(points, p(151, 94), p(125, 96), p(112, 56), p(92, 34), 18);
      addCubic(points, p(92, 34), p(51, 13), p(-51, 13), p(-92, 34), 26);
      addCubic(points, p(-92, 34), p(-112, 56), p(-125, 96), p(-151, 94), 18);
      addCubic(points, p(-151, 94), p(-178, 92), p(-194, 53), p(-182, -2), 24);

      // D-pad.
      addLine(points, -126 * s, 0, -90 * s, 0, 11, 2);
      addLine(points, -108 * s, -18 * s, -108 * s, 18 * s, 11, 2);

      // Four face buttons.
      addEllipse(points, 111 * s, -12 * s, 7 * s, 7 * s, 14, 4);
      addEllipse(points, 132 * s, 8 * s, 7 * s, 7 * s, 14, 4);
      addEllipse(points, 90 * s, 8 * s, 7 * s, 7 * s, 14, 4);
      addEllipse(points, 111 * s, 29 * s, 7 * s, 7 * s, 14, 4);

      // Two sticks.
      addEllipse(points, -52 * s, 3 * s, 13 * s, 13 * s, 18, 3);
      addEllipse(points, 50 * s, 3 * s, 13 * s, 13 * s, 18, 3);

      // Tiny center light strip.
      addLine(points, -13 * s, -6 * s, 13 * s, -6 * s, 14, 3);

      return points;
    };

    const makeInfinity = (scale) => {
      const points = [];
      const s = scale;

      // Main elegant collaboration loop.
      const count = 190;
      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 2;
        const x = Math.sin(t) * 160 * s;
        const y = Math.sin(t * 2) * 92 * s;
        points.push({
          x,
          y,
          z: Math.cos(t * 2) * 5
        });
      }

      // Two bright connection nodes.
      addEllipse(points, -102 * s, 0, 11 * s, 11 * s, 20, 7);
      addEllipse(points, 102 * s, 0, 11 * s, 11 * s, 20, 7);

      // Small orbital arc accents.
      addCubic(
        points,
        { x: -132 * s, y: -20 * s },
        { x: -96 * s, y: -56 * s },
        { x: -54 * s, y: -56 * s },
        { x: -22 * s, y: -30 * s },
        25,
        2
      );
      addCubic(
        points,
        { x: 22 * s, y: 30 * s },
        { x: 54 * s, y: 56 * s },
        { x: 96 * s, y: 56 * s },
        { x: 132 * s, y: 20 * s },
        25,
        2
      );

      // A tiny four-point signature spark at the upper centre.
      addLine(points, 0, -45 * s, 0, -25 * s, 6, 7);
      addLine(points, -10 * s, -35 * s, 10 * s, -35 * s, 6, 7);

      return points;
    };

    const buildFallbackLogo = () => {
      const points = [];
      const s = particleState.width <= 768 ? 0.78 : 1.18;

      // MU line-art fallback.
      addLine(points, -120 * s, -62 * s, -120 * s, 62 * s, 25);
      addLine(points, -120 * s, -62 * s, -62 * s, 3 * s, 18);
      addLine(points, -62 * s, 3 * s, -4 * s, -62 * s, 18);
      addLine(points, -4 * s, -62 * s, -4 * s, 62 * s, 25);
      addLine(points, 28 * s, -62 * s, 28 * s, 32 * s, 20);
      addEllipse(points, 80 * s, 32 * s, 52 * s, 30 * s, 30);
      addLine(points, 132 * s, 32 * s, 132 * s, -62 * s, 20);
      return points;
    };

    const loadLogoPoints = () => {
      const source = new Image();
      source.decoding = "async";
      source.src = "assets/images/usman-logo.png";

      source.onload = () => {
        const mobile = particleState.width <= 768;
        const sampleWidth = mobile ? 120 : 170;
        const targetWidth = mobile ? 250 : 410;
        const sourceRatio = source.naturalHeight / Math.max(1, source.naturalWidth);
        const sampleHeight = Math.max(2, Math.round(sampleWidth * sourceRatio));
        const offscreen = document.createElement("canvas");
        offscreen.width = sampleWidth;
        offscreen.height = sampleHeight;
        const context = offscreen.getContext("2d", { willReadFrequently: true });
        if (!context) return;

        context.clearRect(0, 0, sampleWidth, sampleHeight);
        context.drawImage(source, 0, 0, sampleWidth, sampleHeight);

        let pixels;
        try {
          pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
        } catch (error) {
          sceneData.about = buildFallbackLogo();
          return;
        }

        const edge = [];
        for (let y = 0; y < sampleHeight; y += 1) {
          for (let x = 0; x < sampleWidth; x += 1) {
            const alpha = pixels[(y * sampleWidth + x) * 4 + 3];
            if (alpha >= 105) {
              edge.push({
                x:
                  (x / Math.max(1, sampleWidth - 1) - 0.5) * targetWidth,
                y:
                  (y / Math.max(1, sampleHeight - 1) - 0.5) *
                  targetWidth * sourceRatio,
                z: (alpha / 255) * 5
              });
            }
          }
        }

        if (!edge.length) {
          sceneData.about = buildFallbackLogo();
          return;
        }

        const max = mobile ? 120 : 230;
        const stride = Math.max(1, Math.ceil(edge.length / max));
        sceneData.about = edge.filter((_, index) => index % stride === 0);
        logoLoaded = true;
        refreshSceneMetrics();
      };

      source.onerror = () => {
        sceneData.about = buildFallbackLogo();
        refreshSceneMetrics();
      };
    };

    const pageTop = (element) => {
      if (!element) return 0;
      const rect = element.getBoundingClientRect();
      return rect.top + (window.scrollY || window.pageYOffset || 0);
    };

    const refreshSceneMetrics = () => {
      const mobile = particleState.width <= 768;
      const metrics = [];

      const config = [
        ["about", mobile ? 0.50 : 0.72, mobile ? 0.88 : 1.10],
        ["projects", mobile ? 0.50 : 0.30, mobile ? 0.60 : 0.88],
        ["contact", mobile ? 0.50 : 0.70, mobile ? 0.64 : 0.94]
      ];

      config.forEach(([key, xRatio, scale]) => {
        const element = sceneElements[key];
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const top = rect.top + (window.scrollY || window.pageYOffset || 0);
        metrics.push({
          key,
          element,
          top,
          height: rect.height,
          x: particleState.width * xRatio,
          scale
        });
      });

      sceneMetrics = metrics;
    };

    const updateScrollBounds = () => {
      particleState.maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
      refreshSceneMetrics();
    };

    const getSceneState = (points, metric) => {
      if (!metric || !points.length) return { amount: 0, x: 0, y: 0 };

      const centerPage = metric.top + metric.height * 0.50;
      const windowSize = particleState.height * (particleState.width <= 768 ? 0.82 : 0.70);
      const start = centerPage - windowSize;
      const end = centerPage + windowSize;
      const raw = clamp(
        (particleState.scrollY - start) / Math.max(1, end - start),
        0,
        1
      );

      const rise = smoothstep(clamp(raw / 0.30, 0, 1));
      const fall = 1 - smoothstep(clamp((raw - 0.58) / 0.42, 0, 1));
      const amount = rise * fall;

      const targetY = centerPage - particleState.scrollY;

      return {
        amount,
        x: metric.x,
        y: clamp(targetY, particleState.height * 0.20, particleState.height * 0.80)
      };
    };

    const getActiveScene = () => {
      let best = {
        metric: null,
        points: [],
        amount: 0,
        x: 0,
        y: 0
      };

      sceneMetrics.forEach((metric) => {
        const state = getSceneState(sceneData[metric.key], metric);
        if (state.amount > best.amount) {
          best = {
            metric,
            points: sceneData[metric.key],
            ...state
          };
        }
      });

      return best;
    };

    const assignTargets = (points, centerX, centerY, scale) => {
      if (!points.length) return;

      const formationParticles = particles.filter((particle) => particle.formation);
      const pointCount = points.length;

      formationParticles.forEach((particle, index) => {
        const point = points[Math.min(
          pointCount - 1,
          Math.floor(index * pointCount / formationParticles.length)
        )];

        particle.tx = centerX + point.x * scale;
        particle.ty = centerY + point.y * scale;
        particle.tz = point.z || 0;
      });
    };

    const updateCanvasSize = () => {
      particleState.width = window.innerWidth;
      particleState.height = window.innerHeight;
      particleState.dpr = Math.min(window.devicePixelRatio || 1, 1.55);

      particleCanvas.width = Math.round(particleState.width * particleState.dpr);
      particleCanvas.height = Math.round(particleState.height * particleState.dpr);
      particleContext.setTransform(
        particleState.dpr,
        0,
        0,
        particleState.dpr,
        0,
        0
      );

      updateScrollBounds();
      rebuildParticles();

      sceneData.projects = makeController(
        particleState.width <= 768 ? 0.53 : 0.98
      );
      sceneData.contact = makeInfinity(
        particleState.width <= 768 ? 0.70 : 1.04
      );

      if (!logoLoaded) sceneData.about = buildFallbackLogo();
      loadLogoPoints();
    };

    const hexToRgb = (value) => {
      const match = String(value || "").trim().match(/^#([0-9a-f]{6})$/i);
      if (!match) return null;
      return [
        parseInt(match[1].slice(0, 2), 16),
        parseInt(match[1].slice(2, 4), 16),
        parseInt(match[1].slice(4, 6), 16)
      ];
    };

    const cssColorToRgb = (value, fallback) => {
      const hex = hexToRgb(value);
      if (hex) return hex;
      const match = String(value || "").match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
      );
      return match
        ? [Number(match[1]), Number(match[2]), Number(match[3])]
        : fallback;
    };

    const updatePalette = () => {
      const root = getComputedStyle(document.documentElement);
      particleState.palette.primary = cssColorToRgb(
        root.getPropertyValue("--text"),
        particleState.palette.primary
      );
      particleState.palette.secondary = cssColorToRgb(
        root.getPropertyValue("--accent"),
        particleState.palette.secondary
      );
      particleState.palette.tertiary = cssColorToRgb(
        root.getPropertyValue("--accent-2"),
        particleState.palette.tertiary
      );
    };

    const drawStar = (x, y, size, alpha, rgb, type, twinkle) => {
      const isTwinkle = type === 1 || type === 4;
      const pulse = 0.78 + Math.sin(twinkle) * 0.22;
      const glow = size * (isTwinkle ? 4.8 : 3.2) * pulse;

      const gradient = particleContext.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        glow
      );
      gradient.addColorStop(
        0,
        `rgba(${rgb.join(",")}, ${Math.min(0.42, alpha * 0.42)})`
      );
      gradient.addColorStop(1, `rgba(${rgb.join(",")}, 0)`);

      particleContext.fillStyle = gradient;
      particleContext.beginPath();
      particleContext.arc(x, y, glow, 0, Math.PI * 2);
      particleContext.fill();

      particleContext.fillStyle = `rgba(${rgb.join(",")}, ${Math.min(1, alpha * 1.15)})`;

      if (isTwinkle) {
        const spike = size * (type === 4 ? 5.0 : 3.6);
        particleContext.beginPath();
        particleContext.moveTo(x, y - spike);
        particleContext.lineTo(x + size * 0.72, y);
        particleContext.lineTo(x, y + spike);
        particleContext.lineTo(x - size * 0.72, y);
        particleContext.closePath();
        particleContext.fill();
      } else if (type === 2 || type === 5) {
        const d = size * 1.25;
        particleContext.save();
        particleContext.translate(x, y);
        particleContext.rotate(Math.PI / 4);
        particleContext.fillRect(-d / 2, -d / 2, d, d);
        particleContext.restore();
      } else {
        particleContext.beginPath();
        particleContext.arc(x, y, Math.max(0.55, size), 0, Math.PI * 2);
        particleContext.fill();
      }
    };

    const render = (now) => {
      const delta = Math.min(34, now - (particleState.lastTime || now));
      particleState.lastTime = now;

      particleContext.clearRect(
        0,
        0,
        particleState.width,
        particleState.height
      );

      particleState.smoothMouseX = lerp(
        particleState.smoothMouseX,
        particleState.mouseX,
        0.085
      );
      particleState.smoothMouseY = lerp(
        particleState.smoothMouseY,
        particleState.mouseY,
        0.085
      );

      const activeScene = getActiveScene();
      const formationAmount = activeScene.amount;

      if (formationAmount > 0.001) {
        assignTargets(
          activeScene.points,
          activeScene.x,
          activeScene.y,
          activeScene.metric.scale
        );
      }

      const mouseX = particleState.smoothMouseX;
      const mouseY = particleState.smoothMouseY;
      const mouseRadius = particleState.width <= 768 ? 0 : 150;

      particles.forEach((particle, index) => {
        particle.phase += particle.phaseSpeed * delta;

        if (!particleState.reducedMotion) {
          particle.baseX += particle.vx * delta;
          particle.baseY += particle.vy * delta;

          const marginX = particleState.width * 0.08;
          const marginY = particleState.height * 0.08;
          if (particle.baseX > particleState.width + marginX) particle.baseX = -marginX;
          if (particle.baseX < -marginX) particle.baseX = particleState.width + marginX;
          if (particle.baseY > particleState.height + marginY) particle.baseY = -marginY;
          if (particle.baseY < -marginY) particle.baseY = particleState.height + marginY;
        }

        let x = particle.baseX + Math.cos(particle.phase) * 0.75;
        let y = particle.baseY + Math.sin(particle.phase * 0.86) * 0.75;

        if (particle.formation && formationAmount > 0.001) {
          const strength = smoothstep(formationAmount);
          x = lerp(x, particle.tx, strength);
          y = lerp(y, particle.ty, strength);
        }

        if (mouseRadius > 0 && mouseX > -900) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 0.001) {
            const influence = Math.pow(1 - dist / mouseRadius, 2);
            const push = influence * (formationAmount > 0.18 ? 20 : 28);
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }

        const depth = particle.z * 5 + (formationAmount * particle.tz * 0.18);
        x += depth * 0.32;
        y += depth * 0.11;

        const primary = particleState.palette.primary;
        const secondary = particleState.palette.secondary;
        const tertiary = particleState.palette.tertiary;
        const hue = (Math.sin(index * 0.21 + now * 0.00018) + 1) / 2;
        const a = particle.hueMix > 0.52 ? secondary : primary;
        const b = particle.hueMix > 0.52 ? tertiary : secondary;
        const rgb = [
          Math.round(lerp(a[0], b[0], hue)),
          Math.round(lerp(a[1], b[1], hue)),
          Math.round(lerp(a[2], b[2], hue))
        ];

        const isFormation = particle.formation && formationAmount > 0.12;
        const alpha = clamp(
          particle.alpha * (isFormation ? 1.15 : 0.62) * (0.90 + formationAmount * 0.20),
          0.035,
          0.92
        );
        const size = particle.size * (isFormation ? 1.08 : 0.82);
        drawStar(
          x,
          y,
          size,
          alpha,
          rgb,
          particle.type,
          particle.phase * particle.twinkle
        );
      });

      if (!particleState.reducedMotion) {
        particleState.raf = window.requestAnimationFrame(render);
      }
    };

    const redrawStatic = () => {
      if (particleState.raf) {
        window.cancelAnimationFrame(particleState.raf);
        particleState.raf = 0;
      }
      particleState.lastTime = performance.now();
      render(particleState.lastTime);
    };

    const handleMouseMove = (event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      particleState.mouseX = event.clientX;
      particleState.mouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      particleState.mouseX = -1000;
      particleState.mouseY = -1000;
    };

    const handleScroll = () => {
      if (particleState.scrollTick) return;
      particleState.scrollTick = window.requestAnimationFrame(() => {
        particleState.scrollY = window.scrollY || window.pageYOffset || 0;
        particleState.scrollTick = 0;
      });
    };

    const handleResize = () => {
      window.clearTimeout(particleState.resizeTimer);
      particleState.resizeTimer = window.setTimeout(() => {
        logoLoaded = false;
        updateCanvasSize();
        if (particleState.reducedMotion) redrawStatic();
      }, 120);
    };

    const handleReducedMotionChange = (event) => {
      particleState.reducedMotion = event.matches;
      particleState.lastTime = performance.now();
      if (particleState.reducedMotion) {
        redrawStatic();
      } else if (!particleState.raf) {
        particleState.raf = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const themeObserver = new MutationObserver(updatePalette);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    updateCanvasSize();
    updatePalette();

    if (particleState.reducedMotion) {
      redrawStatic();
    } else {
      particleState.raf = window.requestAnimationFrame(render);
    }
  }

});
