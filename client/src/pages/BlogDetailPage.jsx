import { Link, useParams } from "react-router-dom";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import useFetch from "../hooks/useFetch.js";
import LikeButton from "../components/blog/LikeButton.jsx";
import BookmarkButton from "../components/blog/BookmarkButton.jsx";
import CommentSection from "../components/blog/CommentSection.jsx";
export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/slug/${slug}`);

  if (loading) {
    return (
      <div className="container section">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container section">
        <h1>Article not found</h1>
        <Link className="back-link" to="/blogs">← Back to Explore</Link>
      </div>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="container section">
      <Link className="back-link" to="/blogs">← Back to Explore</Link>
      <article className="article">
        <span className="badge">{blog.category.name}</span>
        <h1>{blog.title}</h1>
        <div className="article-meta">
          <Link className="author-link" to={`/authors/${blog.author._id}`}>
            <FiUser className="meta-icon" /> {blog.author.name}
          </Link>
          <span><FiCalendar className="meta-icon" /> {date}</span>
          <span><FiClock className="meta-icon" /> {blog.readingTime} min read</span>
        </div>
        <div className="engage-bar">
          <LikeButton blogId={blog._id} initialCount={blog.likesCount} />
           <BookmarkButton blogId={blog._id} />
         </div>
        <img src={blog.coverImage} alt={blog.title} className="article-cover" />
        <p className="article-lead">{blog.excerpt}</p>
        <div className="article-body">
          {blog.content.split("\n\n").map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </article>
      <CommentSection blogId={blog._id} />
    </div>
  );
}