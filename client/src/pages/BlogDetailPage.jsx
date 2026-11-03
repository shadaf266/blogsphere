import { useParams } from "react-router-dom";
import { mockBlogs } from "../data/mockBlogs";
import { Link } from "react-router-dom";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const blog = mockBlogs.find((b) => b.slug == slug);

  if (!blog) {
    return (
      <div className="container section">
        <h1>Article not found</h1>
        <Link className="back-link" to="/blogs">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const sampleBody = [
    "Every great project starts with a clear idea and a small first step. In this article we walk through the process from the first line of code to a working result.",
    "The key is to build in small pieces and check each one before moving on. When something breaks, you know exactly where to look.",
    "By the end, you will have a solid understanding of the concept and a working example you can adapt for your own projects.",
  ];

  const authorIds = {
    "Asha Verma": "a1",
    "Ravi Menon": "a2",
    "Neha Kapoor": "a3",
  };

  mockBlogs.forEach((blog) => {
    blog.content = sampleBody;
    blog.author._id = authorIds[blog.author.name];
  });
  return (
    <div className="container section">
      <Link className="back-link" to="/blogs">
        ← Back to Explore
      </Link>
      <article className="article">
        <span className="badge">{blog.category.name}</span>
        <h1>{blog.title}</h1>
        <div className="article-meta">
          <Link className="author-link" to={`/authors/${blog.author._id}`}>
            <FiUser className="meta-icon" /> {blog.author.name}
          </Link>
          <span>
            <FiCalendar className="meta-icon" /> {date}
          </span>
          <span>
            <FiClock className="meta-icon" /> {blog.readingTime} min read
          </span>
        </div>
        <img src={blog.coverImage} alt={blog.title} className="article-cover" />
        <p className="article-lead">{blog.excerpt}</p>
        <div className="article-body">
          {blog.content.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
