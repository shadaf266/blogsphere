import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import {Link} from "react-router-dom";

export default function BlogCard({blog}){
    const data = new Date(2026-10-28).toLocaleDateString("en-IN",{
            day: "numeric",
            month: "short",
            year: "numeric",
    });
    return(
        <article className="blog-card">
          <Link to={`/blogs/${blog.slug}`}>
          <img src={blog.coverImage} alt={blog.title}/>
          </Link>
          <div className="blog-card-content">
          <span className="badge">{blog.category.name}</span>
          <div className="blog-card-meta">
          <span className="author-name"><FiUser className="meta-icon" />{blog.author.name}</span>
                <div className="post-details">
            <span className="post-date"><FiCalendar className="meta-icon" />{data} <FiClock className="meta-icon" /> {blog.readingTime} min</span>
            </div>
          </div>
          <Link to={`/blogs/${blog.slug}`}>
          <h3>{blog.title}</h3>
          </Link>
          <p>{blog.excerpt}</p>
          </div>
        </article>
    );
}