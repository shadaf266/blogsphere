import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LikeButton({ blogId, initialCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }
    api
      .get(`/blogs/${blogId}/like-status`)
      .then((res) => {
        setLiked(res.data.data.liked);
        setCount(res.data.data.likesCount);
      })
      .catch(() => {});
  }, [blogId, user]);

  const toggle = async () => {
    if (!user) return navigate("/login", { state: { from: location } });
    if (busy) return;

    setBusy(true);
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    try {
      const res = next
        ? await api.post(`/blogs/${blogId}/like`)
        : await api.delete(`/blogs/${blogId}/like`);
      setCount(res.data.data.likesCount);
    } catch {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`engage-btn ${liked ? "liked" : ""}`}
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this article" : "Like this article"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c4 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21z" />
      </svg>
      <span>{count}</span>
    </button>
  );
}