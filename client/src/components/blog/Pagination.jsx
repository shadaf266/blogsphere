export default function Pagination({ meta, onPage }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, hasPrev, hasNext } = meta;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={!hasPrev} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="pagination-gap">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === page ? "active" : ""}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        )
      )}
      <button type="button" disabled={!hasNext} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </nav>
  );
}