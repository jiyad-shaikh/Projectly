import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { getReceivedRequests } from "../../services/request.api";
import "./Sidebar.scss";

function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  useEffect(() => {
  let isMounted = true;

  const loadPendingRequestCount = async () => {
    try {
      const response = await getReceivedRequests();

      if (!isMounted) return;

      const pendingCount = (response.requests || []).filter(
        (request) => request.status?.toLowerCase() === "pending"
      ).length;

      setPendingRequestCount(pendingCount);
    } catch (error) {
      console.error(
        "Failed to load pending request count:",
        error
      );

      if (isMounted) {
        setPendingRequestCount(0);
      }
    }
  };

  loadPendingRequestCount();

  return () => {
    isMounted = false;
  };
}, []);

  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserMenu = () => {
    setUserMenuOpen((previous) => !previous);
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${
          isOpen ? "sidebar-overlay--visible" : ""
        }`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>

        {/* ==============================
            LOGO
        ============================== */}

        <div className="sidebar__logo">

          <div className="sidebar__logo-mark">
            P
          </div>

          <div>
            <h2>Projectly</h2>
            <span>Partner Finder</span>
          </div>

          <button
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>

        </div>


        {/* ==============================
            NAVIGATION
        ============================== */}

        <nav className="sidebar__nav">

          <p className="sidebar__section-title">
            MENU
          </p>

          <NavLink
            to="/dashboard"
            className="sidebar__link"
            onClick={onClose}
          >
            <span className="sidebar__link-icon">⌂</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/projects"
            className="sidebar__link"
            onClick={onClose}
          >
            <span className="sidebar__link-icon">◫</span>
            Find Projects
          </NavLink>


          <NavLink
            to="/my-projects"
            className="sidebar__link"
            onClick={onClose}
          >
            <span className="sidebar__link-icon">▣</span>
            My Projects
          </NavLink>


          <NavLink
            to="/requests"
            className="sidebar__link"
            onClick={onClose}
          >
            <span className="sidebar__link-icon">♢</span>

            <span className="sidebar__link-text">
              Requests
            </span>

            {pendingRequestCount > 0 && (
              <span className="sidebar__nav-badge">
                {pendingRequestCount}
              </span>
            )}
          </NavLink>


          <p className="sidebar__section-title sidebar__section-title--bottom">
            ACCOUNT
          </p>


          <NavLink
            to="/profile"
            className="sidebar__link"
            onClick={onClose}
          >
            <span className="sidebar__link-icon">◯</span>
            Profile
          </NavLink>

        </nav>


        {/* ==============================
            THEME SWITCHER
        ============================== */}

        <div className="sidebar__theme">

          <div className="sidebar__theme-info">

            <div className="sidebar__theme-icon">
              {isDark ? "☾" : "☀"}
            </div>

            <div>
              <strong>
                {isDark ? "Dark mode" : "Light mode"}
              </strong>

              <span>
                {isDark
                  ? "Easy on the eyes"
                  : "Bright & clean"}
              </span>
            </div>

          </div>


          <button
            className={`sidebar__theme-toggle ${
              isDark
                ? "sidebar__theme-toggle--dark"
                : ""
            }`}
            onClick={toggleTheme}
            aria-label={`Switch to ${
              isDark ? "light" : "dark"
            } mode`}
            aria-pressed={isDark}
          >
            <span className="sidebar__theme-toggle-thumb">
              {isDark ? "☾" : "☀"}
            </span>
          </button>

        </div>


        {/* ==============================
            USER
        ============================== */}

        <div className="sidebar__user">

          <div className="sidebar__avatar">
            JS
          </div>

          <div className="sidebar__user-info">
            <strong>
              Jiyad Shaikh
            </strong>

            <span>
              Student
            </span>
          </div>


          {/* USER MENU */}

          <div className="sidebar__user-menu-wrapper">

            <button
              className={`sidebar__user-menu ${
                userMenuOpen
                  ? "sidebar__user-menu--active"
                  : ""
              }`}
              aria-label="Open user menu"
              aria-expanded={userMenuOpen}
              onClick={handleUserMenu}
            >
              ⋯
            </button>


            {userMenuOpen && (
              <div className="sidebar__dropdown">

                <button
                  className="sidebar__dropdown-item sidebar__dropdown-item--logout"
                  onClick={handleLogout}
                >
                  <span>↪</span>
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;