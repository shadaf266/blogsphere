
import "./styles/components.css";

import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "./components/layout/Layout.jsx";

// Public pages
import HomePage from "./pages/HomePage.jsx";
import AuthorProfilePage from "./pages/AuthorProfilePage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import BlogListingPage from "./pages/BlogListingPage.jsx";
import AboutContactPage from "./pages/AboutContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";

// Authentication pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Protected pages
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import BlogEditorPage from "./pages/BlogEditorPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Admin pages
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminOverviewPage from "./pages/Admin/AdminOverviewPage.jsx";
import AdminBlogsPage from "./pages/Admin/AdminBlogsPage.jsx";
import AdminUsersPage from "./pages/Admin/AdminUsersPage.jsx";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage.jsx";
import AdminInquiriesPage from "./pages/Admin/AdminInquiriesPage.jsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>

                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs" element={<BlogListingPage />} />
                <Route path="/blogs/:slug" element={<BlogDetailPage />} />
                <Route path="/authors/:id" element={<AuthorProfilePage />} />
                <Route path="/about" element={<AboutContactPage />} />
                <Route path="/contact" element={<AboutContactPage />} />
                <Route path="/categories" element={<CategoriesPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                    path="/blogs/create"
                    element={
                        <ProtectedRoute>
                            <BlogEditorPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/blogs/edit/:id"
                    element={
                        <ProtectedRoute>
                            <BlogEditorPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bookmarks"
                    element={
                        <ProtectedRoute>
                            <BookmarksPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminOverviewPage />} />
                    <Route path="blogs" element={<AdminBlogsPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="inquiries" element={<AdminInquiriesPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />

            </Route>
        </Routes>
    );
}

export default App;
