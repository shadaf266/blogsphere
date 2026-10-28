import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header>
      <nav className="container navbar">
        <div className="logo-container">
          <button
            className="nav-toggle"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
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
          onClick={() => {
            setIsOpen(false);
          }}
          className={isOpen ? "nav-links open" : "nav-links"}
        >
          <NavLink to="/blogs">Explore</NavLink>
          <NavLink to="/blogs">Categories</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div className="nav-actions">
          <Link to="/login">Login</Link>
          <Link to="/blogs/create">Write</Link>
        </div>
      </nav>
    </header>
  );
}
