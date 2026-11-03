import { useParams,Link } from "react-router-dom";
import { mockBlogs } from "../data/mockBlogs.js";
import BlogCard from "../components/blog/BlogCard.jsx";



export default function AuthorProfilePage(){
    const {id} = useParams();
    const authorBlogs = mockBlogs.filter((blog)=> blog.author._id === id );
    const author = authorBlogs[0]?.author;
    if (!author) {
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
      <div className="author-avatar">
        {author.name.charAt(0)}
      </div>
      <div>
        <h1>{author.name}</h1>
        <p className="text-muted">
          Writes about web development, design and building products.
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