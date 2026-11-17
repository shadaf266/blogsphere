import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useFetch from "../hooks/useFetch.js";

const categories = ["Programming", "Design", "Technology", "Career", "Productivity"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: featured, loading: fLoading, error: fError } = useFetch("/blogs", {
    featured: true,
    limit: 3,
  });
  const { data: latest, meta, loading: rLoading, error: rError } = useFetch("/blogs", {
    limit: 8,
  });

  const featuredIds = new Set((featured || []).map((b) => b._id));
  const recent = (latest || []).filter((b) => !featuredIds.has(b._id)).slice(0, 5);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/blogs?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Think. Write. Share. Inspire the Developer Community.</h1>
          <p>Discover a space where knowledge meets creativity. Explore insightful articles, share your experiences, learn from fellow developers, and turn your ideas into something meaningful. Whether you're sharing your journey or discovering something new, BlogSphere is where developers connect, grow, and inspire each other.</p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search <svg
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
  </svg></button>
          </form>

          <div className="hero-actions">
            <Link to="/blogs" className="btn btn-dark">Start Reading</Link>
            <Link to="/blogs/create" className="btn btn-outline">Write a Story</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Featured Articles</h2>
        {fLoading ? (
          <LoadingSpinner />
        ) : fError ? (
          <ErrorMessage message={fError} />
        ) : (
          <div className="blog-grid">
            {featured.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <h2>Trending Topics</h2>
        <div className="pill-row">
          {categories.map((name) => (
            <Link key={name} to="/blogs" className="pill">{name}</Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Recent Publications</h2>
        {rLoading ? (
          <LoadingSpinner />
        ) : rError ? (
          <ErrorMessage message={rError} />
        ) : (
          <div className="blog-grid">
            {recent.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      <section className="stats">
        <div className="container stats-inner">
          <div><strong>{meta?.total ?? 0}</strong><span>Articles</span></div>
          <div><strong>3</strong><span>Writers</span></div>
          <div><strong>{categories.length}</strong><span>Topics</span></div>
        </div>
      </section>
    </>
  );
}