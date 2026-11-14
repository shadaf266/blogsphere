import useFetch from "../../hooks/useFetch.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AdminOverviewPage() {
  const { data, loading, error } = useFetch("/admin/stats");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const cards = [
    { label: "Users", value: data.users },
    { label: "Published blogs", value: data.published },
    { label: "Drafts", value: data.drafts },
    { label: "Comments", value: data.comments },
    { label: "New inquiries", value: data.inquiries },
    { label: "Total views", value: data.views },
  ];

  return (
    <>
      <h1>Overview</h1>
      <div className="admin-cards">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-recent">
        <div>
          <h2>New users</h2>
          <ul className="admin-list">
            {data.recentUsers.map((u) => (
              <li key={u._id}>
                <strong>{u.name}</strong>
                <span className="text-muted">{u.email} · {formatDate(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Latest articles</h2>
          <ul className="admin-list">
            {data.recentBlogs.map((b) => (
              <li key={b._id}>
                <strong>{b.title}</strong>
                <span className="text-muted">
                  {b.author?.name} · {b.status} · {formatDate(b.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}