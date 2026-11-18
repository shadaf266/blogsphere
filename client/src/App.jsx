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
import { Navigate } from "react-router-dom";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminOverviewPage from "./pages/Admin/AdminOverviewPage.jsx";
import AdminBlogsPage from "./pages/Admin/AdminBlogsPage.jsx";
import AdminUsersPage from "./pages/Admin/AdminUsersPage.jsx";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage.jsx";
import AdminInquiriesPage from "./pages/Admin/AdminInquiriesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
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
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverviewPage />} />
        <Route path="blogs" element={<AdminBlogsPage />} />
        <Route path="users" element={<AdminUsersPage />} />  
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} /> 
      </Route>
      </Route>
     </Routes>
     
  )
}

export default App
