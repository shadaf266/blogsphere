export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="pill-row" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`pill ${active === "" ? "pill-active" : ""}`}
        onClick={() => onSelect("")}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          type="button"
          className={`pill ${active === c.slug ? "pill-active" : ""}`}
          onClick={() => onSelect(c.slug)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}