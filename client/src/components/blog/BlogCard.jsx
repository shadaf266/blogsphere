import { Link } from "react-router-dom";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";

export default function BlogCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="blog-card">
      <Link to={`/blogs/${blog.slug}`} className="blog-card-image">
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </Link>

      <div className="blog-card-content">
        <span className="badge">{blog.category.name}</span>

        <div className="blog-card-meta">
          <Link className="author-link" to={`/authors/${blog.author._id}`}>
            <span className="author-name">
              <FiUser className="meta-icon" />
              {blog.author.name}
            </span>
          </Link>
          <div className="post-details">
            <span className="post-date">
              <FiCalendar className="meta-icon" />
              {date}
            </span>
            <span>
              <FiClock className="meta-icon" />
              {blog.readingTime} min
            </span>
          </div>
        </div>

        <h3>
          <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p>{blog.excerpt}</p>
      </div>
    </article>
  );
}