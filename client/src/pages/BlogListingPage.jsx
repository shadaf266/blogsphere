import BlogCard from "../components/blog/BlogCard.jsx";
import { mockBlogs } from "../data/mockBlogs.js";
export default function BLogListingPage(){
    return(
        <div className="container section">
            <h1>Explore</h1>
            <p>Discover stories, ideas and tutorials from our writers.</p>
            <div className="blog-grid">
                {mockBlogs.map((blog)=>(
                     <BlogCard key={blog._id} blog={blog}/>
                ))}
            </div>
        </div>
    )
}