import { useEffect, useState } from "react";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const emptyForm = { name: "", description: "", icon: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load categories"))
      .finally(() => setLoading(false));
  }, [reload]);

  const refresh = () => setReload((n) => n + 1);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description || "", icon: c.icon || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Category name is required");
    setError("");
    setSaving(true);
    try {
      if (editingId) await api.put(`/categories/${editingId}`, form);
      else await api.post("/categories", form);
      cancelEdit();
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the category");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${toDelete._id}`);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the category");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <h1>Categories</h1>

      <form className="category-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category name"
          aria-label="Category name"
          maxLength={40}
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Short description"
          aria-label="Description"
          maxLength={200}
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="icon"
          placeholder="Icon (optional)"
          aria-label="Icon"
          value={form.icon}
          onChange={handleChange}
        />
        <div className="category-form-actions">
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add category"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Articles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td className="cell-title">{c.name}</td>
                  <td>{c.slug}</td>
                  <td className="cell-title">{c.description || "—"}</td>
                  <td>{c.blogCount}</td>
                  <td className="cell-actions">
                    <button type="button" className="link-btn" onClick={() => startEdit(c)}>Edit</button>
                    <button type="button" className="link-btn danger" onClick={() => setToDelete(c)}>Delete</button>
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
            <h3>Delete this category?</h3>
            <p className="text-muted">
              "{toDelete.name}" will be removed. Categories that articles use can't be deleted.
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