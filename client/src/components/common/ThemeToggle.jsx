import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const currentTheme = () => document.documentElement.getAttribute("data-theme") || "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);

    setTimeout(() => root.classList.remove("theme-switching"), 350);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  );
}