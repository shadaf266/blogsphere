import './styles/components.css';
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "../src/pages/HomePage.jsx";
import AuthorProfilePage from "../src/pages/AuthorProfilePage.jsx";
import BlogDetailPage from "../src/pages/BlogDetailPage.jsx";
import BLogListingPage from "../src/pages/BlogListingPage.jsx";
import NotFoundPage from "../src//pages/NotFoundPage.jsx";
import AboutContactPage from "../src/pages/AboutContactPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import BlogEditorPage from "./pages/BlogEditorPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
function App() {
  return (
     <Routes>
      <Route element={<Layout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/blogs/create" element={<ProtectedRoute><BlogEditorPage /></ProtectedRoute>} />
      <Route path="/blogs/edit/:id" element={<ProtectedRoute><BlogEditorPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/" element={<HomePage/>}/>
      <Route path="/authors/:id" element={<AuthorProfilePage/>}/>
      <Route path="/blogs" element={<BLogListingPage/>}/>
      <Route path="/blogs/:slug" element={<BlogDetailPage/>}/>
      <Route path="/about" element={<AboutContactPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
      <Route path="/contact" element={<AboutContactPage/>}/>
      </Route>
     </Routes>
  )
}

export default App
