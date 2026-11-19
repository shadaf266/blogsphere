
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get("/categories");
                setCategories(data.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load categories."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((category) =>
        `${category.name} ${category.description || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <> 
            <section className="container section">
                <h1>Explore by Category</h1>

                <p>
                    Discover ideas, insights and stories
                    across topics that matter to you.
                </p>

                <div className="categories-search">
                    <input
                        type="search"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            <section className="container section">
                {error && <ErrorMessage message={error} />}

                {!error && filteredCategories.length === 0 ? (
                    <div className="categories-empty">
                        <h3>No categories found</h3>
                        <p>Try searching for another topic.</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {filteredCategories.map((category) => (
                            <Link
                                to={`/blogs?category=${encodeURIComponent(category.slug)}`}
                                className="category-card"
                                key={category._id}
                            >
                                <div className="category-card-icon">
                                    {category.icon || "✦"}
                                </div>

                                <h2>{category.name}</h2>

                                <p>
                                    {category.description ||
                                        "Explore articles in this category."}
                                </p>

                                <div className="category-card-footer">
                                    <span>
                                        {category.blogCount}{" "}
                                        {category.blogCount === 1
                                            ? "Article"
                                            : "Articles"}
                                    </span>

                                    <span className="category-arrow">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
