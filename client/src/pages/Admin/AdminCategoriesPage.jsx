
import { useCallback, useEffect, useState } from "react";

import api from "../../services/api.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const emptyForm = {
    name: "",
    description: "",
    icon: ""
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const res = await api.get("/categories");
            setCategories(res.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load categories"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error) setError("");
    };

    // Start editing
    const startEdit = (category) => {
        setEditingId(category._id);

        setForm({
            name: category.name,
            description: category.description || "",
            icon: category.icon || ""
        });

        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
    };

    // Create or update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = form.name.trim();

        if (!name) {
            setError("Category name is required");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const payload = {
                ...form,
                name,
                description: form.description.trim(),
                icon: form.icon.trim()
            };

            if (editingId) {
                await api.put(`/categories/${editingId}`, payload);
            } else {
                await api.post("/categories", payload);
            }

            cancelEdit();
            await fetchCategories();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not save the category"
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete category
    const confirmDelete = async () => {
        if (!toDelete || deleting) return;

        setDeleting(true);
        setError("");

        try {
            await api.delete(`/categories/${toDelete._id}`);

            setToDelete(null);
            await fetchCategories();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not delete the category"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h1>Categories</h1>
                    <p className="text-muted">
                        Manage the categories used across your articles.
                    </p>
                </div>
            </div>

            {/* Category Form */}
            <form
                className="category-form"
                onSubmit={handleSubmit}
            >
                <h3>
                    {editingId ? "Edit Category" : "Add New Category"}
                </h3>

                <input
                    type="text"
                    name="name"
                    placeholder="Category name"
                    aria-label="Category name"
                    maxLength={40}
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Short description"
                    aria-label="Description"
                    maxLength={200}
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="icon"
                    placeholder="Icon (optional)"
                    aria-label="Icon"
                    value={form.icon}
                    onChange={handleChange}
                />

                <div className="category-form-actions">
                    <button
                        type="submit"
                        className="btn btn-dark"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Save Changes"
                                : "Add Category"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={cancelEdit}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <ErrorMessage message={error} />
            )}

            {/* Categories Table */}
            {loading ? (
                <LoadingSpinner />
            ) : categories.length === 0 ? (
                <div className="empty-state">
                    <h3>No categories found</h3>
                    <p>Create your first category to get started.</p>
                </div>
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
                            {categories.map((category) => (
                                <tr key={category._id}>
                                    <td className="cell-title">
                                        {category.name}
                                    </td>

                                    <td>{category.slug}</td>

                                    <td className="cell-title">
                                        {category.description || "—"}
                                    </td>

                                    <td>{category.blogCount ?? 0}</td>

                                    <td className="cell-actions">
                                        <button
                                            type="button"
                                            className="link-btn"
                                            onClick={() => startEdit(category)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="link-btn danger"
                                            onClick={() => setToDelete(category)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation */}
            {toDelete && (
                <div
                    className="modal-overlay"
                    onClick={() => !deleting && setToDelete(null)}
                >
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-category-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 id="delete-category-title">
                            Delete this category?
                        </h3>

                        <p className="text-muted">
                            "{toDelete.name}" will be removed.
                            Categories used by articles cannot be deleted.
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setToDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={confirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
