
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BlogCard from "../components/blog/BlogCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useFetch from "../hooks/useFetch.js";

const categories = [
  "Programming",
  "Design",
  "Technology",
  "Career",
  "Productivity",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Fetch featured articles
  const {
    data: featuredData,
    loading: fLoading,
    error: fError,
  } = useFetch("/blogs", {
    featured: true,
    limit: 3,
  });

  // Fetch latest articles
  const {
    data: latestData,
    meta,
    loading: rLoading,
    error: rError,
  } = useFetch("/blogs", {
    limit: 8,
  });

  // Ensure API data is always an array
  const featured = Array.isArray(featuredData)
    ? featuredData
    : [];

  const latest = Array.isArray(latestData)
    ? latestData
    : [];

  // Exclude featured articles from recent publications
  const featuredIds = new Set(
    featured.map((blog) => blog._id)
  );

  const recent = latest
    .filter((blog) => !featuredIds.has(blog._id))
    .slice(0, 5);

  // Search articles
  const handleSearch = (e) => {
    e.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) return;

    navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>
            Think. Write. Share. Inspire the Developer Community.
          </h1>

          <p>
            Discover a space where knowledge meets creativity.
            Explore insightful articles, share your experiences,
            learn from fellow developers, and turn your ideas into
            something meaningful. Whether you're sharing your
            journey or discovering something new, BlogSphere is
            where developers connect, grow, and inspire each other.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search articles"
            />

            <button type="submit">
              Search
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          <div className="hero-actions">
            <Link to="/blogs" className="btn btn-dark">
              Start Reading
            </Link>

            <Link to="/blogs/create" className="btn btn-outline">
              Write a Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="container section">
        <h2>Featured Articles</h2>

        {fLoading ? (
          <LoadingSpinner />
        ) : fError ? (
          <ErrorMessage message={fError} />
        ) : featured.length > 0 ? (
          <div className="blog-grid">
            {featured.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No featured articles available yet.
          </p>
        )}
      </section>

      {/* Trending Topics */}
      <section className="container section">
        <h2>Trending Topics</h2>

        <div className="pill-row">
          {categories.map((name) => (
            <Link
              key={name}
              to={`/blogs?category=${encodeURIComponent(name)}`}
              className="pill"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Publications */}
      <section className="container section">
        <h2>Recent Publications</h2>

        {rLoading ? (
          <LoadingSpinner />
        ) : rError ? (
          <ErrorMessage message={rError} />
        ) : recent.length > 0 ? (
          <div className="blog-grid">
            {recent.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            No recent articles available yet.
          </p>
        )}
      </section>

      {/* Statistics */}
      <section className="stats">
        <div className="container stats-inner">
          <div>
            <strong>{meta?.total ?? latest.length}</strong>
            <span>Articles</span>
          </div>

          <div>
            <strong>3</strong>
            <span>Writers</span>
          </div>

          <div>
            <strong>{categories.length}</strong>
            <span>Topics</span>
          </div>
        </div>
      </section>
    </>
  );
}
