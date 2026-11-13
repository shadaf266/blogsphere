import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("published");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/blogs/my/all"), api.get("/blogs/my/stats")])
      .then(([blogsRes, statsRes]) => {
        setBlogs(blogsRes.data.data);
        setStats(statsRes.data.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load your dashboard"))
      .finally(() => setLoading(false));
  }, [reload]);

  const refresh = () => setReload((n) => n + 1);

  const toggleStatus = async (blog) => {
    try {
      const action = blog.status === "published" ? "unpublish" : "publish";
      await api.patch(`/blogs/${blog._id}/${action}`);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change the status");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/blogs/${toDelete._id}`);
      setToDelete(null);
      refresh();
    } catch (err) {
      setToDelete(null);
      setError(err.response?.data?.message || "Could not delete the article");
    }
  };

  const shown = blogs.filter((b) => b.status === tab);

  if (loading && !stats) {
    return (
      <div className="container section">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="dash-head">
        <div>
          <h1>Your dashboard</h1>
          <p className="text-muted">Welcome back, {user.name.split(" ")[0]}.</p>
        </div>
        <Link to="/blogs/create" className="btn btn-dark">Write a story</Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {stats && (
        <div className="stat-cards">
          <div className="stat-card"><strong>{stats.total}</strong><span>Articles</span></div>
          <div className="stat-card"><strong>{stats.views}</strong><span>Views</span></div>
          <div className="stat-card"><strong>{stats.likes}</strong><span>Likes</span></div>
          <div className="stat-card"><strong>{stats.drafts}</strong><span>Drafts</span></div>
        </div>
      )}

      <div className="editor-tabs dash-tabs">
        <button className={tab === "published" ? "active" : ""} onClick={() => setTab("published")}>
          Published ({stats?.published ?? 0})
        </button>
        <button className={tab === "draft" ? "active" : ""} onClick={() => setTab("draft")}>
          Drafts ({stats?.drafts ?? 0})
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="text-muted dash-empty">
          {tab === "published" ? "No published articles yet." : "No drafts yet."}
        </p>
      ) : (
        <ul className="dash-list">
          {shown.map((blog) => (
            <li key={blog._id} className="dash-row">
              <div className="dash-info">
                <strong>{blog.title}</strong>
                <span className="text-muted">
                  {blog.category.name} · {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {blog.viewsCount} views · {blog.likesCount} likes
                </span>
              </div>
              <div className="dash-actions">
                {blog.status === "published" && (
                  <Link to={`/blogs/${blog.slug}`}>View</Link>
                )}
                <Link to={`/blogs/edit/${blog._id}`}>Edit</Link>
                <button onClick={() => toggleStatus(blog)}>
                  {blog.status === "published" ? "Unpublish" : "Publish now"}
                </button>
                <button className="danger" onClick={() => setToDelete(blog)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete this article?</h3>
            <p className="text-muted">
              "{toDelete.title}" will be permanently removed. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}