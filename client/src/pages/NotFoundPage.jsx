import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container section not-found">
      <div className="not-found-glow" aria-hidden="true"></div>
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1>Lost in the stories?</h1>
      <p className="text-muted not-found-text">
        The page you are looking for does not exist or has been moved.
        Let's get you back to something worth reading.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-dark">Back to Home</Link>
        <Link to="/blogs" className="btn btn-outline">Browse articles</Link>
      </div>
    </div>
  );
}