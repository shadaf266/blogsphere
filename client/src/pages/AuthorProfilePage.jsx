import { Link, useParams } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import useFetch from "../hooks/useFetch.js";

export default function AuthorProfilePage() {
  const { id } = useParams();
  const { data: authorBlogs, loading, error } = useFetch("/blogs", {
    author: id,
    limit: 50,
  });

  if (loading) {
    return (
      <div className="container section">
        <LoadingSpinner />
      </div>
    );
  }

  const author = authorBlogs?.[0]?.author;

  if (error || !author) {
    return (
      <div className="container section">
        <h1>Author not found</h1>
        <Link className="back-link" to="/blogs">← Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <header className="author-header">
        <div className="author-avatar">{author.name.charAt(0)}</div>
        <div>
          <h1>{author.name}</h1>
          <p className="text-muted">
            {author.bio || "Writes about web development, design and building products."}
          </p>
          <div className="author-stats">
            <span><strong>{authorBlogs.length}</strong> Articles</span>
            <span>Member since 2026</span>
          </div>
        </div>
      </header>

      <h2>Articles by {author.name}</h2>
      <div className="blog-grid">
        {authorBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}