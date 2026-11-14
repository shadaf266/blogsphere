import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Pagination from "../../components/blog/Pagination.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    api
      .get("/admin/users", { params })
      .then((res) => {
        setUsers(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load users"))
      .finally(() => setLoading(false));
  }, [page, search, reload]);

  const refresh = () => setReload((n) => n + 1);

  const changeRole = async (u, role) => {
    setError("");
    try {
      await api.patch(`/admin/users/${u._id}/role`, { role });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change the role");
    }
  };

  const toggleSuspend = async (u) => {
    setError("");
    try {
      await api.patch(`/admin/users/${u._id}/status`, { isSuspended: !u.isSuspended });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change the account status");
    }
  };

  return (
    <>
      <h1>Users</h1>

      <form
        className="admin-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(input.trim());
        }}
      >
        <input
          type="search"
          className="search-input"
          placeholder="Search by name or email"
          aria-label="Search users"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-dark">Search</button>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <p className="text-muted">No users match.</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = u._id === me._id;
                  return (
                    <tr key={u._id}>
                      <td className="cell-title">{u.name}{isMe && " (you)"}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="role-select"
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          disabled={isMe}
                          onChange={(e) => changeRole(u, e.target.value)}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status ${u.isSuspended ? "status-suspended" : "status-published"}`}>
                          {u.isSuspended ? "suspended" : "active"}
                        </span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="cell-actions">
                        <button
                          type="button"
                          className="link-btn danger"
                          disabled={isMe}
                          onClick={() => toggleSuspend(u)}
                        >
                          {u.isSuspended ? "Reactivate" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPage={setPage} />
        </>
      )}
    </>
  );
}