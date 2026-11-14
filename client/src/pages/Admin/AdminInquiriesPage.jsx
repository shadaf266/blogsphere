import { useEffect, useState } from "react";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminInquiriesPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/inquiries", { params: filter ? { status: filter } : {} })
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load inquiries"))
      .finally(() => setLoading(false));
  }, [filter]);

  const setStatus = async (id, status) => {
    setError("");
    try {
      const res = await api.patch(`/admin/inquiries/${id}/status`, { status });
      setItems(items.map((i) => (i._id === id ? res.data.data : i)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the status");
    }
  };

  const toggleOpen = (item) => {
    const opening = openId !== item._id;
    setOpenId(opening ? item._id : null);
    if (opening && item.status === "new") setStatus(item._id, "read");
  };

  return (
    <>
      <h1>Inquiries</h1>

      <div className="admin-toolbar">
        <select className="sort-select" aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <ul className="inquiry-list">
          {items.map((item) => (
            <li key={item._id} className="inquiry">
              <button
                type="button"
                className="inquiry-head"
                aria-expanded={openId === item._id}
                onClick={() => toggleOpen(item)}
              >
                <span className="inquiry-subject">
                  {item.status === "new" && <span className="dot" aria-label="New" />}
                  {item.subject}
                </span>
                <span className="text-muted">
                  {item.name} · {formatDate(item.createdAt)}
                </span>
                <span className={`status status-${item.status === "resolved" ? "published" : item.status === "new" ? "draft" : ""}`}>
                  {item.status}
                </span>
              </button>

              {openId === item._id && (
                <div className="inquiry-body">
                  <p className="text-muted">
                    From <strong>{item.name}</strong> ·{" "}
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </p>
                  <p>{item.message}</p>
                  <div className="comment-actions">
                    {item.status !== "resolved" ? (
                      <button type="button" onClick={() => setStatus(item._id, "resolved")}>Mark resolved</button>
                    ) : (
                      <button type="button" onClick={() => setStatus(item._id, "read")}>Reopen</button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}