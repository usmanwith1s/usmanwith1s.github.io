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
});

