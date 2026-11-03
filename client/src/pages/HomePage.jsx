import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import BlogCard from  "../components/blog/BlogCard.jsx";
import {mockBlogs} from "../data/mockBlogs.js";

export default function HomePage(){

    const [query,setQuery] = useState("");
    const navigate = useNavigate();
    const handleSearch = (e)=>{
        e.preventDefault();
        navigate(`/blogs?search=${encodeURIComponent(query)}`);
    }
    const featured = mockBlogs.slice(0,3);
    console.log(featured);

    const categories = ["Programming", "Design", "Technology", "Career", "Productivity"];

    const recent = mockBlogs.slice(3,6);

    return(
        <>
           <section className="hero"> 
            <div className="container hero-inner">
                <h1>Stories and ideas from developers who build</h1>
                <p>Read, write and share what you learn. Join the BlogSphere community.</p>
                <form onSubmit={handleSearch} className="hero-search">
                   <input type="search" 
                   placeholder="Search articles" 
                   value={query} 
                   onChange={(e)=>setQuery(e.target.value)} />
                   <button type="submit">Search</button>
                </form>
                <div className="hero-actions">
                    <Link to="/blogs" className="btn btn-dark">Start Reading</Link>
                    <Link to="/blogs/create" className="btn btn-outline">Write a Story</Link>
                    </div>
            </div>
           </section>
           <section className="container section">
            <h2>Featured Articles</h2>
            <div className="blog-grid">
                {featured.map((blog)=>(
                  <BlogCard key={blog._id} blog={blog}/>
                ))}
            </div>
           </section>

           <section className="container section">
            <h2>Trending Topics</h2>
            <div className="pill-row">
                {categories.map((name)=>(
                    <Link to="/blogs" key={name} className="pill" >{name}</Link>
                ))}
            </div>
           </section>

           <section className="container section">
            <h2>Recent Publications</h2>
            <div className="blog-grid">
                {recent.map((blog)=>(
                   <BlogCard key={blog._id} blog={blog} />
                ))}
            </div>
           </section>

           <section className="stats">
            <div className="container stats-inner">
                <div><strong>{mockBlogs.length}</strong><span>Articles</span></div>
                <div><strong>3</strong><span>Writers</span></div>
                <div><strong>5</strong><span>Topics</span></div>
            </div>
           </section>
        </>
    );
}