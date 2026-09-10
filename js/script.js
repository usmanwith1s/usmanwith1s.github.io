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
     MU PARTICLE CONSTELLATION
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
      mouseX: window.innerWidth * 0.5,
      mouseY: window.innerHeight * 0.5,
      targetMouseX: window.innerWidth * 0.5,
      targetMouseY: window.innerHeight * 0.5,
      lastTime: 0,
      resizeTimer: 0,
      raf: 0,
      reducedMotion: reducedMotionQuery.matches,
      palette: {
        primary: [255, 255, 255],
        secondary: [124, 92, 255],
        tertiary: [45, 212, 191]
      }
    };

    const particles = [];
    let logoPoints = [];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (a, b, amount) => a + (b - a) * amount;
    const smoothstep = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };
    const easeInOut = (value) => {
      const t = clamp(value, 0, 1);
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
      const match = String(value || "").match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : fallback;
    };

    const updatePalette = () => {
      const styles = getComputedStyle(document.documentElement);
      particleState.palette.primary = cssColorToRgb(styles.getPropertyValue("--text"), particleState.palette.primary);
      particleState.palette.secondary = cssColorToRgb(styles.getPropertyValue("--accent"), particleState.palette.secondary);
      particleState.palette.tertiary = cssColorToRgb(styles.getPropertyValue("--accent-2"), particleState.palette.tertiary);
    };

    const particleCount = () => {
      const mobile = particleState.width <= 768;
      const area = particleState.width * particleState.height;
      const base = mobile ? 360 : 760;
      const scale = area / (1440 * 900);
      return clamp(Math.round(base * (0.72 + scale * 0.34)), mobile ? 280 : 620, mobile ? 460 : 920);
    };

    const createParticle = (index) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random());
      const spreadX = particleState.width * 0.72;
      const spreadY = particleState.height * 0.72;

      return {
        index,
        x: (Math.random() - 0.5) * spreadX,
        y: (Math.random() - 0.5) * spreadY,
        vx: Math.cos(angle) * (0.012 + Math.random() * 0.028),
        vy: Math.sin(angle) * (0.012 + Math.random() * 0.028),
        orbit: radius,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.001,
        size: 0.65 + Math.random() * 1.45,
        alpha: 0.42 + Math.random() * 0.48,
        glow: 0.55 + Math.random() * 0.8,
        twinkle: Math.random() * Math.PI * 2,
        hueMix: Math.random(),
        tx: 0,
        ty: 0,
        tz: 0
      };
    };

    const rebuildParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount(); i += 1) particles.push(createParticle(i));
      assignTargets();
    };

    const assignTargets = () => {
      if (!logoPoints.length) return;
      particles.forEach((particle, index) => {
        const point = logoPoints[index % logoPoints.length];
        particle.tx = point.x + ((index % 5) - 2) * 0.18;
        particle.ty = point.y + ((index % 7) - 3) * 0.14;
        particle.tz = point.z + particle.orbit * 14;
      });
    };

    const loadLogo = () => {
      const source = new Image();
      source.decoding = "async";
      source.src = "assets/images/usman-logo.png";

      source.onload = () => {
        const ratio = source.naturalHeight / Math.max(1, source.naturalWidth);
        const targetWidth = particleState.width <= 768
          ? Math.min(290, particleState.width * 0.66)
          : Math.min(520, particleState.width * 0.38);
        const targetHeight = Math.max(2, Math.round(targetWidth * ratio));
        const sample = Math.min(190, Math.max(90, Math.round(targetWidth / 2.2)));
        const offscreen = document.createElement("canvas");
        offscreen.width = sample;
        offscreen.height = Math.max(2, Math.round(sample * ratio));
        const ctx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.clearRect(0, 0, offscreen.width, offscreen.height);
        ctx.drawImage(source, 0, 0, offscreen.width, offscreen.height);

        let pixels;
        try {
          pixels = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;
        } catch (error) {
          return;
        }

        const candidates = [];
        for (let y = 0; y < offscreen.height; y += 1) {
          for (let x = 0; x < offscreen.width; x += 1) {
            const alpha = pixels[(y * offscreen.width + x) * 4 + 3];
            if (alpha < 35) continue;
            candidates.push({
              x: (x / Math.max(1, offscreen.width - 1) - 0.5) * targetWidth,
              y: (y / Math.max(1, offscreen.height - 1) - 0.5) * targetHeight,
              z: (alpha / 255 - 0.5) * 18
            });
          }
        }

        if (!candidates.length) return;
        const wanted = clamp(Math.round(particles.length * 0.74), 420, 760);
        const stride = Math.max(1, Math.floor(candidates.length / wanted));
        logoPoints = candidates.filter((_, i) => i % stride === 0);
        assignTargets();
      };
    };

    const updateScrollBounds = () => {
      particleState.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
    };

    /* Three separate MU appearances across the page. Each one forms, glows,
       then dissolves before the next formation begins. */
    const getFormation = (progress) => {
      const spots = [
        { centerX: 0.76, centerY: 0.48, start: 0.015, end: 0.25 },
        { centerX: 0.28, centerY: 0.46, start: 0.335, end: 0.57 },
        { centerX: 0.70, centerY: 0.50, start: 0.66, end: 0.90 }
      ];

      let active = 0;
      let best = 0;
      spots.forEach((spot, index) => {
        const local = smoothstep((progress - spot.start) / (spot.end - spot.start));
        if (local > best) {
          best = local;
          active = index;
        }
      });

      const spot = spots[active];
      const local = clamp((progress - spot.start) / (spot.end - spot.start), 0, 1);
      const formation = smoothstep(Math.min(local / 0.42, 1));
      const dissolve = smoothstep(Math.max((local - 0.45) / 0.55, 0));
      const visibility = formation * (1 - dissolve);

      return {
        active,
        formation,
        dissolve,
        visibility,
        centerX: particleState.width * spot.centerX,
        centerY: particleState.height * spot.centerY
      };
    };

    const drawParticle = (particle, index, phase, now, delta) => {
      particle.phase += particle.speed * delta;
      if (!phase.visibility) {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
      }

      const fieldWidth = particleState.width * 0.58;
      const fieldHeight = particleState.height * 0.58;
      if (particle.x > fieldWidth) particle.x = -fieldWidth;
      if (particle.x < -fieldWidth) particle.x = fieldWidth;
      if (particle.y > fieldHeight) particle.y = -fieldHeight;
      if (particle.y < -fieldHeight) particle.y = fieldHeight;

      let x = particle.x + Math.cos(particle.phase) * 2.8;
      let y = particle.y + Math.sin(particle.phase * 0.83) * 2.8;
      let z = particle.orbit * 70;

      const targetX = phase.centerX + particle.tx;
      const targetY = phase.centerY + particle.ty;
      const logoPull = phase.visibility;
      x = lerp(x, targetX, logoPull);
      y = lerp(y, targetY, logoPull);
      z = lerp(z, particle.tz, logoPull);

      if (phase.dissolve > 0) {
        const spread = 1 + phase.dissolve * 7;
        const angle = particle.phase + index * 0.013;
        x = lerp(x, phase.centerX + particle.tx * spread + Math.cos(angle) * 120 * phase.dissolve, phase.dissolve);
        y = lerp(y, phase.centerY + particle.ty * spread + Math.sin(angle) * 90 * phase.dissolve, phase.dissolve);
        z = lerp(z, particle.orbit * 170, phase.dissolve);
      }

      /* Cursor force: nearby particles get pushed away, then smoothly settle
         back into the field/logo. This makes the star field feel alive. */
      const dx = x - particleState.targetMouseX;
      const dy = y - particleState.targetMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = 155;
      if (distance < radius && !particleState.reducedMotion) {
        const force = Math.pow(1 - distance / radius, 2) * 52;
        const safeDistance = Math.max(1, distance);
        x += (dx / safeDistance) * force;
        y += (dy / safeDistance) * force;
      }

      /* Very subtle 3D tilt around the cursor. */
      const tiltY = ((particleState.targetMouseX / Math.max(1, particleState.width)) - 0.5) * 0.13;
      const tiltX = ((particleState.targetMouseY / Math.max(1, particleState.height)) - 0.5) * -0.10;
      const relX = x - phase.centerX;
      const relY = y - phase.centerY;
      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);
      const rotatedX = relX * cosY - z * sinY;
      const rotatedZ = relX * sinY + z * cosY;
      const finalX = phase.centerX + rotatedX;
      const finalY = phase.centerY + relY * Math.cos(tiltX) - rotatedZ * Math.sin(tiltX) * 0.18;
      const perspective = clamp(1 + rotatedZ / 900, 0.62, 1.55);

      const pulse = 0.78 + Math.sin(now * 0.003 + particle.twinkle) * 0.22;
      const size = particle.size * perspective * pulse * (1 + phase.visibility * 0.55);
      const glow = particle.glow * (1 + phase.visibility * 1.9);
      const palette = particleState.palette;
      const colorA = particle.hueMix > 0.5 ? palette.secondary : palette.primary;
      const colorB = particle.hueMix > 0.5 ? palette.tertiary : palette.secondary;
      const mix = (Math.sin(index * 0.17 + now * 0.00018) + 1) * 0.5;
      const r = Math.round(lerp(colorA[0], colorB[0], mix));
      const g = Math.round(lerp(colorA[1], colorB[1], mix));
      const b = Math.round(lerp(colorA[2], colorB[2], mix));
      const alpha = clamp(particle.alpha * (0.72 + phase.visibility * 0.38) * pulse, 0.08, 1);

      /* Bulb-like halo + bright core. */
      const halo = particleContext.createRadialGradient(finalX, finalY, 0, finalX, finalY, size * 8 * glow);
      halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha * 0.95)})`);
      halo.addColorStop(0.12, `rgba(${r}, ${g}, ${b}, ${Math.min(0.78, alpha * 0.56)})`);
      halo.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${alpha * 0.16})`);
      halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      particleContext.fillStyle = halo;
      particleContext.beginPath();
      particleContext.arc(finalX, finalY, size * 8 * glow, 0, Math.PI * 2);
      particleContext.fill();

      particleContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      particleContext.beginPath();
      particleContext.arc(finalX, finalY, Math.max(0.85, size * 0.9), 0, Math.PI * 2);
      particleContext.fill();

      if (phase.visibility > 0.55 && index % 17 === 0) {
        particleContext.strokeStyle = `rgba(${palette.primary[0]}, ${palette.primary[1]}, ${palette.primary[2]}, ${alpha * 0.22})`;
        particleContext.lineWidth = 0.65;
        particleContext.beginPath();
        particleContext.moveTo(finalX - size * 5, finalY);
        particleContext.lineTo(finalX + size * 5, finalY);
        particleContext.moveTo(finalX, finalY - size * 5);
        particleContext.lineTo(finalX, finalY + size * 5);
        particleContext.stroke();
      }
    };

    const render = (now) => {
      const delta = Math.min(34, now - (particleState.lastTime || now));
      particleState.lastTime = now;
      particleContext.clearRect(0, 0, particleState.width, particleState.height);

      particleState.targetMouseX = lerp(particleState.targetMouseX, particleState.mouseX, 0.075);
      particleState.targetMouseY = lerp(particleState.targetMouseY, particleState.mouseY, 0.075);

      const progress = clamp(particleState.scrollY / particleState.maxScroll, 0, 1);
      const phase = getFormation(progress);

      /* Keep a quiet ambient field between logo appearances. */
      const vignette = particleContext.createRadialGradient(
        particleState.width * 0.5,
        particleState.height * 0.5,
        0,
        particleState.width * 0.5,
        particleState.height * 0.5,
        Math.max(particleState.width, particleState.height) * 0.65
      );
      vignette.addColorStop(0, "rgba(255,255,255,0.018)");
      vignette.addColorStop(1, "rgba(255,255,255,0)");
      particleContext.fillStyle = vignette;
      particleContext.fillRect(0, 0, particleState.width, particleState.height);

      particles.forEach((particle, index) => drawParticle(particle, index, phase, now, delta));

      if (!particleState.reducedMotion) particleState.raf = window.requestAnimationFrame(render);
    };

    const updateCanvasSize = () => {
      particleState.width = window.innerWidth;
      particleState.height = window.innerHeight;
      particleState.dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      particleCanvas.width = Math.round(particleState.width * particleState.dpr);
      particleCanvas.height = Math.round(particleState.height * particleState.dpr);
      particleCanvas.style.width = `${particleState.width}px`;
      particleCanvas.style.height = `${particleState.height}px`;
      particleContext.setTransform(particleState.dpr, 0, 0, particleState.dpr, 0, 0);
      updateScrollBounds();
      updatePalette();
      rebuildParticles();
      loadLogo();
    };

    const handleMouseMove = (event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      particleState.mouseX = event.clientX;
      particleState.mouseY = event.clientY;
    };

    const handleScroll = () => {
      particleState.scrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleResize = () => {
      window.clearTimeout(particleState.resizeTimer);
      particleState.resizeTimer = window.setTimeout(updateCanvasSize, 100);
    };

    const handleReducedMotionChange = (event) => {
      particleState.reducedMotion = event.matches;
      if (event.matches) {
        if (particleState.raf) window.cancelAnimationFrame(particleState.raf);
        particleState.raf = 0;
        render(performance.now());
      } else if (!particleState.raf) {
        particleState.lastTime = performance.now();
        particleState.raf = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    const themeObserver = new MutationObserver(updatePalette);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    updateCanvasSize();
    particleState.lastTime = performance.now();
    if (particleState.reducedMotion) render(particleState.lastTime);
    else particleState.raf = window.requestAnimationFrame(render);
  }

});
