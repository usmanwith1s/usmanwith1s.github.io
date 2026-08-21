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

    themeToggle.textContent = isLight ? "☀" : "☾";

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
    ".navbar, .skill-card, .project-card, .experience-card, .portrait-glass"
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
});
