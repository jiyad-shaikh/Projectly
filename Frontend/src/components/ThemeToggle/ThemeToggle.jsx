import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.scss";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle__icon">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}

export default ThemeToggle;