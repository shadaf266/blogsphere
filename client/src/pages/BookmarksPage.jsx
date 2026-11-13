import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import BlogCard from "../components/blog/BlogCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function BookmarksPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    api
      .get("/bookmarks")
      .then((res) => setBlogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load your reading list"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    setError("");
    setRemovingId(id);
    try {
      await api.delete(`/bookmarks/${id}`);
      setTimeout(() => {
        setBlogs((current) => current.filter((b) => b._id !== id));
        setRemovingId(null);
      }, 250);
    } catch (err) {
      setRemovingId(null);
      setError(err.response?.data?.message || "Could not remove the bookmark");
    }
  };

  return (
    <div className="container section">
      <h1>Your reading list</h1>
      <p>Articles you saved for later.</p>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <h2>Nothing saved yet</h2>
          <p className="text-muted">Tap Save on any article and it will appear here.</p>
          <Link to="/blogs" className="btn btn-dark">Browse articles</Link>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={removingId === blog._id ? "bookmark-item removing" : "bookmark-item"}
            >
              <BlogCard blog={blog} />
              <button
                type="button"
                className="bookmark-remove"
                onClick={() => handleRemove(blog._id)}
                aria-label={`Remove ${blog.title} from your reading list`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}