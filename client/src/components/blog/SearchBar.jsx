import { useEffect, useState } from "react";

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => onSearch(text), 400);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <input
      type="search"
      className="search-input"
      placeholder="Search articles"
      aria-label="Search articles"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}