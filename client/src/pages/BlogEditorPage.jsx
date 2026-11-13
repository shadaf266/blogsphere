import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

const emptyForm = { title: "", excerpt: "", content: "", coverImage: "", category: "", tags: "" };

export default function BlogEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: categories } = useFetch("/categories");

  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get("/blogs/my/all")
      .then((res) => {
        const blog = res.data.data.find((b) => b._id === id);
        if (!blog) {
          setError("Blog not found");
          return;
        }
        setForm({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage || "",
          category: blog.category._id,
          tags: blog.tags.join(", "),
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load blog"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (status) => {
    if (form.title.trim().length < 5) return setError("Title must be at least 5 characters");
    if (!form.excerpt.trim()) return setError("Excerpt is required");
    if (!form.content.trim()) return setError("Content is required");
    if (!form.category) return setError("Choose a category");

    setError("");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverImage: form.coverImage.trim(),
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
    };

    try {
      if (isEdit) await api.put(`/blogs/${id}`, payload);
      else await api.post("/blogs", payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container section">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container section editor">
      <Link className="back-link" to="/dashboard">← Back to dashboard</Link>
      <h1>{isEdit ? "Edit article" : "Write a new article"}</h1>
      {error && <ErrorMessage message={error} />}

      <div className="editor-form">
        <label className="full-width">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} placeholder="A clear, specific title" />
        </label>

        <label className="full-width">
          <span>Excerpt ({form.excerpt.length}/250)</span>
          <textarea name="excerpt" rows="2" maxLength={250} value={form.excerpt} onChange={handleChange} placeholder="A short summary for the article card" />
        </label>

        <label>
          <span>Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {(categories || []).map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Tags (comma separated)</span>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, node, api" />
        </label>

        <label className="full-width">
          <span>Cover image URL</span>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
        </label>
        {form.coverImage && (
          <img className="full-width editor-cover" src={form.coverImage} alt="Cover preview" />
        )}

        <div className="full-width editor-tabs">
          <button type="button" className={!preview ? "active" : ""} onClick={() => setPreview(false)}>Write</button>
          <button type="button" className={preview ? "active" : ""} onClick={() => setPreview(true)}>Preview</button>
        </div>

        {preview ? (
          <div className="full-width article-body editor-preview">
            {form.content.split("\n\n").map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        ) : (
          <textarea className="full-width" name="content" rows="14" value={form.content} onChange={handleChange} placeholder="Write your article. Leave a blank line between paragraphs." />
        )}

        <div className="full-width editor-actions">
          <button type="button" className="btn btn-outline" disabled={saving} onClick={() => save("draft")}>
            Save as draft
          </button>
          <button type="button" className="btn btn-dark" disabled={saving} onClick={() => save("published")}>
            {saving ? "Saving..." : "Publish article"}
          </button>
        </div>
      </div>
    </div>
  );
}