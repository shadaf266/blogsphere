import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiChevronDown,
  FiCompass,
  FiEdit3,
  FiGrid,
  FiInfo,
  FiLayout,
  FiLogOut,
  FiMail,
  FiShield,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const closePanel = () => setPanelOpen(false);

  const handleLogout = () => {
    closePanel();
    logout();
    navigate("/");
  };

  const firstName = user ? user.name.split(" ")[0] : "";

  return (
    <header>
      <nav className="container navbar">
        <div className="logo-container">
          <button
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
          <Link to="/">
            <img src="/blogsphere-logo.svg" alt="BlogSphere" />
          </Link>
        </div>

        <div
          onClick={() => setIsOpen(false)}
          className={isOpen ? "nav-links open" : "nav-links"}
        >
          <NavLink to="/blogs" end>
            <FiCompass className="ni" /> Explore
          </NavLink>
          <Link to="/blogs">
            <FiGrid className="ni" /> Categories
          </Link>
          <NavLink to="/about">
            <FiInfo className="ni" /> About
          </NavLink>
          <NavLink to="/contact">
            <FiMail className="ni" /> Contact
          </NavLink>
        </div>

        <div className="nav-actions">
           <ThemeToggle />
          {user ? (
            <>
              <Link to="/blogs/create" className="nav-cta nav-write">
                <FiEdit3 className="ni" /> Write
              </Link>
              <button
                type="button"
                className="user-chip"
                onClick={() => setPanelOpen(true)}
                aria-label="Open account menu"
                aria-haspopup="dialog"
                aria-expanded={panelOpen}
              >
                <span className="nav-avatar">{user.name.charAt(0)}</span>
                <span className="user-chip-name">{firstName}</span>
                <FiChevronDown className="user-chip-arrow" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="nav-cta">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {user &&
        panelOpen &&
        createPortal(
          <div className="drawer-overlay" onClick={closePanel}>
            <aside
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Account menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-head">
                <span className="nav-avatar big">{user.name.charAt(0)}</span>
                <div className="drawer-user">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  {user.role === "admin" && <em className="role-tag">Admin</em>}
                </div>
                <button type="button" className="drawer-close" onClick={closePanel} aria-label="Close menu">
                  <FiX />
                </button>
              </div>

              <p className="drawer-label">Account</p>
              <nav className="drawer-links" onClick={closePanel}>
                <NavLink to="/dashboard">
                  <FiLayout className="ni" /> Dashboard
                </NavLink>
                <NavLink to="/blogs/create">
                  <FiEdit3 className="ni" /> Write an article
                </NavLink>
                <NavLink to="/bookmarks">
                  <FiBookmark className="ni" /> Reading list
                </NavLink>
              </nav>

              {user.role === "admin" && (
                <>
                  <p className="drawer-label">Administration</p>
                  <nav className="drawer-links" onClick={closePanel}>
                    <NavLink to="/admin">
                      <FiShield className="ni" /> Admin panel
                    </NavLink>
                  </nav>
                </>
              )}

              <button type="button" className="drawer-logout" onClick={handleLogout}>
                <FiLogOut className="ni" /> Log out
              </button>
            </aside>
          </div>,
          document.body
        )}
    </header>
  );
}