
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  FiBookmark,
  FiCompass,
  FiEdit3,
  FiGrid,
  FiInfo,
  FiLayout,
  FiLogOut,
  FiMail,
  FiMenu,
  FiShield,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

const navItems = [
  { to: "/blogs", label: "Explore", icon: FiCompass, end: true },
  { to: "/categories", label: "Categories", icon: FiGrid },
  { to: "/about", label: "About", icon: FiInfo },
  { to: "/contact", label: "Contact", icon: FiMail },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const closePanel = () => setPanelOpen(false);

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Account";
  const avatarLetter = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // Close menus when route changes
  useEffect(() => {
    closeMenu();
    closePanel();
  }, [location.pathname, location.search]);

  // Handle Escape key and prevent background scrolling
  useEffect(() => {
    if (!isOpen && !panelOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMenu();
        closePanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, panelOpen]);

  const handleLogout = async () => {
    closeMenu();
    closePanel();

    await logout();
    navigate("/");
  };

  const renderNavLinks = (mobile = false) => (
    navItems.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={label}
        to={to}
        end={end}
        onClick={mobile ? closeMenu : undefined}
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <Icon className="ni" />
        <span>{label}</span>
      </NavLink>
    ))
  );

  return (
    <header className="site-header">
      <nav className="container navbar" aria-label="Main navigation">

        {/* Logo */}
        <div className="logo-container">
          <Link to="/" onClick={closeMenu} aria-label="BlogSphere home">
            <img
              src="/blogsphere-logo.svg"
              alt="BlogSphere"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          {renderNavLinks()}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions desktop-actions">
          <ThemeToggle />

          {user ? (
            <>
              <Link to="/blogs/create" className="nav-cta nav-write">
                <FiEdit3 />
                <span>Write</span>
              </Link>

              <button
                type="button"
                className="user-chip"
                onClick={() => setPanelOpen(true)}
                aria-label="Open account menu"
                aria-haspopup="dialog"
                aria-expanded={panelOpen}
              >
                <span className="nav-avatar">{avatarLetter}</span>
                <span className="user-chip-name">{firstName}</span>
                <span className="user-chip-arrow">⌄</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Login
              </Link>

              <Link to="/register" className="nav-cta">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`mobile-menu ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="mobile-menu-inner">

          <div className="mobile-menu-top">
            <span>Navigation</span>
         </div>

          <div className="mobile-nav-links">
            {renderNavLinks(true)}
          </div>

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-actions">

            <div className="mobile-theme">
              <span>Appearance</span>
              <ThemeToggle />
            </div>

            {user ? (
              <>
                <Link
                  to="/blogs/create"
                  className="nav-cta mobile-write"
                  onClick={closeMenu}
                >
                  <FiEdit3 />
                  Write an article
                </Link>

                <button
                  type="button"
                  className="mobile-account"
                  onClick={() => {
                    closeMenu();
                    setPanelOpen(true);
                  }}
                >
                  <span className="nav-avatar">{avatarLetter}</span>

                  <span>
                    <strong>{firstName}</strong>
                    <small>View account</small>
                  </span>
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link
                  to="/login"
                  className="nav-login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="nav-cta"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Drawer */}
      {user && panelOpen &&
        createPortal(
          <div
            className="drawer-overlay"
            onClick={closePanel}
          >
            <aside
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Account menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-head">

                <span className="nav-avatar big">
                  {avatarLetter}
                </span>

                <div className="drawer-user">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>

                  {user.role === "admin" && (
                    <em className="role-tag">Admin</em>
                  )}
                </div>

                <button
                  type="button"
                  className="drawer-close"
                  onClick={closePanel}
                  aria-label="Close account menu"
                >
                  <FiX />
                </button>
              </div>

              <p className="drawer-label">Account</p>

              <nav className="drawer-links" onClick={closePanel}>
                <NavLink to="/dashboard">
                  <FiLayout className="ni" />
                  Dashboard
                </NavLink>

                <NavLink to="/blogs/create">
                  <FiEdit3 className="ni" />
                  Write an article
                </NavLink>

                <NavLink to="/bookmarks">
                  <FiBookmark className="ni" />
                  Reading list
                </NavLink>
              </nav>

              {user.role === "admin" && (
                <>
                  <p className="drawer-label">Administration</p>

                  <nav className="drawer-links" onClick={closePanel}>
                    <NavLink to="/admin">
                      <FiShield className="ni" />
                      Admin panel
                    </NavLink>
                  </nav>
                </>
              )}

              <button
                type="button"
                className="drawer-logout"
                onClick={handleLogout}
              >
                <FiLogOut className="ni" />
                Log out
              </button>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
}
