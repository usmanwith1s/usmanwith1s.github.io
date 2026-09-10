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


  /* =========================
     MU PARTICLE FIELD
     ========================= */

  const particleCanvas = document.querySelector("#particleCanvas");
  const particleContext = particleCanvas ? particleCanvas.getContext("2d") : null;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (particleCanvas && particleContext) {
    const particleState = {
      width: 0,
      height: 0,
      dpr: 1,
      maxScroll: 1,
      scrollY: window.scrollY || 0,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      lastTime: 0,
      resizeTimer: 0,
      raf: 0,
      staticDrawn: false,
      reducedMotion: reducedMotionQuery.matches,
      palette: {
        primary: [255, 255, 255],
        secondary: [124, 92, 255],
        tertiary: [45, 212, 191]
      }
    };

    const particles = [];
    let logoPoints = [];

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    const smoothstep = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };

    const lerp = (a, b, amount) =>
      a + (b - a) * amount;

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
      const area = particleState.width * particleState.height;
      const mobile = particleState.width <= 768;
      const base = mobile ? 300 : 620;
      const scale = area / (1440 * 900);
      return clamp(Math.round(base * (0.72 + scale * 0.32)), mobile ? 220 : 480, mobile ? 420 : 760);
    };

    const createParticle = (index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random();
      const spread = Math.max(particleState.width, particleState.height) * (0.16 + distance * 0.62);

      return {
        index,
        x: Math.cos(angle) * spread,
        y: Math.sin(angle) * spread * 0.72,
        z: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0004 + Math.random() * 0.0008,
        size: 0.55 + Math.random() * 1.25,
        alpha: 0.18 + Math.random() * 0.55,
        hueMix: Math.random(),
        tx: 0,
        ty: 0,
        tz: 0
      };
    };

    const rebuildParticles = () => {
      const count = particleCount();
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push(createParticle(i));
      }

      assignTargets();
    };

    const assignTargets = () => {
      if (!logoPoints.length) {
        particles.forEach((particle) => {
          particle.tx = 0;
          particle.ty = 0;
          particle.tz = 0;
        });
        return;
      }

      particles.forEach((particle, index) => {
        const point = logoPoints[index % logoPoints.length];
        const jitter = ((index * 17) % 7 - 3) * 0.25;
        particle.tx = point.x + jitter;
        particle.ty = point.y - jitter * 0.4;
        particle.tz = point.z + (particle.z * 8);
      });
    };

    const fitLogoPoints = () => {
      const source = new Image();
      source.decoding = "async";
      source.src = "assets/images/usman-logo.png";

      source.onload = () => {
        const sourceWidth = Math.max(1, source.naturalWidth);
        const sourceHeight = Math.max(1, source.naturalHeight);
        const targetWidth = particleState.width <= 768 ? Math.min(250, particleState.width * 0.58) : Math.min(430, particleState.width * 0.34);
        const targetHeight = targetWidth * (sourceHeight / sourceWidth);

        const offscreen = document.createElement("canvas");
        const sampleSize = Math.max(2, Math.min(160, Math.round(targetWidth / 2.6)));
        offscreen.width = sampleSize;
        offscreen.height = Math.max(2, Math.round(sampleSize * (sourceHeight / sourceWidth)));

        const offscreenContext = offscreen.getContext("2d", { willReadFrequently: true });
        if (!offscreenContext) return;

        offscreenContext.clearRect(0, 0, offscreen.width, offscreen.height);
        offscreenContext.drawImage(source, 0, 0, offscreen.width, offscreen.height);

        let pixels;
        try {
          pixels = offscreenContext.getImageData(0, 0, offscreen.width, offscreen.height).data;
        } catch (error) {
          logoPoints = [];
          return;
        }

        const candidates = [];
        const threshold = 42;

        for (let y = 0; y < offscreen.height; y += 1) {
          for (let x = 0; x < offscreen.width; x += 1) {
            const alpha = pixels[(y * offscreen.width + x) * 4 + 3];
            if (alpha < threshold) continue;

            const nx = x / Math.max(1, offscreen.width - 1) - 0.5;
            const ny = y / Math.max(1, offscreen.height - 1) - 0.5;

            candidates.push({
              x: nx * targetWidth,
              y: ny * targetHeight,
              z: (alpha / 255) * 16 - 8
            });
          }
        }

        if (!candidates.length) {
          logoPoints = [];
          return;
        }

        const desired = clamp(
          particles.length * 0.72,
          particleState.width <= 768 ? 180 : 330,
          particleState.width <= 768 ? 360 : 560
        );
        const stride = Math.max(1, Math.floor(candidates.length / desired));
        logoPoints = candidates.filter((_, index) => index % stride === 0);

        assignTargets();
      };

      source.onerror = () => {
        logoPoints = [];
      };
    };

    const updateScrollBounds = () => {
      particleState.maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
    };

    const getScrollPhases = () => {
      const progress = clamp(
        particleState.scrollY / particleState.maxScroll,
        0,
        1
      );

      const formation = smoothstep(clamp((progress - 0.015) / 0.17, 0, 1));
      const dissolution = smoothstep(clamp((progress - 0.19) / 0.22, 0, 1));

      return {
        progress,
        formation,
        dissolution,
        ambient: clamp(dissolution, 0, 1)
      };
    };

    const getLogoCenter = () => ({
      x: particleState.width <= 768 ? particleState.width * 0.5 : particleState.width * 0.73,
      y: particleState.height <= 700 ? particleState.height * 0.40 : particleState.height * 0.48
    });

    const updateCanvasSize = () => {
      particleState.width = window.innerWidth;
      particleState.height = window.innerHeight;
      particleState.dpr = Math.min(window.devicePixelRatio || 1, 1.7);

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
      updatePalette();
      rebuildParticles();
      fitLogoPoints();
    };

    const drawParticle = (particle, index, phases, now) => {
      const center = getLogoCenter();
      const idleX = particle.x;
      const idleY = particle.y;

      particle.phase += particle.speed * (now - particleState.lastTime || 16);
      particle.x += particle.vx;
      particle.y += particle.vy;

      const maxX = particleState.width * 0.82;
      const maxY = particleState.height * 0.62;
      if (particle.x > maxX) particle.x = -maxX;
      if (particle.x < -maxX) particle.x = maxX;
      if (particle.y > maxY) particle.y = -maxY;
      if (particle.y < -maxY) particle.y = maxY;

      const driftX = particle.x + Math.cos(particle.phase) * 3.2;
      const driftY = particle.y + Math.sin(particle.phase * 0.88) * 3.2;

      let x = driftX;
      let y = driftY;
      let z = particle.z * 24;

      const formation = phases.formation;
      const dissolution = phases.dissolution;

      const targetX = center.x + particle.tx;
      const targetY = center.y + particle.ty;
      const targetZ = particle.tz;

      x = lerp(driftX, targetX, formation);
      y = lerp(driftY, targetY, formation);
      z = lerp(z, targetZ, formation);

      if (dissolution > 0) {
        const spread = 1 + dissolution * 4.8;
        const burstAngle = particle.phase + index * 0.0019;
        const burstRadiusX = (targetX - center.x) * spread;
        const burstRadiusY = (targetY - center.y) * spread;
        const swirl = dissolution * 38;

        const burstX = center.x +
          burstRadiusX +
          Math.cos(burstAngle) * swirl +
          (particle.x * 0.35);
        const burstY = center.y +
          burstRadiusY +
          Math.sin(burstAngle) * swirl +
          (particle.y * 0.35);

        x = lerp(x, burstX, dissolution);
        y = lerp(y, burstY, dissolution);
        z = lerp(z, particle.z * 54, dissolution);
      }

      const rotationY = particleState.targetMouseX * 0.055;
      const rotationX = particleState.targetMouseY * 0.045;

      const px = x - center.x;
      const py = y - center.y;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const rotatedX = px * cosY - z * sinY;
      const rotatedZ = px * sinY + z * cosY;
      const finalX = center.x + rotatedX;
      const finalY = center.y + (py * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX) * 0.11);

      const perspective = clamp(1 + rotatedZ / 800, 0.65, 1.38);
      const size = particle.size * perspective * (1 + formation * 0.6);

      const secondary = particleState.palette.secondary;
      const tertiary = particleState.palette.tertiary;
      const primary = particleState.palette.primary;
      const mix = (Math.sin(index * 0.13 + now * 0.00015) + 1) / 2;
      const colorA = particle.hueMix > 0.52 ? secondary : primary;
      const colorB = particle.hueMix > 0.52 ? tertiary : secondary;
      const r = Math.round(lerp(colorA[0], colorB[0], mix));
      const g = Math.round(lerp(colorA[1], colorB[1], mix));
      const b = Math.round(lerp(colorA[2], colorB[2], mix));

      const alphaBoost = formation * 0.28 + (1 - dissolution) * 0.08;
      const alpha = clamp(particle.alpha * (0.42 + alphaBoost), 0.04, 0.9);

      particleContext.beginPath();
      particleContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      particleContext.arc(finalX, finalY, size, 0, Math.PI * 2);
      particleContext.fill();

      if (formation > 0.55 && index % 13 === 0) {
        particleContext.beginPath();
        particleContext.fillStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${alpha * 0.22})`;
        particleContext.arc(finalX, finalY, size * 2.9, 0, Math.PI * 2);
        particleContext.fill();
      }

      particle.x = lerp(particle.x, idleX, 0.002);
      particle.y = lerp(particle.y, idleY, 0.002);
    };

    const render = (now) => {
      const delta = Math.min(34, now - (particleState.lastTime || now));
      particleState.lastTime = now;

      particleContext.clearRect(0, 0, particleState.width, particleState.height);

      const phases = getScrollPhases();
      const center = getLogoCenter();

      particleState.targetMouseX = lerp(
        particleState.targetMouseX,
        particleState.mouseX,
        0.05
      );
      particleState.targetMouseY = lerp(
        particleState.targetMouseY,
        particleState.mouseY,
        0.05
      );

      if (phases.formation > 0.45 && phases.dissolution < 0.85) {
        particleContext.beginPath();
        particleContext.strokeStyle = `rgba(${particleState.palette.secondary.join(",")}, ${0.055 * (1 - phases.dissolution)})`;
        particleContext.arc(center.x, center.y, 190 + phases.formation * 22, 0, Math.PI * 2);
        particleContext.lineWidth = 1;
        particleContext.stroke();
      }

      particles.forEach((particle, index) => {
        if (particleState.reducedMotion) {
          particle.x = lerp(particle.x, particle.x, 1);
          particle.y = lerp(particle.y, particle.y, 1);
        } else {
          particle.x += particle.vx * delta * 0.04;
          particle.y += particle.vy * delta * 0.04;
        }

        drawParticle(particle, index, phases, now);
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
      particleState.staticDrawn = true;
    };

    const handleMouseMove = (event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      particleState.mouseX = ((event.clientX / Math.max(1, particleState.width)) - 0.5) * 2;
      particleState.mouseY = ((event.clientY / Math.max(1, particleState.height)) - 0.5) * 2;
    };

    const handleScroll = () => {
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleResize = () => {
      window.clearTimeout(particleState.resizeTimer);
      particleState.resizeTimer = window.setTimeout(() => {
        updateCanvasSize();
        if (particleState.reducedMotion) redrawStatic();
      }, 90);
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const themeObserver = new MutationObserver(() => {
      updatePalette();
      if (particleState.reducedMotion) redrawStatic();
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    updateCanvasSize();

    if (particleState.reducedMotion) {
      redrawStatic();
    } else {
      particleState.raf = window.requestAnimationFrame(render);
    }
  }

});
