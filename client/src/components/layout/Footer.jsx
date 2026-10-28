import { Link } from "react-router-dom";

const categories = ["Technology", "Design", "Programming", "Career", "Productivity"];

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link to="/" className="footer-logo">
            <img src="/blogsphere-logo.svg" alt="BlogSphere" />
          </Link>
          <h4>About</h4>
          <p>
            BlogSphere is a place for developers to read, write and share ideas.
            Built as a MERN stack capstone project.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-list">
            <li><Link to="/blogs">Explore</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/blogs/create">Write</Link></li>
          </ul>
        </div>

        <div>
          <h4>Categories</h4>
          <div className="footer-tags">
            {categories.map((name) => (
              <Link key={name} to="/blogs" className="footer-tag">
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4>Newsletter</h4>
          <p>Get the best new stories in your inbox.</p>
          <form className="footer-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 BlogSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}