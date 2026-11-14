import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    api
      .get("/admin/blogs", { params })
      .then((res) => setBlogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load blogs"))
      .finally(() => setLoading(false));
  }, [status, search, reload]);

  const refresh = () => setReload((n) => n + 1);

  const toggleFeature = async (blog) => {
    setError("");
    try {
      await api.patch(`/admin/blogs/${blog._id}/feature`);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change the featured flag");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/blogs/${toDelete._id}`);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the article");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <h1>All blogs</h1>

      <form
        className="admin-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(input.trim());
        }}
      >
        <input
          type="search"
          className="search-input"
          placeholder="Search by title"
          aria-label="Search by title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select className="sort-select" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className="btn btn-dark">Search</button>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : blogs.length === 0 ? (
        <p className="text-muted">No articles match.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="cell-title">{blog.title}</td>
                  <td>{blog.author?.name || "Deleted user"}</td>
                  <td><span className={`status status-${blog.status}`}>{blog.status}</span></td>
                  <td>
                    <button
                      type="button"
                      className={`link-btn ${blog.isFeatured ? "on" : ""}`}
                      onClick={() => toggleFeature(blog)}
                    >
                      {blog.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  </td>
                  <td>{formatDate(blog.createdAt)}</td>
                  <td className="cell-actions">
                    {blog.status === "published" && <Link to={`/blogs/${blog.slug}`}>View</Link>}
                    <button type="button" className="link-btn danger" onClick={() => setToDelete(blog)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this article?</h3>
            <p className="text-muted">
              "{toDelete.title}" and its comments, likes and bookmarks will be permanently removed.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}