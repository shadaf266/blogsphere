import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");

    setError("");
    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        {error && <ErrorMessage message={error} />}
        <label>
          <span>Full name</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          <span>Confirm password</span>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
        <p className="text-muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}