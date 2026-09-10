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
     MU + GAMING + CONTACT STAR FIELD
     Clean formations tied to real page sections.
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
      targetMouseX: -1000,
      targetMouseY: -1000,
      lastTime: 0,
      resizeTimer: 0,
      scrollTick: 0,
      raf: 0,
      reducedMotion: reducedMotionQuery.matches,
      palette: {
        primary: [255, 255, 255],
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

    const aboutSection = document.querySelector("#about");
    const projectsSection = document.querySelector("#projects");
    const contactSection = document.querySelector("#contact");

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    const smoothstep = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };

    const lerp = (a, b, amount) =>
      a + (b - a) * amount;

    const distance = (x1, y1, x2, y2) =>
      Math.hypot(x1 - x2, y1 - y2);

    const hexToRgb = (value) => {
      const hex = String(value || "").trim();
      const match = hex.match(/^#([0-9a-f]{6})$/i);
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

      if (match) {
        return [
          Number(match[1]),
          Number(match[2]),
          Number(match[3])
        ];
      }

      return fallback;
    };

    const updatePalette = () => {
      const styles = getComputedStyle(document.documentElement);

      particleState.palette.primary = cssColorToRgb(
        styles.getPropertyValue("--text"),
        particleState.palette.primary
      );

      particleState.palette.secondary = cssColorToRgb(
        styles.getPropertyValue("--accent"),
        particleState.palette.secondary
      );

      particleState.palette.tertiary = cssColorToRgb(
        styles.getPropertyValue("--accent-2"),
        particleState.palette.tertiary
      );
    };

    const particleCount = () => {
      const mobile = particleState.width <= 768;
      const areaScale =
        (particleState.width * particleState.height) /
        (1440 * 900);

      if (mobile) {
        return clamp(Math.round(180 + areaScale * 90), 170, 255);
      }

      return clamp(Math.round(390 + areaScale * 140), 390, 570);
    };

    const createParticle = (index) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random();
      const spread = Math.max(
        particleState.width,
        particleState.height
      ) * (0.18 + radius * 0.66);

      const activeSeed =
        Math.sin(index * 12.9898) * 43758.5453;
      const active =
        activeSeed - Math.floor(activeSeed) <
        (particleState.width <= 768 ? 0.56 : 0.50);

      return {
        baseX: particleState.width * 0.5 + Math.cos(angle) * spread,
        baseY: particleState.height * 0.5 + Math.sin(angle) * spread * 0.72,
        vx: (Math.random() - 0.5) * 0.085,
        vy: (Math.random() - 0.5) * 0.085,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.00035 + Math.random() * 0.00055,
        z: Math.random() * 2 - 1,
        size: 0.38 + Math.random() * 0.52,
        alpha: 0.18 + Math.random() * 0.52,
        hueMix: Math.random(),
        active,
        tx: 0,
        ty: 0,
        tz: 0
      };
    };

    const setParticleCount = () => {
      particles.length = 0;
      const count = particleCount();

      for (let index = 0; index < count; index += 1) {
        particles.push(createParticle(index));
      }
    };

    const makeOval = (cx, cy, rx, ry, count) => {
      const points = [];

      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        points.push({
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry,
          z: Math.sin(angle * 2) * 5
        });
      }

      return points;
    };

    const makeLine = (x1, y1, x2, y2, count) => {
      const points = [];

      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0 : i / (count - 1);
        points.push({
          x: lerp(x1, x2, t),
          y: lerp(y1, y2, t),
          z: Math.sin(t * Math.PI) * 4
        });
      }

      return points;
    };

    const makeGameController = (scale) => {
      const points = [];
      const w = 150 * scale;
      const h = 76 * scale;
      const x = 0;
      const y = 0;

      const outline = [];
      const segments = 56;

      for (let i = 0; i < segments; i += 1) {
        const t = i / (segments - 1);
        let px;
        let py;

        if (t < 0.25) {
          const a = t / 0.25;
          px = -w * 0.50 + a * w * 0.12;
          py = h * 0.18 - Math.sin(a * Math.PI) * h * 0.05;
        } else if (t < 0.50) {
          const a = (t - 0.25) / 0.25;
          px = -w * 0.38 + a * w * 0.76;
          py = -h * 0.28 - Math.sin(a * Math.PI) * h * 0.04;
        } else if (t < 0.75) {
          const a = (t - 0.50) / 0.25;
          px = w * 0.38 - a * w * 0.12;
          py = -h * 0.28 + Math.sin(a * Math.PI) * h * 0.05;
        } else {
          const a = (t - 0.75) / 0.25;
          px = w * 0.26 - a * w * 0.76;
          py = h * 0.18 + Math.sin(a * Math.PI) * h * 0.02;
        }

        outline.push({ x: x + px, y: y + py, z: 0 });
      }

      points.push(...outline);

      // D-pad
      points.push(...makeLine(-39 * scale, -1 * scale, -18 * scale, -1 * scale, 10));
      points.push(...makeLine(-28.5 * scale, -11.5 * scale, -28.5 * scale, 9.5 * scale, 10));

      // Face buttons
      points.push(...makeOval(34 * scale, -6 * scale, 6 * scale, 6 * scale, 12));
      points.push(...makeOval(49 * scale, 7 * scale, 6 * scale, 6 * scale, 12));
      points.push(...makeOval(19 * scale, 8 * scale, 6 * scale, 6 * scale, 12));
      points.push(...makeOval(46 * scale, -20 * scale, 6 * scale, 6 * scale, 12));

      // Center lights / buttons
      points.push(...makeOval(0, 5 * scale, 10 * scale, 3.8 * scale, 14));
      points.push(...makeOval(-1 * scale, -7 * scale, 8 * scale, 2.5 * scale, 10));

      return points;
    };

    const makeContactMark = (scale) => {
      const points = [];
      const w = 148 * scale;
      const h = 104 * scale;
      const left = -w / 2;
      const top = -h / 2;
      const right = w / 2;
      const bottom = h / 2;

      // Speech bubble, deliberately asymmetric and more organic than a basic icon.
      points.push(...makeLine(left + 20 * scale, top, right - 20 * scale, top, 34));
      points.push(...makeLine(right, top + 18 * scale, right, bottom - 24 * scale, 24));
      points.push(...makeLine(right - 18 * scale, bottom, left + 33 * scale, bottom, 26));
      points.push(...makeLine(left + 16 * scale, bottom - 22 * scale, left, bottom - 54 * scale, 16));
      points.push(...makeLine(left, bottom - 54 * scale, left, top + 18 * scale, 20));
      points.push(...makeLine(left, top + 18 * scale, left + 20 * scale, top, 12));

      // Three connection nodes.
      points.push(...makeOval(-37 * scale, 9 * scale, 5 * scale, 5 * scale, 12));
      points.push(...makeOval(-9 * scale, 9 * scale, 5 * scale, 5 * scale, 12));
      points.push(...makeOval(19 * scale, 9 * scale, 5 * scale, 5 * scale, 12));
      points.push(...makeLine(-32 * scale, 9 * scale, -14 * scale, 9 * scale, 9));
      points.push(...makeLine(-4 * scale, 9 * scale, 14 * scale, 9 * scale, 9));

      // Spark crossing the bubble corner — the final "let's build" signature.
      points.push(...makeLine(27 * scale, 27 * scale, 45 * scale, 3 * scale, 13));
      points.push(...makeLine(45 * scale, 3 * scale, 31 * scale, 3 * scale, 8));
      points.push(...makeLine(31 * scale, 3 * scale, 27 * scale, 27 * scale, 13));

      return points;
    };

    const buildFallbackLogo = () => {
      const points = [];
      const scale = particleState.width <= 768 ? 0.68 : 1;

      // Clean geometric fallback for "MU".
      const addM = (offsetX) => {
        points.push(...makeLine(offsetX - 46 * scale, -45 * scale, offsetX - 46 * scale, 45 * scale, 22));
        points.push(...makeLine(offsetX - 46 * scale, -45 * scale, offsetX, 0, 18));
        points.push(...makeLine(offsetX, 0, offsetX + 46 * scale, -45 * scale, 18));
        points.push(...makeLine(offsetX + 46 * scale, -45 * scale, offsetX + 46 * scale, 45 * scale, 22));
      };

      const addU = (offsetX) => {
        points.push(...makeLine(offsetX - 42 * scale, -45 * scale, offsetX - 42 * scale, 28 * scale, 22));
        points.push(...makeOval(offsetX, 28 * scale, 42 * scale, 17 * scale, 28));
        points.push(...makeLine(offsetX + 42 * scale, 28 * scale, offsetX + 42 * scale, -45 * scale, 22));
      };

      addM(-58 * scale);
      addU(66 * scale);
      return points;
    };

    const loadLogoPoints = () => {
      const source = new Image();
      source.decoding = "async";
      source.src = "assets/images/usman-logo.png";

      source.onload = () => {
        const sourceWidth = Math.max(1, source.naturalWidth);
        const sourceHeight = Math.max(1, source.naturalHeight);
        const mobile = particleState.width <= 768;
        const targetWidth = mobile ? 168 : 270;
        const sampleWidth = mobile ? 105 : 145;
        const sampleHeight = Math.max(
          2,
          Math.round(sampleWidth * (sourceHeight / sourceWidth))
        );

        const offscreen = document.createElement("canvas");
        offscreen.width = sampleWidth;
        offscreen.height = sampleHeight;

        const context = offscreen.getContext("2d", {
          willReadFrequently: true
        });

        if (!context) return;

        context.clearRect(0, 0, sampleWidth, sampleHeight);
        context.drawImage(source, 0, 0, sampleWidth, sampleHeight);

        let pixels;
        try {
          pixels = context.getImageData(
            0,
            0,
            sampleWidth,
            sampleHeight
          ).data;
        } catch (error) {
          sceneData.about = buildFallbackLogo();
          return;
        }

        const candidates = [];

        for (let y = 0; y < sampleHeight; y += 1) {
          for (let x = 0; x < sampleWidth; x += 1) {
            const alpha = pixels[
              (y * sampleWidth + x) * 4 + 3
            ];

            if (alpha < 90) continue;

            const nx = x / Math.max(1, sampleWidth - 1) - 0.5;
            const ny = y / Math.max(1, sampleHeight - 1) - 0.5;

            candidates.push({
              x: nx * targetWidth,
              y: ny * targetWidth * (sampleHeight / sampleWidth),
              z: (alpha / 255 - 0.5) * 8
            });
          }
        }

        if (!candidates.length) {
          sceneData.about = buildFallbackLogo();
          return;
        }

        const maxPoints = mobile ? 125 : 205;
        const stride = Math.max(
          1,
          Math.ceil(candidates.length / maxPoints)
        );

        sceneData.about = candidates.filter(
          (_, index) => index % stride === 0
        );
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
      const viewport = particleState.height;

      sceneMetrics = [
        {
          key: "about",
          top: pageTop(aboutSection),
          lead: mobile ? viewport * 0.19 : viewport * 0.27,
          x: mobile ? particleState.width * 0.50 : particleState.width * 0.78,
          scale: mobile ? 0.74 : 1
        },
        {
          key: "projects",
          top: pageTop(projectsSection),
          lead: mobile ? viewport * 0.18 : viewport * 0.20,
          x: mobile ? particleState.width * 0.50 : particleState.width * 0.76,
          scale: mobile ? 0.62 : 0.92
        },
        {
          key: "contact",
          top: pageTop(contactSection),
          lead: mobile ? viewport * 0.20 : viewport * 0.22,
          x: mobile ? particleState.width * 0.50 : particleState.width * 0.77,
          scale: mobile ? 0.64 : 0.94
        }
      ];
    };

    const updateScrollBounds = () => {
      particleState.maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
      refreshSceneMetrics();
    };

    const getSceneState = (scene, metric) => {
      if (!metric || !scene.length) {
        return { amount: 0, x: 0, y: 0 };
      }

      const mobile = particleState.width <= 768;
      const start = metric.top - particleState.height * 0.58;
      const end = metric.top + particleState.height * (mobile ? 0.52 : 0.70);
      const raw = clamp(
        (particleState.scrollY - start) / Math.max(1, end - start),
        0,
        1
      );

      // A focused window: particles gather, hold, then dissolve before content gets busy.
      const amount =
        smoothstep(clamp(raw / 0.32, 0, 1)) *
        (1 - smoothstep(clamp((raw - 0.58) / 0.42, 0, 1)));

      const targetY =
        metric.top - particleState.scrollY + metric.lead;

      return {
        amount,
        x: metric.x,
        y: clamp(targetY, particleState.height * 0.16, particleState.height * 0.78)
      };
    };

    const getActiveScene = () => {
      const candidates = sceneMetrics.map((metric) => {
        const points = sceneData[metric.key];
        const state = getSceneState(points, metric);
        return {
          metric,
          points,
          ...state
        };
      });

      return candidates.reduce(
        (best, current) =>
          current.amount > best.amount ? current : best,
        { metric: null, points: [], amount: 0, x: 0, y: 0 }
      );
    };

    const assignTargets = (points, centerX, centerY, scale) => {
      if (!points.length) return;

      particles.forEach((particle, index) => {
        const point = points[index % points.length];
        const jitter = particle.active ? 0.45 : 0;

        particle.tx = centerX + point.x * scale +
          (Math.sin(index * 1.73) * jitter);
        particle.ty = centerY + point.y * scale +
          (Math.cos(index * 1.17) * jitter);
        particle.tz = point.z || 0;
      });
    };

    const updateCanvasSize = () => {
      particleState.width = window.innerWidth;
      particleState.height = window.innerHeight;
      particleState.dpr = Math.min(
        window.devicePixelRatio || 1,
        1.55
      );

      particleCanvas.width = Math.round(
        particleState.width * particleState.dpr
      );
      particleCanvas.height = Math.round(
        particleState.height * particleState.dpr
      );

      particleContext.setTransform(
        particleState.dpr,
        0,
        0,
        particleState.dpr,
        0,
        0
      );

      updateScrollBounds();
      updatePalette();
      setParticleCount();

      sceneData.projects = makeGameController(
        particleState.width <= 768 ? 0.72 : 0.95
      );
      sceneData.contact = makeContactMark(
        particleState.width <= 768 ? 0.62 : 0.92
      );

      if (!logoLoaded) {
        sceneData.about = buildFallbackLogo();
      }

      loadLogoPoints();
    };

    const drawStar = (x, y, size, alpha, rgb, glowing) => {
      const glow = size * (glowing ? 4.2 : 2.2);

      particleContext.beginPath();
      particleContext.fillStyle = `rgba(${rgb.join(",")}, ${alpha * 0.12})`;
      particleContext.arc(x, y, glow, 0, Math.PI * 2);
      particleContext.fill();

      particleContext.beginPath();
      particleContext.fillStyle = `rgba(${rgb.join(",")}, ${Math.min(1, alpha * 1.18)})`;
      particleContext.arc(x, y, size, 0, Math.PI * 2);
      particleContext.fill();
    };

    const render = (now) => {
      const delta = Math.min(
        34,
        now - (particleState.lastTime || now)
      );
      particleState.lastTime = now;

      particleContext.clearRect(
        0,
        0,
        particleState.width,
        particleState.height
      );

      particleState.targetMouseX = lerp(
        particleState.targetMouseX,
        particleState.mouseX,
        0.10
      );
      particleState.targetMouseY = lerp(
        particleState.targetMouseY,
        particleState.mouseY,
        0.10
      );

      const activeScene = getActiveScene();
      const formationAmount = activeScene.amount;

      if (formationAmount > 0.001 && activeScene.points.length) {
        assignTargets(
          activeScene.points,
          activeScene.x,
          activeScene.y,
          activeScene.metric.scale
        );
      }

      particles.forEach((particle, index) => {
        particle.phase += particle.phaseSpeed * delta;

        if (!particleState.reducedMotion) {
          particle.baseX += particle.vx * delta * 0.035;
          particle.baseY += particle.vy * delta * 0.035;

          const xLimit = particleState.width * 0.15;
          const yLimit = particleState.height * 0.15;

          if (particle.baseX > particleState.width + xLimit) particle.baseX = -xLimit;
          if (particle.baseX < -xLimit) particle.baseX = particleState.width + xLimit;
          if (particle.baseY > particleState.height + yLimit) particle.baseY = -yLimit;
          if (particle.baseY < -yLimit) particle.baseY = particleState.height + yLimit;
        }

        let x = particle.baseX + Math.cos(particle.phase) * 2.0;
        let y = particle.baseY + Math.sin(particle.phase * 0.9) * 2.0;

        if (formationAmount > 0.001 && particle.active) {
          x = lerp(x, particle.tx, formationAmount);
          y = lerp(y, particle.ty, formationAmount);
        }

        // Gentle cursor repulsion. The cursor never grabs the formation; it only bends it.
        const cursorDistance = distance(
          x,
          y,
          particleState.targetMouseX,
          particleState.targetMouseY
        );

        const repelRadius = 112;

        if (
          cursorDistance < repelRadius &&
          particleState.targetMouseX > -900
        ) {
          const safeDistance = Math.max(cursorDistance, 1);
          const strength =
            Math.pow(1 - safeDistance / repelRadius, 2) *
            (formationAmount > 0.12 ? 13 : 18);

          x +=
            ((x - particleState.targetMouseX) / safeDistance) *
            strength;
          y +=
            ((y - particleState.targetMouseY) / safeDistance) *
            strength;
        }

        // Tiny parallax in depth, never enough to make the shape messy.
        const depth = particle.z * 6 +
          (formationAmount * particle.tz);
        const parallaxX = depth * 0.35;
        const parallaxY = depth * 0.12;

        x += parallaxX;
        y += parallaxY;

        const secondary = particleState.palette.secondary;
        const tertiary = particleState.palette.tertiary;
        const primary = particleState.palette.primary;
        const mix =
          (Math.sin(index * 0.17 + now * 0.00013) + 1) / 2;
        const colorA = particle.hueMix > 0.48 ? secondary : primary;
        const colorB = particle.hueMix > 0.48 ? tertiary : secondary;

        const rgb = [
          Math.round(lerp(colorA[0], colorB[0], mix)),
          Math.round(lerp(colorA[1], colorB[1], mix)),
          Math.round(lerp(colorA[2], colorB[2], mix))
        ];

        const sceneBoost = formationAmount * 0.34;
        const alpha = clamp(
          particle.alpha * (0.50 + sceneBoost),
          0.05,
          0.82
        );

        const size =
          particle.size *
          (formationAmount > 0.15 && particle.active ? 1.12 : 1);

        drawStar(
          x,
          y,
          size,
          alpha,
          rgb,
          particle.active &&
            (formationAmount > 0.25 || index % 11 === 0)
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
        particleState.scrollY =
          window.scrollY || window.pageYOffset || 0;
        particleState.scrollTick = 0;
      });
    };

    const handleResize = () => {
      window.clearTimeout(particleState.resizeTimer);
      particleState.resizeTimer = window.setTimeout(() => {
        logoLoaded = false;
        updateCanvasSize();

        if (particleState.reducedMotion) {
          redrawStatic();
        }
      }, 100);
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

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true
    });
    window.addEventListener("mouseleave", handleMouseLeave, {
      passive: true
    });
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    window.addEventListener("resize", handleResize, {
      passive: true
    });

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener(
        "change",
        handleReducedMotionChange
      );
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const themeObserver = new MutationObserver(() => {
      updatePalette();
    });

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
