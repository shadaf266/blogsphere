import BlogCard from "../components/blog/BlogCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useFetch from "../hooks/useFetch.js";
export default function BLogListingPage(){
      const { data: blogs, loading, error } = useFetch("/blogs", { limit: 50 });

    return(
        <div className="container section">
            <h1>Explore</h1>
            <p>Discover stories, ideas and tutorials from our writers.</p>
            {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
        </div>
    )
}