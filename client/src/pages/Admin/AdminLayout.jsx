import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Overview" },
  { to: "/admin/blogs", label: "All blogs" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminLayout() {
  return (
    <div className="container section admin-shell">
      <aside className="admin-side">
        <h2>Admin</h2>
        <nav aria-label="Admin sections">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}