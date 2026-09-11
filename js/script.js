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
