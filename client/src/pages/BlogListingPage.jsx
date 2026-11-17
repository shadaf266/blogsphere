import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard.jsx";
import SearchBar from "../components/blog/SearchBar.jsx";
import CategoryFilter from "../components/blog/CategoryFilter.jsx";
import Pagination from "../components/blog/Pagination.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useFetch from "../hooks/useFetch.js";

const LIMIT = 6;

export default function BlogListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  const { data: categories } = useFetch("/categories");
  const { data: tags } = useFetch("/tags/popular");

  const params = { page, limit: LIMIT, sort };
  if (search) params.search = search;
  if (category) params.category = category;
  if (tag) params.tag = tag;

  const { data: blogs, meta, loading, error } = useFetch("/blogs", params);

  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in changes)) next.delete("page");
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams({});

  const categoryName = (categories || []).find((c) => c.slug === category)?.name;
  const hasFilters = search || category || tag;

  return (
    <div className="container section">
      <h1>Explore</h1>
      <p>Discover stories, ideas and tutorials from our writers.</p>

      <div className="explore-toolbar">
        <SearchBar value={search} onSearch={(text) => update({ search: text.trim() })} />
        <select
          className="sort-select"
          aria-label="Sort articles"
          value={sort}
          onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most liked</option>
        </select>
      </div>

      <CategoryFilter
        categories={categories || []}
        active={category}
        onSelect={(slug) => update({ category: slug })}
      />

      {tags && tags.length > 0 && (
        <div className="tag-row">
          <span className="text-muted">Tags:</span>
          {tags.map((t) => (
            <button
              key={t.name}
              type="button"
              className={`tag-chip ${tag === t.name ? "active" : ""}`}
              onClick={() => update({ tag: tag === t.name ? "" : t.name })}
            >
              #{t.name}
            </button>
          ))}
        </div>
      )}

      {hasFilters && (
        <div className="active-filters">
          {search && <span className="filter-badge">Search: {search}</span>}
          {categoryName && <span className="filter-badge">Category: {categoryName}</span>}
          {tag && <span className="filter-badge">Tag: #{tag}</span>}
          <button type="button" className="clear-filters" onClick={clearAll}>
            Clear all filters
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <h2>No articles found</h2>
          <p className="text-muted">Try a different search, or clear the filters.</p>
          {hasFilters && (
            <button type="button" className="btn btn-dark" onClick={clearAll}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-muted result-count">
            {meta.total} {meta.total === 1 ? "article" : "articles"}
          </p>
          <div className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
            <Pagination
              meta={meta}
              onPage={(p) => {
                update({ page: p > 1 ? String(p) : "" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />       
 </>
      )}
    </div>
  );
}