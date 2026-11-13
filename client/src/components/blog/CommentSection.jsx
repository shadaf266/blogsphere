import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function CommentSection({ blogId }) {
  const { user } = useAuth();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    api
      .get(`/blogs/${blogId}/comments`)
      .then((res) => setComments(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load comments"))
      .finally(() => setLoading(false));
  }, [blogId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setError("Write something before posting");
    setError("");
    setPosting(true);
    try {
      const res = await api.post(`/blogs/${blogId}/comments`, { content: text });
      setComments([res.data.data, ...comments]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your comment");
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.content);
  };

  const handleSave = async (id) => {
    if (!editText.trim()) return setError("A comment cannot be empty");
    setError("");
    try {
      const res = await api.patch(`/comments/${id}`, { content: editText });
      setComments(comments.map((c) => (c._id === id ? res.data.data : c)));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your changes");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/comments/${toDelete._id}`);
      setComments(comments.filter((c) => c._id !== toDelete._id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the comment");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <section className="comments">
      <h2>Comments ({comments.length})</h2>

      {user ? (
        <form className="comment-form" onSubmit={handleAdd}>
          <textarea
            rows="3"
            maxLength={1000}
            placeholder="Share your thoughts"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-dark" disabled={posting}>
            {posting ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="text-muted comment-login">
          <Link to="/login" state={{ from: location }}>Log in</Link> to join the discussion.
        </p>
      )}

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => {
            const isOwner = user && comment.author?._id === user._id;
            const canDelete = isOwner || user?.role === "admin";
            return (
              <li key={comment._id} className="comment">
                <div className="comment-avatar">{comment.author?.name?.charAt(0) || "?"}</div>
                <div className="comment-main">
                  <div className="comment-meta">
                    <strong>{comment.author?.name || "Deleted user"}</strong>
                    <span className="text-muted">
                      {formatDate(comment.createdAt)}
                      {comment.isEdited && " (edited)"}
                    </span>
                  </div>

                  {editingId === comment._id ? (
                    <div className="comment-edit">
                      <textarea rows="3" maxLength={1000} value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div className="comment-actions">
                        <button onClick={() => handleSave(comment._id)}>Save</button>
                        <button onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{comment.content}</p>
                      {(isOwner || canDelete) && (
                        <div className="comment-actions">
                          {isOwner && <button onClick={() => startEdit(comment)}>Edit</button>}
                          {canDelete && (
                            <button className="danger" onClick={() => setToDelete(comment)}>Delete</button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this comment?</h3>
            <p className="text-muted">This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}