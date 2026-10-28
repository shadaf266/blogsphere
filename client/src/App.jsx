import BlogCard from "./components/blog/BlogCard";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar"
import './styles/components.css';
import { mockBlogs } from "./data/mockBlogs";
function App() {
  return (
    <main>
      <Navbar/>
      <main className="content-container">
        <div className="container blog-grid">
        {mockBlogs.map((blog) => (
           <BlogCard key={blog._id} blog={blog}/>
          ))}
          </div>
      </main>
      <Footer/>
    </main>
  )
}

export default App
