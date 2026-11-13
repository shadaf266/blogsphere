import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BookmarkButton({ blogId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    api
      .get(`/bookmarks/check/${blogId}`)
      .then((res) => setSaved(res.data.data.bookmarked))
      .catch(() => {});
  }, [blogId, user]);

  const toggle = async () => {
    if (!user) return navigate("/login", { state: { from: location } });
    if (busy) return;

    setBusy(true);
    const next = !saved;
    setSaved(next);

    try {
      if (next) await api.post(`/bookmarks/${blogId}`);
      else await api.delete(`/bookmarks/${blogId}`);
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`engage-btn ${saved ? "saved" : ""}`}
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from reading list" : "Save to reading list"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}