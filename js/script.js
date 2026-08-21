// Theme toggle
const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// Simple reveal on scroll
const revealItems = document.querySelectorAll(
  ".section, .skill-card, .project-card, .experience-card"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});
